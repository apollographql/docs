import InlineCode from './InlineCode';
import PropTypes from 'prop-types';
import React, {useMemo} from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  Heading,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  chakra
} from '@chakra-ui/react';
import {PrimaryLink} from './RelativeLink';
import {extend, partition} from 'lodash';
import {graphql, useStaticQuery} from 'gatsby';

function _allText(data) {
  return [data.shortText, data.text].filter(Boolean).join('\n\n');
}

function _summary(rawData) {
  if (rawData.comment) {
    return _allText(rawData.comment);
  }
  return (
    rawData.signatures &&
    rawData.signatures[0].comment &&
    _allText(rawData.signatures[0].comment)
  );
}

function _isReflectedProperty(data) {
  return (
    data.kindString === 'Property' &&
    data.type &&
    data.type.type === 'reflection'
  );
}

function _parameterString(names, leftDelim, rightDelim) {
  leftDelim = leftDelim || '(';
  rightDelim = rightDelim || ')';
  return leftDelim + names.join(', ') + rightDelim;
}

function _typeId(type) {
  return type.fullName || type.name;
}

function isReadableName(name) {
  return name.substring(0, 2) !== '__';
}

function mdToReact(text) {
  const sanitized = text
    .replace(/\{@link (\w*)\}/g, '[$1](#$1)')
    .replace(/<p ?\/>/g, '');
  return (
    <ReactMarkdown
      components={{
        p: Text,
        a: PrimaryLink,
        code: InlineCode
      }}
    >
      {sanitized}
    </ReactMarkdown>
  );
}

export default function TypeScriptApiBox({name}) {
  const data = useStaticQuery(
    graphql`
      {
        file(
          base: {eq: "docs.json"}
          sourceInstanceName: {eq: "__PROGRAMMATIC__"}
        ) {
          fields {
            content
          }
        }
      }
    `
  );

  const {content} = data.file.fields;
  const dataByKey = useMemo(() => {
    const dataByKey = {};

    function traverse(tree, parentName) {
      let {name} = tree;
      if (['Constructor', 'Method', 'Property'].includes(tree.kindString)) {
        name = `${parentName}.${tree.name}`;
        // add the parentName to the data so we can reference it for ids
        tree.parentName = parentName;
        tree.fullName = name;
      }

      dataByKey[name] = tree;

      if (tree.children) {
        tree.children.forEach(child => traverse(child, name));
      }
    }

    const docs = JSON.parse(content);
    traverse(docs);

    return dataByKey;
  }, [content]);

  const rawData = dataByKey[name];

  if (!rawData) {
    // TODO: account for things that past versions may reference, but have
    // been removed in current version docs.json
    return null;
  }

  // This is just literally the name of the type, nothing fancy, except for references
  function _typeName(type) {
    if (type.type === 'instrinct') {
      if (type.isArray) {
        return '[' + type.name + ']';
      }
      return type.name;
    } else if (type.type === 'union') {
      const typeNames = [];
      for (let i = 0; i < type.types.length; i++) {
        // Try to get the type name for this type.
        const typeName = _typeName(type.types[i]);
        // Propogate undefined type names by returning early. Otherwise just add the
        // type name to our array.
        if (typeof typeName === 'undefined') {
          return;
        } else {
          typeNames.push(typeName);
        }
      }
      // Join all of the types together.
      return typeNames.join(' | ');
    } else if (type.type === 'reference') {
      // check to see if the reference type is a simple type alias
      const referencedData = dataByKey[type.name];
      if (referencedData && referencedData.kindString === 'Type alias') {
        // Is it an "objecty" type? We can't display it in one line if so
        if (
          !referencedData.type.declaration ||
          !referencedData.type.declaration.children
        ) {
          return _type(referencedData);
        }
      }

      // it used to be this: return _link(_typeId(type), type.name);
      return _typeId(type);
    } else if (type.type === 'stringLiteral') {
      return '"' + type.value + '"';
    }
  }

  function _objectProperties(rawData) {
    const signatures = Array.isArray(rawData.indexSignature)
      ? rawData.indexSignature
      : [];
    return signatures
      .map(signature => {
        const parameterString = _indexParameterString(signature);
        return extend(_parameter(signature), {name: parameterString});
      })
      .concat(rawData.children.map(_parameter));
  }

  function _indexParameterString(signature) {
    const parameterNamesAndTypes = signature.parameters.map(
      param => param.name + ':' + _typeName(param.type)
    );
    return _parameterString(parameterNamesAndTypes, '[', ']');
  }

  // Render the type of a data object. It's pretty confusing, to say the least
  function _type(data, skipSignature) {
    const {type} = data;

    if (data.kindString === 'Method') {
      return _type(data.signatures[0]);
    }

    if (data.kindString === 'Call signature' && !skipSignature) {
      const paramTypes = Array.isArray(data.parameters)
        ? data.parameters.map(_type)
        : [];
      const args = '(' + paramTypes.join(', ') + ')';
      return args + ' => ' + _type(data, true);
    }

    const isReflected =
      data.kindString === 'Type alias' || type.type === 'reflection';
    if (isReflected && type.declaration) {
      const {declaration} = type;
      if (declaration.signatures) {
        return _type(declaration.signatures[0]);
      }

      if (declaration.indexSignature) {
        const signature = Array.isArray(declaration.indexSignature)
          ? declaration.indexSignature[0]
          : declaration.indexSignature;
        return _indexParameterString(signature) + ':' + _type(signature);
      }
    }

    let typeName = _typeName(type);
    if (!typeName) {
      console.warn(
        'unknown type name for',
        data.name,
        'using the type name `any`'
      );
      // console.trace();
      typeName = 'any';
    }

    if (type.typeArguments) {
      return (
        typeName + _parameterString(type.typeArguments.map(_typeName), '<', '>')
      );
    }
    return typeName;
  }

  // XXX: not sure whether to use the 'kind' enum from TS or just run with the
  // strings. Strings seem safe enough I guess
  function _signature(rawData, parameters) {
    let dataForSignature = rawData;
    if (_isReflectedProperty(rawData)) {
      dataForSignature = rawData.type.declaration;
    }

    const escapedName = escape(rawData.name);

    // if it is a function, and therefore has arguments
    const signature =
      dataForSignature.signatures && dataForSignature.signatures[0];
    if (signature) {
      const {name} = rawData;
      const parameterString = _parameterString(
        parameters.map(param => param.name)
      );
      let returnType = '';
      if (rawData.kindString !== 'Constructor') {
        const type = _type(signature, true);
        if (type !== 'void') {
          returnType = ': ' + _type(signature, true);
        }
      }

      return name + parameterString + returnType;
    }

    return escapedName;
  }

  // Takes the data about a function / constructor and parses out the named params
  function _parameters(rawData) {
    if (_isReflectedProperty(rawData)) {
      return _parameters(rawData.type.declaration, dataByKey);
    }

    const signature = rawData.signatures && rawData.signatures[0];
    if (!signature || !Array.isArray(signature.parameters)) {
      return [];
    }

    return signature.parameters.map(param => {
      let name;
      if (isReadableName(param.name)) {
        name = param.name; // eslint-disable-line prefer-destructuring
      } else if (isReadableName(param.originalName)) {
        name = param.originalName;
      } else {
        // XXX: not sure if this is the correct logic, but it feel OK
        name = 'options';
      }

      let properties = [];
      if (param.type && param.type.declaration) {
        properties = Array.isArray(param.type.declaration.children)
          ? param.type.declaration.children.map(_parameter)
          : [];
      } else if (param.type && param.type.type === 'reference') {
        const dataForProperties = dataByKey[param.type.name] || {};
        properties = Array.isArray(dataForProperties.children)
          ? dataForProperties.children.map(_parameter)
          : [];
      }

      return extend(_parameter(param), {
        name,
        isOptions: name === 'options',
        optional: !!param.defaultValue,
        properties
      });
    });
  }

  function _parameter(param) {
    return {
      name: param.name,
      type: _type(param),
      description:
        param.comment && (param.comment.text || param.comment.shortText)
    };
  }

  function templateArgs(rawData) {
    const parameters = _parameters(rawData, dataByKey);
    const split = partition(parameters, 'isOptions');

    const groups = [];
    if (split[1].length > 0) {
      groups.push({
        name: 'Arguments',
        members: split[1]
      });
    }
    if (split[0].length > 0) {
      groups.push({
        name: 'Options',
        // the properties of the options parameter are the things listed in this group
        members: split[0][0].properties
      });
    }

    if ('Interface' === rawData.kindString) {
      groups.push({
        name: 'Properties',
        members: _objectProperties(rawData)
      });
    }

    let type;
    if ('Type alias' === rawData.kindString) {
      // this means it's an object type
      if (rawData.type.declaration && rawData.type.declaration.children) {
        groups.push({
          name: 'Properties',
          members: _objectProperties(rawData.type.declaration)
        });
      } else {
        type = _type(rawData);
      }
    }

    return {
      id: _typeId(rawData),
      name: rawData.name,
      type,
      signature: _signature(rawData, parameters),
      summary: _summary(rawData),
      groups,
      repo: 'apollographql/apollo-client',
      branch: 'main',
      filepath: rawData.sources[0].fileName,
      lineno: rawData.sources[0].line
    };
  }

  const args = templateArgs(rawData);
  return (
    <>
      <Box pt="4">
        <Heading
          as="h3"
          size="xl"
          fontFamily="mono"
          title={args.name}
          id={args.id}
        >
          <PrimaryLink href={`#${args.id}`}>{args.signature}</PrimaryLink>
        </Heading>
        {args.filepath && (
          <Heading as="h6" fontWeight="normal" size="sm" mt="2">
            <PrimaryLink
              href={`https://github.com/${args.repo}/blob/${args.branch}/${args.filepath}#L${args.lineno}`}
              isExternal
            >
              ({args.filepath}, line {args.lineno})
            </PrimaryLink>
          </Heading>
        )}
      </Box>
      <Stack spacing="4">{args.summary && mdToReact(args.summary)}</Stack>
      {args.type && <div>{args.type}</div>}
      {args.groups
        .filter(group => group.members.length)
        .map((group, index) => (
          <div key={index}>
            <chakra.h6
              mb="4"
              fontWeight="bold"
              textTransform="uppercase"
              fontSize="sm"
              letterSpacing="wider"
            >
              {group.name}
            </chakra.h6>
            <Table w="auto">
              <Thead>
                <Tr>
                  <Th>
                    Name /<br />
                    Type
                  </Th>
                  <Th>Description</Th>
                </Tr>
              </Thead>
              <Tbody>
                {group.members.map((member, index) => (
                  <Tr key={index} fontSize="md">
                    <Td sx={{code: {bg: 'none', p: 0}}}>
                      <chakra.h6 fontSize="lg" mb="1">
                        <InlineCode>{member.name}</InlineCode>
                      </chakra.h6>
                      <InlineCode color="tertiary">{member.type}</InlineCode>
                    </Td>
                    <Td lineHeight="base">
                      {member.description && mdToReact(member.description)}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        ))}
    </>
  );
}

TypeScriptApiBox.propTypes = {
  name: PropTypes.string.isRequired
};

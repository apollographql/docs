import InlineCode from '../InlineCode';
import PropTypes from 'prop-types';
import React from 'react';
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
import {PrimaryLink} from '../RelativeLink';
import {useApiDocContext} from './Context';

function mdToReact(text) {
  const sanitized = text
    .replace(/\{@link (\w*)\}/g, '[$1](#$1)')
    .replace(/<p ?\/>/g, '');
  return (
    <ReactMarkdown
      components={{
        p: Text,
        a: PrimaryLink,
        code: ({children}) => <InlineCode>{children}</InlineCode>
      }}
    >
      {sanitized}
    </ReactMarkdown>
  );
}

export function InterfaceTable({canonicalReference}) {
  const ctx = useApiDocContext();
  const args = ctx.find(item => item.canonicalReference === canonicalReference);

  return (
    <>
      <Box pt="4">
        <Heading
          as="h3"
          size="xl"
          fontFamily="mono"
          title={args.displayName}
          id={args.displayName}
        >
          <PrimaryLink href={`#${args.displayName}`}>
            {args.displayName}
          </PrimaryLink>
        </Heading>
        {args.file && (
          <Heading as="h6" fontWeight="normal" size="sm" mt="2">
            <PrimaryLink
              href={`https://github.com/apollographql/apollo-client/blob/main/${args.file}`}
              isExternal
            >
              ({args.file})
            </PrimaryLink>
          </Heading>
        )}
      </Box>
      <Stack spacing="4">
        {args.comment?.summary && mdToReact(args.comment?.summary)}
      </Stack>
      <div>
        <chakra.h6
          mb="4"
          fontWeight="bold"
          textTransform="uppercase"
          fontSize="sm"
          letterSpacing="wider"
        >
          Properties
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
            {args.properties.map(property => (
              <Tr key={property.id} fontSize="md">
                <Td sx={{code: {bg: 'none', p: 0}}}>
                  <chakra.h6 fontSize="lg" mb="1">
                    <InlineCode>{property.displayName}</InlineCode>
                    {property.optional ? <em> (optional)</em> : null}
                  </chakra.h6>
                  <InlineCode color="tertiary">{property.type}</InlineCode>
                </Td>
                <Td lineHeight="base">
                  {property.comment?.summary &&
                    mdToReact(property.comment?.summary)}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </>
  );
}

InterfaceTable.propTypes = {
  canonicalReference: PropTypes.string.isRequired
};

// @ts-check

/** @type {import("@microsoft/api-extractor-model")} */
const model = require('@microsoft/api-extractor-model');
/** @type {import("@microsoft/tsdoc")} */
const tsdoc = require('@microsoft/tsdoc');

function loadApiDoc(
  /** @type {string} */ fileName,
  /** @type {import("gatsby").SourceNodesArgs} */ gatsbyApi
) {
  const pkg = new model.ApiModel().loadPackage(fileName);

  handleMember(pkg, gatsbyApi);
}
module.exports.loadApiDoc = loadApiDoc;

function handleMember(
  /** @type  {import("@microsoft/api-extractor-model").ApiItem} */ item,
  /** @type {import("gatsby").SourceNodesArgs} */ gatsbyApi
) {
  for (const child of item.members) {
    handleMember(child, gatsbyApi);
  }
  const id = getId(item);
  if (
    item instanceof model.ApiInterface ||
    item instanceof model.ApiPropertySignature ||
    item instanceof model.ApiFunction ||
    item instanceof model.ApiClass ||
    item instanceof model.ApiMethod ||
    item instanceof model.ApiProperty ||
    item instanceof model.ApiConstructor ||
    item instanceof model.ApiMethodSignature ||
    item instanceof model.ApiTypeAlias
  ) {
    createGatsbyNode({
      gatsbyApi,
      input: {
        type: 'ApiDoc' + item.kind,
        data: {
          id,
          parent: item.parent ? getId(item.parent) : null,
          ...extractChildren(item),
          kind: item.kind,
          canonicalReference: item.canonicalReference.toString(),
          displayName: item.displayName,
          excerpt: item.excerpt.text,
          references: item.excerpt.tokens
            .filter(
              (token, index) =>
                token.kind === 'Reference' &&
                token.canonicalReference &&
                // prevent duplicates
                item.excerpt.tokens.findIndex(
                  other => other.canonicalReference === token.canonicalReference
                ) === index
            )
            .map(token => ({
              canonicalReference: token.canonicalReference?.toString(),
              text: token.text
            })),
          file: item.sourceLocation.fileUrl || item.fileUrlPath,
          comment: processDocComment(item.tsdocComment),
          releaseTag: model.ReleaseTag[item.releaseTag],
          ...extraData(item)
        }
      }
    });
    return id;
  }
}

function extractChildren(
  /** @type  {import("@microsoft/api-extractor-model").ApiItem} */ item
) {
  if (model.ApiItemContainerMixin.isBaseClassOf(item)) {
    const extracted = item.findMembersWithInheritance();
    if (extracted.maybeIncompleteResult) {
      return {
        children: item.members.map(getId),
        childrenIncomplete: true
      };
    } else {
      return {
        children: extracted.items.map(getId),
        childrenIncomplete: false
      };
    }
  }
  return {children: item.members.map(getId)};
}

function extraData(
  /** @type  {import("@microsoft/api-extractor-model").ApiItem} */ item
) {
  return item instanceof model.ApiInterface
    ? {
        typeParameters: item.typeParameters.map(p => ({
          name: p.name,
          optional: p.isOptional,
          comment: renderDocNode(p.tsdocTypeParamBlock?.content.nodes)
        }))
      }
    : item instanceof model.ApiTypeAlias
    ? {
        typeParameters: item.typeParameters.map(p => ({
          name: p.name,
          optional: p.isOptional,
          comment: renderDocNode(p.tsdocTypeParamBlock?.content.nodes)
        })),
        type: item.typeExcerpt.text
      }
    : item instanceof model.ApiPropertySignature
    ? {
        readonly: item.isReadonly,
        optional: item.isOptional,
        type: item.propertyTypeExcerpt.text
      }
    : item instanceof model.ApiMethodSignature
    ? {
        optional: item.isOptional,
        returnType: item.returnTypeExcerpt.text,
        parameters: item.parameters.map(p => ({
          type: p.parameterTypeExcerpt.text,
          name: p.name,
          optional: p.isOptional,
          comment: renderDocNode(p.tsdocParamBlock?.content.nodes)
        }))
      }
    : item instanceof model.ApiFunction
    ? {
        returnType: item.returnTypeExcerpt.text,
        parameters: item.parameters.map(p => ({
          type: p.parameterTypeExcerpt.text,
          name: p.name,
          optional: p.isOptional,
          comment: renderDocNode(p.tsdocParamBlock?.content.nodes)
        }))
      }
    : item instanceof model.ApiClass
    ? {
        implements: item.implementsTypes.map(p => p.excerpt.text)
      }
    : item instanceof model.ApiMethod
    ? {
        abstract: item.isAbstract,
        optional: item.isOptional,
        static: item.isStatic,
        returnType: item.returnTypeExcerpt.text,
        parameters: item.parameters.map(p => ({
          type: p.parameterTypeExcerpt.text,
          name: p.name,
          optional: p.isOptional,
          comment: renderDocNode(p.tsdocParamBlock?.content.nodes)
        }))
      }
    : item instanceof model.ApiConstructor
    ? {
        parameters: item.parameters.map(p => ({
          type: p.parameterTypeExcerpt.text,
          name: p.name,
          optional: p.isOptional,
          comment: renderDocNode(p.tsdocParamBlock?.content.nodes)
        }))
      }
    : item instanceof model.ApiProperty
    ? {
        abstract: item.isAbstract,
        optional: item.isOptional,
        protected: item.isProtected,
        static: item.isStatic,
        readonly: item.isReadonly
      }
    : {};
}

function getId(
  /** @type  {import("@microsoft/api-extractor-model").ApiItem} */ item
) {
  return item.canonicalReference.toString();
}

/** @typedef INodeBuilderArgs
  @property gatsbyApi {import("gatsby").SourceNodesArgs}
  @property input {{ type: string, data: {
      id: string
      parent?: string | null
      children?: string[]
      [key: string]: unknown
  } }}
}  
*/
function createGatsbyNode(/** @type {INodeBuilderArgs} */ {gatsbyApi, input}) {
  /** @type {import("gatsby").NodeInput} */
  const node = {
    ...input.data,
    internal: {
      type: input.type,
      contentDigest: gatsbyApi.createContentDigest(input.data)
    }
  };

  gatsbyApi.actions.createNode(node);
}

function processDocComment(
  /** @type {undefined | import("@microsoft/tsdoc").DocComment} */ docComment
) {
  if (!docComment) return;
  return {
    comment: docComment?.emitAsTsdoc(),
    summary: renderDocNode(docComment?.summarySection),
    deprecated: renderDocNode(docComment?.deprecatedBlock),
    remarks: renderDocNode(docComment?.remarksBlock),
    examples: docComment?.customBlocks
      .filter(v => v.blockTag.tagName === '@example')
      .map(renderDocNode)
      .map(example => example.replace(/^\s*@example/g, ''))
  };
}

/**
 * @returns {string}
 */
function renderDocNode(
  /** @type {undefined | import("@microsoft/tsdoc").DocNode | ReadonlyArray<import("@microsoft/tsdoc").DocNode>} */ node
) {
  if (!node) {
    return '';
  }
  if (Array.isArray(node)) {
    return node.map(node => renderDocNode(node)).join('');
  }

  /** @type {import("@microsoft/tsdoc").DocNode} */
  const docNode = /** @type {any} */ (node);

  let result = '';
  if (docNode) {
    if (docNode instanceof tsdoc.DocFencedCode) {
      let code = docNode.code.toString();
      let meta = '';
      code = code.replace(
        /^\s*\/\/\s*codeblock-meta(\s.*?)$\n?/gm,
        (_line, metaMatch) => {
          meta += metaMatch;
          return '';
        }
      );
      return '```' + docNode.language + meta + '\n' + code + '\n```';
    }
    if (docNode instanceof tsdoc.DocExcerpt) {
      result += docNode.content.toString();
    }

    for (const childNode of docNode.getChildNodes()) {
      result += renderDocNode(childNode);
    }
  }
  return result;
}

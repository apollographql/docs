// @ts-check
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */

/** @type {import("@microsoft/api-extractor-model")} */
const model = require("@microsoft/api-extractor-model");
const { ApiModel, ApiInterface, ApiPropertySignature, ReleaseTag } = model;
/** @type {import("@microsoft/tsdoc")} */
const tsdoc = require("@microsoft/tsdoc");

function loadApiDoc(
  /** @type {string} */ fileName,
  /** @type {import("gatsby").SourceNodesArgs} */ gatsbyApi
) {
  const model = new ApiModel();
  const pkg = model.loadPackage(fileName);

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
  const id = getId(item, gatsbyApi);
  if (item instanceof ApiInterface || item instanceof ApiPropertySignature) {
    createGatsbyNode({
      gatsbyApi,
      input: {
        type: "ApiDoc" + item.kind,
        data: {
          id,
          parent: item.parent ? getId(item.parent, gatsbyApi) : null,
          children: item.members.map((m) => getId(m, gatsbyApi)),
          kind: item.kind,
          canonicalReference: item.canonicalReference.toString(),
          displayName: item.displayName,
          ...extraData(item),
        },
      },
    });
    return id;
  }
}

function extraData(
  /** @type  {import("@microsoft/api-extractor-model").ApiItem} */ item
) {
  return item instanceof ApiInterface
    ? {
        excerpt: item.excerpt.text,
        comment: processDocComment(item.tsdocComment),
        file: item.sourceLocation.fileUrl || item.fileUrlPath,
        releaseTag: ReleaseTag[item.releaseTag],
        typeParameters: item.typeParameters.map((p) => ({
          name: p.name,
          optional: p.isOptional,
          comment: renderDocNode(p.tsdocTypeParamBlock?.content.nodes),
        })),
      }
    : item instanceof model.ApiPropertySignature
    ? {
        type: item.propertyTypeExcerpt.text,
        excerpt: item.excerpt.text,
        comment: processDocComment(item.tsdocComment),
        file: item.sourceLocation.fileUrl || item.fileUrlPath,
        releaseTag: ReleaseTag[item.releaseTag],
        readonly: item.isReadonly,
        optional: item.isOptional,
      }
    : {};
}

function getId(
  /** @type  {import("@microsoft/api-extractor-model").ApiItem} */ item,
  /** @type {import("gatsby").SourceNodesArgs} */ gatsbyApi
) {
  return gatsbyApi.createNodeId(item.canonicalReference.toString());
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
function createGatsbyNode(
  /** @type {INodeBuilderArgs} */ { gatsbyApi, input }
) {
  /** @type {import("gatsby").NodeInput} */
  const node = {
    ...input.data,
    internal: {
      type: input.type,
      contentDigest: gatsbyApi.createContentDigest(input.data),
    },
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
      .filter((v) => v.blockTag.tagName === "@example")
      .map(renderDocNode),
  };
}

/**
 * @returns {string}
 */
function renderDocNode(
  /** @type {undefined | import("@microsoft/tsdoc").DocNode | ReadonlyArray<import("@microsoft/tsdoc").DocNode>} */ node
) {
  if (!node) {
    return "";
  }
  if (Array.isArray(node)) {
    return node.map((node) => renderDocNode(node)).join("");
  }

  /** @type {import("@microsoft/tsdoc").DocNode} */
  const docNode = /** @type {any} */ (node);

  let result = "";
  if (docNode) {
    if (docNode instanceof tsdoc.DocFencedCode) {
      let code = docNode.code.toString();
      let meta = "";
      code = code.replace(
        /^\s*\/\/\s*codeblock-meta(\s.*?)$\n?/gm,
        (_line, metaMatch) => {
          meta += metaMatch;
          return "";
        }
      );
      return "```" + docNode.language + meta + "\n" + code + "\n```";
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

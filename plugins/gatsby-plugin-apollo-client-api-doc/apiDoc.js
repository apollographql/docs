// @ts-check

/** @type {import("@microsoft/api-extractor-model")} */
const model = require('@microsoft/api-extractor-model');
/** @type {import("@microsoft/tsdoc")} */
const tsdoc = require('@microsoft/tsdoc');

const parseTs = require('./parseTs');

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
    item instanceof model.ApiTypeAlias ||
    item instanceof model.ApiEnum ||
    item instanceof model.ApiEnumMember
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
        children: Array.from(
          new Set(
            extracted.items.map(getId).concat(item.members.map(getId))
          ).values()
        ),
        childrenIncomplete: true,
        childrenIncompleteDetails: extracted.messages
          .map(m => m.text)
          .join('\n')
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

function extractPrimaryReference(type, item) {
  if (!(item instanceof model.ApiDeclaredItem)) {
    return {type};
  }
  const ast = parseTs.parseAst(type);
  const primaryReference = parseTs.skipToPrimaryType(ast);
  const referencedTypeName = primaryReference?.name?.value;
  const referencedType = item.excerptTokens?.find(
    r => r.text === referencedTypeName
  );

  return {
    type,
    primaryCanonicalReference: referencedType?.canonicalReference?.toString(),
    primaryGenericArguments: primaryReference?.generics?.map(g => g.unparsed)
  };
}

function extraData(
  /** @type  {import("@microsoft/api-extractor-model").ApiItem} */ item
) {
  const ret = {};
  if (model.ApiParameterListMixin.isBaseClassOf(item)) {
    ret.parameters = item.parameters.map(p => ({
      ...extractPrimaryReference(p.parameterTypeExcerpt.text, item),
      name: p.name,
      optional: p.isOptional,
      comment: renderDocNode(p.tsdocParamBlock?.content.nodes)
    }));
  }

  if (model.ApiTypeParameterListMixin.isBaseClassOf(item)) {
    ret.typeParameters = item.typeParameters.map(p => ({
      name: p.name,
      optional: p.isOptional,
      defaultType: p.defaultTypeExcerpt.text,
      constraint: p.constraintExcerpt.text,
      comment: renderDocNode(p.tsdocTypeParamBlock?.content.nodes)
    }));
  }

  if (model.ApiReadonlyMixin.isBaseClassOf(item)) {
    ret.readonly = item.isReadonly;
  }
  if (model.ApiOptionalMixin.isBaseClassOf(item)) {
    ret.optional = item.isOptional;
  }
  if (model.ApiAbstractMixin.isBaseClassOf(item)) {
    ret.abstract = item.isAbstract;
  }
  if (model.ApiStaticMixin.isBaseClassOf(item)) {
    ret.static = item.isStatic;
  }
  if (model.ApiProtectedMixin.isBaseClassOf(item)) {
    ret.protected = item.isProtected;
  }
  if (model.ApiReturnTypeMixin.isBaseClassOf(item)) {
    ret.returnType = extractPrimaryReference(item.returnTypeExcerpt.text, item);
  }

  return Object.assign(
    ret,
    item instanceof model.ApiTypeAlias
      ? {
          type: item.typeExcerpt.text
        }
      : item instanceof model.ApiPropertyItem
      ? {
          type: item.propertyTypeExcerpt.text
        }
      : item instanceof model.ApiClass
      ? {
          implements: item.implementsTypes.map(p => p.excerpt.text)
        }
      : {}
  );
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
    summary: cleanDoc(renderDocNode(docComment?.summarySection)),
    deprecated: cleanDoc(
      renderDocNode(docComment?.deprecatedBlock),
      '@deprecated'
    ),
    remarks: cleanDoc(renderDocNode(docComment?.remarksBlock), '@remarks'),
    returns: cleanDoc(renderDocNode(docComment?.returnsBlock), '@returns'),
    since: cleanDoc(
      renderDocNode(
        docComment.customBlocks.find(v => v.blockTag.tagName === '@since')
      ),
      '@since'
    ),
    docGroup: cleanDoc(
      renderDocNode(
        docComment.customBlocks.find(v => v.blockTag.tagName === '@docGroup')
      ),
      '@docGroup'
    ),
    examples: docComment?.customBlocks
      .filter(v => v.blockTag.tagName === '@example')
      .map(renderDocNode)
      .map(example => cleanDoc(example, '@example')),
    alpha: docComment.modifierTagSet.isAlpha(),
    beta: docComment.modifierTagSet.isBeta(),
    experimental: docComment.modifierTagSet.isExperimental()
  };
}

function cleanDoc(
  /** @type {string} */ docString,
  /** @type {undefined|string} */ removeTag
) {
  if (removeTag) {
    return docString.replace(new RegExp(`^\\s*${removeTag}`, 'g'), '').trim();
  }
  return docString.trim();
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

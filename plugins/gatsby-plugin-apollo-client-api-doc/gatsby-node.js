// @ts-check

const {loadApiDoc} = require('./apiDoc');
const fs = require('fs');
const path = require('path');
const {default: fetch} = require('node-fetch');

/** @type {import("gatsby").GatsbyNode['sourceNodes']} */
exports.sourceNodes = async (api, options) => {
  const tempDir = fs.mkdtempSync('api-model');
  try {
    let {file} = /** @type {{file:string}} */ (options);

    if (file.includes('://')) {
      console.info("downloading api doc from url", file)
      const request = await fetch(file);
      const contents = await request.text();
      file = path.join(tempDir, 'api.json');
      fs.writeFileSync(file, contents);
    }
    if (fs.existsSync(file)) {
      console.info("loading api doc from file", file)
      loadApiDoc(file, api);
    } else {
      console.info("api doc file not found, skipping", file)
    }
  } finally {
    fs.rmSync(tempDir, {recursive: true});
  }
};

/** @type {import("gatsby").GatsbyNode['createResolvers']} */
exports.createResolvers = ({createResolvers}) => {
  const resolvers = {
    Query: {
      apiDoc: {
        type: ['ApiDoc'],
        args: {
          canonicalReference: '[String!]!'
        },
        resolve: async (source, args, context) =>
          context.nodeModel.getNodesByIds({
            ids: args.canonicalReference
          })
      }
    },
    ApiDocInterface: {
      properties: {
        type: '[InterfaceMember!]',
        resolve: (source, args, context) =>
          context.nodeModel.getNodesByIds({
            ids: source.children,
            type: 'InterfaceMember'
          })
      }
    },
    ApiDocClass: {
      constructorMethod: {
        type: 'ApiDocConstructor',
        resolve: (source, args, context) =>
          context.nodeModel.getNodesByIds({
            ids: source.children,
            type: 'ApiDocConstructor'
          })[0] || null
      },
      methods: {
        type: '[ApiDocMethod!]',
        resolve: (source, args, context) =>
          context.nodeModel.getNodesByIds({
            ids: source.children,
            type: 'ApiDocMethod'
          })
      },
      properties: {
        type: '[ApiDocProperty!]',
        resolve: (source, args, context) =>
          context.nodeModel.getNodesByIds({
            ids: source.children,
            type: 'ApiDocProperty'
          })
      }
    },
    ApiDocEnum: {
      members: {
        type: '[ApiDocEnumMember!]',
        resolve: (source, args, context) =>
          context.nodeModel.getNodesByIds({
            ids: source.children,
            type: 'ApiDocEnumMember'
          })
      }
    },
    MdxFrontmatter: {
      recursive_api_doc: {
        type: '[String!]!',
        args: {
          depth: 'Int'
        },
        async resolve(source, args, context) {
          const accumulated = new Set();
          const unqueried = new Set(source.api_doc);
          for (let depth = 0; depth < args.depth; depth++) {
            const items = await context.nodeModel.getNodesByIds({
              ids: Array.from(unqueried)
            });
            unqueried.clear();
            for (const item of items) {
              accumulated.add(item.canonicalReference);
              for (const ref of item.references) {
                if (!accumulated.has(ref.canonicalReference))
                  unqueried.add(ref.canonicalReference);
              }
              for (const canonicalReference of item.children) {
                if (!accumulated.has(canonicalReference))
                  unqueried.add(canonicalReference);
              }
            }
          }

          return accumulated;
        }
      }
    },
    ApiDocReference: {
      target: {
        type: 'ApiDoc',
        resolve(source, args, context) {
          return context.nodeModel.getNodeById({
            id: source.canonicalReference,
            type: 'ApiDoc'
          });
        }
      }
    }
  };
  createResolvers(resolvers);
};

/** @type {import("gatsby").GatsbyNode['createSchemaCustomization']} */
exports.createSchemaCustomization = ({actions}) => {
  actions.createTypes(`
      union ApiDoc = ApiDocInterface | ApiDocPropertySignature | ApiDocMethodSignature | ApiDocFunction | ApiDocClass | ApiDocMethod | ApiDocProperty | ApiDocTypeAlias | ApiDocConstructor | ApiDocEnum | ApiDocEnumMember
      union InterfaceMember = ApiDocPropertySignature | ApiDocMethodSignature

      interface ApiDocBase {
        id: ID!
        parent: Node
        children: [Node!]!
        internal: Internal!
        kind: String
        canonicalReference: String
        displayName: String
        excerpt: String
        references: [ApiDocReference]
        file: String
        comment: ApiDocTypeDoc
        releaseTag: String
      }

      type ApiDocInterface implements Node & ApiDocBase {
        id: ID!
        parent: Node
        children: [Node!]!
        childrenIncomplete: Boolean
        childrenIncompleteDetails: String
        internal: Internal!
        kind: String
        canonicalReference: String
        displayName: String
        excerpt: String
        references: [ApiDocReference]
        file: String
        comment: ApiDocTypeDoc
        releaseTag: String
        typeParameters: [ApiDocTypeParameter!]
      }

      type ApiDocTypeAlias implements Node & ApiDocBase {
        id: ID!
        parent: Node
        children: [Node!]!
        internal: Internal!
        kind: String
        canonicalReference: String
        displayName: String
        excerpt: String
        references: [ApiDocReference]
        file: String
        comment: ApiDocTypeDoc
        releaseTag: String
        typeParameters: [ApiDocTypeParameter!]
        type: String
      }

      type ApiDocFunction implements Node & ApiDocBase {
        id: ID!
        parent: Node
        children: [Node!]!
        internal: Internal!
        kind: String
        canonicalReference: String
        displayName: String
        file: String
        type: String
        excerpt: String
        references: [ApiDocReference]
        comment: ApiDocTypeDoc
        releaseTag: String
        returnType: String
        parameters: [ApiDocFunctionParameter]
      }

      type ApiDocPropertySignature implements Node & ApiDocBase {
        id: ID!
        parent: Node
        children: [Node!]!
        internal: Internal!
        kind: String
        canonicalReference: String
        displayName: String
        file: String
        type: String
        excerpt: String
        references: [ApiDocReference]
        comment: ApiDocTypeDoc
        releaseTag: String
        readonly: Boolean
        optional: Boolean
      }

      type ApiDocMethodSignature implements Node & ApiDocBase {
        id: ID!
        parent: Node
        children: [Node!]!
        internal: Internal!
        kind: String
        canonicalReference: String
        displayName: String
        file: String
        type: String
        excerpt: String
        references: [ApiDocReference]
        comment: ApiDocTypeDoc
        releaseTag: String
        optional: Boolean
        returnType: String
        parameters: [ApiDocFunctionParameter]
      }

      type ApiDocEnum implements Node & ApiDocBase {
        id: ID!
        parent: Node
        children: [Node!]!
        internal: Internal!
        kind: String
        canonicalReference: String
        displayName: String
        file: String
        type: String
        excerpt: String
        references: [ApiDocReference]
        comment: ApiDocTypeDoc
        releaseTag: String
      }

      type ApiDocEnumMember implements Node & ApiDocBase {
        id: ID!
        parent: Node
        children: [Node!]!
        internal: Internal!
        kind: String
        canonicalReference: String
        displayName: String
        file: String
        type: String
        excerpt: String
        references: [ApiDocReference]
        comment: ApiDocTypeDoc
        releaseTag: String
      }

      type ApiDocClass implements Node & ApiDocBase {
        id: ID!
        parent: Node
        children: [Node!]!
        childrenIncomplete: Boolean
        childrenIncompleteDetails: String
        internal: Internal!
        kind: String
        canonicalReference: String
        displayName: String
        file: String
        type: String
        excerpt: String
        references: [ApiDocReference]
        comment: ApiDocTypeDoc
        releaseTag: String
        implements: [String]
      }

      type ApiDocProperty implements Node & ApiDocBase {
        id: ID!
        parent: Node
        children: [Node!]!
        internal: Internal!
        kind: String
        canonicalReference: String
        displayName: String
        file: String
        type: String
        excerpt: String
        references: [ApiDocReference]
        comment: ApiDocTypeDoc
        releaseTag: String
        abstract: Boolean
        optional: Boolean
        static: Boolean
        readonly: Boolean
      }

      type ApiDocConstructor implements Node & ApiDocBase {
        id: ID!
        parent: Node
        children: [Node!]!
        internal: Internal!
        kind: String
        canonicalReference: String
        displayName: String
        file: String
        type: String
        excerpt: String
        references: [ApiDocReference]
        comment: ApiDocTypeDoc
        releaseTag: String
        parameters: [ApiDocFunctionParameter]
      }

      type ApiDocMethod implements Node & ApiDocBase {
        id: ID!
        parent: Node
        children: [Node!]!
        internal: Internal!
        kind: String
        canonicalReference: String
        displayName: String
        file: String
        type: String
        excerpt: String
        references: [ApiDocReference]
        comment: ApiDocTypeDoc
        releaseTag: String
        abstract: Boolean
        optional: Boolean
        returnType: String
        static: Boolean
        parameters: [ApiDocFunctionParameter]
      }

      type ApiDocReference {
        canonicalReference: String!
        text: String!
      }

      type ApiDocTypeParameter {
        name: String
        optional: Boolean
        comment: String
      }

      type ApiDocFunctionParameter {
        type: String
        name: String
        optional: Boolean
        comment: String
      }

      type ApiDocTypeDoc {
        comment: String
        summary: String
        deprecated: String
        remarks: String
        since: String
        examples: [String!]
      }
    `);
};

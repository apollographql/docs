// @ts-check
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */

const { loadApiDoc } = require("./apiDoc");
const fs = require("fs");

/** @type {import("gatsby").GatsbyNode['sourceNodes']} */
exports.sourceNodes = async (api, { file }) => {
  if (fs.existsSync(file)) {
    loadApiDoc(file, api);
  }
};

/** @type {import("gatsby").GatsbyNode['createResolvers']} */
exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    Query: {
      apiDoc: {
        type: ["ApiDoc"],
        args: {
          canonicalReference: "[String!]!",
        },
        resolve: async (source, args, context) =>
          context.nodeModel.getNodesByIds({
            ids: args.canonicalReference,
          }),
      },
    },
    ApiDocInterface: {
      properties: {
        type: "[InterfaceMember!]",
        resolve: (source, args, context) =>
          context.nodeModel.getNodesByIds({
            ids: source.children,
            type: "InterfaceMember",
          }),
      },
    },
    ApiDocClass: {
      constructorMethod: {
        type: "ApiDocConstructor",
        resolve: (source, args, context) =>
          context.nodeModel.getNodesByIds({
            ids: source.children,
            type: "ApiDocConstructor",
          })[0] || null,
      },
      methods: {
        type: "[ApiDocMethod!]",
        resolve: (source, args, context) =>
          context.nodeModel.getNodesByIds({
            ids: source.children,
            type: "ApiDocMethod",
          }),
      },
      properties: {
        type: "[ApiDocProperty!]",
        resolve: (source, args, context) =>
          context.nodeModel.getNodesByIds({
            ids: source.children,
            type: "ApiDocProperty",
          }),
      },
    },
    MarkdownRemarkFrontmatter: {
      api_doc: {
        type: "[String!]!",
        resolve(source) {
          return source.api_doc || [];
        },
      },
    },
    ApiDocReference: {
      target: {
        type: "ApiDoc",
        resolve(source, args, context) {
          return context.nodeModel.getNodeById({
            id: source.canonicalReference,
            type: "ApiDoc",
          });
        },
      },
    },
  };
  createResolvers(resolvers);
};

/** @type {import("gatsby").GatsbyNode['createSchemaCustomization']} */
exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
      union ApiDoc = ApiDocInterface | ApiDocPropertySignature | ApiDocMethodSignature | ApiDocFunction | ApiDocClass | ApiDocMethod | ApiDocProperty | ApiDocTypeAlias
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

      type ApiDocClass implements Node & ApiDocBase {
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
        examples: [String!]
      }
    `);
};

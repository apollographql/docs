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
        type: "[ApiDocPropertySignature!]",
        resolve: (source, args, context) =>
          context.nodeModel.getNodesByIds({
            ids: source.children,
            type: "ApiDocPropertySignature",
          }),
      },
    },
    ApiDocClass: {
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
  };
  createResolvers(resolvers);
};

/** @type {import("gatsby").GatsbyNode['createSchemaCustomization']} */
exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
      union ApiDoc = ApiDocInterface | ApiDocPropertySignature | ApiDocFunction | ApiDocClass | ApiDocMethod | ApiDocProperty

      interface ApiDocBase {
        id: ID!
        parent: Node
        children: [Node!]!
        internal: Internal!
        kind: String
        canonicalReference: String
        displayName: String
        excerpt: String
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
        file: String
        comment: ApiDocTypeDoc
        releaseTag: String
        typeParameters: [ApiDocTypeParameter!]
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
        comment: ApiDocTypeDoc
        releaseTag: String
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
        comment: ApiDocTypeDoc
        releaseTag: String
        readonly: Boolean
        optional: Boolean
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
        comment: ApiDocTypeDoc
        releaseTag: String
        abstract: Boolean
        optional: Boolean
        protected: Boolean
        static: Boolean
        readonly: Boolean
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
        comment: ApiDocTypeDoc
        releaseTag: String
        abstract: Boolean
        optional: Boolean
        protected: Boolean
        static: Boolean
        parameters: [ApiDocFunctionParameter]
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


      type MarkdownRemarkFrontmatter {
        api_doc: String
      }
    `);
};

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

/** @type {import("gatsby").GatsbyNode['createSchemaCustomization']} */
exports.createSchemaCustomization = ({ actions, schema }) => {
  actions.createTypes([
    schema.buildObjectType({
      name: "ApiDocInterface",
      interfaces: ["Node"],
      fields: {
        id: "ID!",
        parent: "Node",
        children: "[Node!]!",
        internal: "Internal!",
        kind: "String",
        canonicalReference: "String",
        displayName: "String",
        file: "String",
        excerpt: "String",
        comment: "ApiDocTypeDoc",
        releaseTag: "String",
        typeParameters: "[TypeParameter!]",
        properties: {
          type: "[ApiDocPropertySignature!]",
          resolve: (source, args, context) =>
            context.nodeModel.getNodesByIds({
              ids: source.children,
              type: "ApiDocPropertySignature",
            }),
        },
      },
    }),
  ]);

  actions.createTypes(`
      type TypeParameter {
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

      type ApiDocPropertySignature implements Node {
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

      type MarkdownRemarkFrontmatter {
        api_doc: String
      }
    `);
};

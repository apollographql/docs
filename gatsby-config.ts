import fs from "fs";
import yaml from "js-yaml";
import type { GatsbyConfig, PluginRef } from "gatsby";

const plugins: PluginRef[] = [
  {
    resolve: "gatsby-plugin-mdx",
    options: {
      extensions: [".mdx", ".md"],
    },
  },
];

const localSources = yaml.load(
  fs.readFileSync("sources/local.yml", "utf-8")
) as Record<string, string>;

for (const name in localSources) {
  plugins.push({
    resolve: "gatsby-source-filesystem",
    options: {
      name,
      path: localSources[name],
    },
  });
}

const config: GatsbyConfig = {
  siteMetadata: {
    title: "Apollo Docs",
  },
  plugins,
};

export default config;

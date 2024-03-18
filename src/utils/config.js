import {graphql, useStaticQuery} from 'gatsby';
import {useMemo} from 'react';
import {v5} from 'uuid';

// turn a sidebar configuration object to an array of nav items
const getNavItems = items => {
  const navItems = [];
  const entries = Object.entries(items);

  for (const entry of entries) {
    const title = entry[0];
    let path = entry[1];
    let isDefaultCollapsed = false;

    if (Array.isArray(path) && path.length === 2) {
      const [value, options] = path;

      if (typeof value === 'object') {
        path = value;
        isDefaultCollapsed = options;
      } else if (Array.isArray(options)) {
        navItems.push({
          title,
          path: value,
          tags: options
        });
        continue;
      }
    }

    if (typeof path === 'object') {
      navItems.push({
        title,
        // generate an id for each group, for use with the sidebar nav state
        id: v5(JSON.stringify(path), v5.DNS),
        // recurse over its children and turn them into nav items
        children: getNavItems(path),
        isDefaultCollapsed
      });
      continue;
    }

    if (typeof path === 'string') {
      navItems.push({
        title,
        path
      });
    }
  }

  return navItems;
};

const configToSlug = config =>
  config.relativeDirectory
    ? config.relativeDirectory.split('/').slice(4).join('/')
    : config.sourceInstanceName;

const getParentDocset = slug => slug.split('/').shift();

export const useConfigs = () => {
  const data = useStaticQuery(graphql`
    query GetSidebarConfigs {
      configs: allFile(filter: {base: {eq: "config.json"}}) {
        nodes {
          sourceInstanceName
          relativeDirectory
          fields {
            content
          }
        }
      }
    }
  `);

  return useMemo(
    () =>
      data.configs.nodes.reduce((acc, config, _, nodes) => {
        // TODO: convert configs to YAML
        const content = JSON.parse(config.fields.content);
        const {
          title,
          link,
          version,
          sidebar,
          algoliaFilters,
          internal,
          versionBanner
        } = content;

        const slug = configToSlug(config);
        const parent = getParentDocset(slug);

        const versions = [];

        for (const node of nodes) {
          const nodeSlug = configToSlug(node);
          if (getParentDocset(nodeSlug) === parent) {
            const {version} = JSON.parse(node.fields.content);
            if (version) {
              versions.push({
                label: version,
                slug: nodeSlug
              });
            }
          }
        }

        versions.sort((a, b) => b.label.localeCompare(a.label));

        return {
          ...acc,
          [slug]: {
            docset: title,
            currentVersion: version,
            navItems: getNavItems(sidebar),
            algoliaFilters,
            internal,
            versions,
            versionBanner,
            link
          }
        };
      }, {}),
    [data]
  );
};

export const useConfig = slug => {
  const configs = useConfigs();
  return configs[slug];
};

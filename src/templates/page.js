import AuthCheck from '../components/AuthCheck';
import Page from '../components/Page';
import PropTypes from 'prop-types';
import React from 'react';
import {ApiDocContext} from '../components/ApiDoc/index.js';
import {GatsbySeo} from 'gatsby-plugin-next-seo';
import {graphql} from 'gatsby';
import {useConfig} from '../utils/config';

export default function PageTemplate({data, location}) {
  const config = useConfig(data.file.basePath);
  const page = <ApiDocContext.Provider value={{
    apiDocInterfaces: data.apiDocInterfaces.nodes
  }}><Page file={data.file} uri={location.pathname} /></ApiDocContext.Provider>;

  if (!config.internal) {
    return page;
  }

  return (
    <>
      <GatsbySeo noindex />
      <AuthCheck>{page}</AuthCheck>
    </>
  );
}

PageTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  query GetPage($id: String!, $api_doc: [String]) {
    file(id: {eq: $id}) {
      name
      basePath: sourceInstanceName
      relativePath
      gitRemote {
        full_name
        ref
      }
      childMdx {
        body
        headings {
          depth
          value
        }
        frontmatter {
          title
          description
          toc
          tags
          headingDepth
          minVersion
          noIndex
        }
      }
      childMarkdownRemark {
        html
        headings {
          depth
          value
        }
        frontmatter {
          title
          description
          headingDepth
          minVersion
          noIndex
        }
      }
    }
    apiDocInterfaces: allApiDocInterface(
      filter: {canonicalReference: {in: $api_doc}}
    ) {
      nodes {
        id
        canonicalReference
        displayName
        file
        excerpt
        kind
        releaseTag
        comment {
          summary
          deprecated
          remarks
        }
        typeParameters {
          name
          optional
          comment
        }
        properties {
          id
          displayName
          canonicalReference
          file
          type
          excerpt
          kind
          optional
          readonly
          releaseTag
          comment {
            summary
            deprecated
            remarks
          }
        }
      }
    }
  }
`;

import AuthCheck from '../components/AuthCheck';
import NoSSR from '@mpth/react-no-ssr';
import Page from '../components/Page';
import PropTypes from 'prop-types';
import React from 'react';
import {GatsbySeo} from 'gatsby-plugin-next-seo';
import {graphql} from 'gatsby';

export default function PageTemplate({data, uri, pageContext}) {
  const page = <Page data={data} uri={uri} pageContext={pageContext} />;
  return pageContext.internal ? (
    <>
      <GatsbySeo noindex />
      <NoSSR>
        <AuthCheck>{page}</AuthCheck>
      </NoSSR>
    </>
  ) : (
    page
  );
}

PageTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  uri: PropTypes.string.isRequired,
  pageContext: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  query GetPage($id: String!) {
    file(id: {eq: $id}) {
      name
      basePath: sourceInstanceName
      relativePath
      gitRemote {
        href
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
        }
      }
      childMarkdownRemark {
        html
        htmlAst
        headings {
          depth
          value
        }
        frontmatter {
          title
          description
        }
      }
    }
  }
`;

import AuthCheck from '../components/AuthCheck';
import Page from '../components/Page';
import PropTypes from 'prop-types';
import React from 'react';
import {GatsbySeo} from 'gatsby-plugin-next-seo';
import {graphql} from 'gatsby';

export default function PageTemplate({data, location, pageContext}) {
  const page = (
    <Page file={data.file} uri={location.pathname} pageContext={pageContext} />
  );
  return pageContext.internal ? (
    <>
      <GatsbySeo noindex />
      <AuthCheck>{page}</AuthCheck>
    </>
  ) : (
    page
  );
}

PageTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
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
          tags
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

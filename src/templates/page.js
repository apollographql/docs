import AuthCheck from '../components/AuthCheck';
import Page from '../components/Page';
import PropTypes from 'prop-types';
import React from 'react';
import {GatsbySeo} from 'gatsby-plugin-next-seo';
import {PageWidthProvider} from '../components/PageWidthContext';
import {graphql} from 'gatsby';
import {useClientTick} from '../utils';

export default function PageTemplate({data, location, pageContext}) {
  useClientTick();
  const page = (
    <PageWidthProvider>
      <Page
        file={data.file}
        uri={location.pathname}
        pageContext={pageContext}
      />
    </PageWidthProvider>
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

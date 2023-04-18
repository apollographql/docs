import AuthCheck from '../components/AuthCheck';
import Page from '../components/Page';
import PropTypes from 'prop-types';
import React from 'react';
import {GatsbySeo} from 'gatsby-plugin-next-seo';
import {graphql} from 'gatsby';
import {useConfig} from '../utils/config';

export default function PageTemplate({data, location}) {
  const config = useConfig(data.file.basePath);
  const page = <Page file={data.file} uri={location.pathname} />;

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
          headingDepth
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
        }
      }
    }
  }
`;

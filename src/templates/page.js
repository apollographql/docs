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
  const page = <ApiDocContext.Provider value={data.apiDoc}><Page file={data.file} uri={location.pathname} /></ApiDocContext.Provider>;

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
  query GetPage($id: String!, $api_doc: [String!]!) {
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
    apiDoc(canonicalReference: $api_doc) {
      ...Base
      ...Interface
      ...Property
      ...Function
      ...Class
      ...Property
      ...Method
    }
  }

fragment Base on ApiDocBase {
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
    examples
  }
}

fragment Interface on ApiDocInterface {
  typeParameters {
    name
    optional
    comment
  }
  properties {
    ...Base
    ...PropertySignature
  }
}

fragment PropertySignature on ApiDocPropertySignature {
  optional
  readonly
}

fragment Function on ApiDocFunction {
  parameters {
    ...FunctionParameter
  }
}

fragment Class on ApiDocClass {
  implements
  properties {
    ...Base
    ...Property
  }
  methods {
    ...Base
    ...Method
  }
}

fragment Property on ApiDocProperty {
  abstract
  optional
  protected
  static
  readonly
}

fragment Method on ApiDocMethod {
  abstract
  optional
  protected
  static
  parameters {
    ...FunctionParameter
  }
}

fragment FunctionParameter on ApiDocFunctionParameter {
  name
  type
  optional
  comment
}

`;

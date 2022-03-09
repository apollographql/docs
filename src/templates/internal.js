import PropTypes from 'prop-types';
import React from 'react';
import {Page} from '../components/Page';
import {graphql} from 'gatsby';

export default function InternalPage({data, uri, pageContext, serverData}) {
  console.log(serverData);
  return <Page data={data} uri={uri} pageContext={pageContext} />;
}

InternalPage.propTypes = {
  data: PropTypes.object.isRequired,
  uri: PropTypes.string.isRequired,
  pageContext: PropTypes.object.isRequired,
  serverData: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  query GetInternalPage($id: String!) {
    file(id: {eq: $id}) {
      ...PageFragment
    }
  }
`;

export function getServerData(req) {
  console.log(req);
  return {
    props: {
      foo: 123
    }
  };
}

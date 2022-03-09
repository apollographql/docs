import {graphql} from 'gatsby';
export {Page as default} from '../components/Page';

export const pageQuery = graphql`
  query GetPage($id: String!) {
    file(id: {eq: $id}) {
      ...PageFragment
    }
  }
`;

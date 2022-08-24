import PageLayout, {usePageLayoutProps} from '../components/PageLayout';
import PropTypes from 'prop-types';
import React from 'react';
import {NotesList} from '../components/TechNotes';
import {PathContext} from '../utils';
import {graphql} from 'gatsby';

export const pageQuery = graphql`
  query AllTechNotesWithTag($tag: String) {
    notes: allMdx(
      filter: {frontmatter: {tags: {in: [$tag]}}}
      sort: {fields: frontmatter___title, order: ASC}
      limit: 2000
    ) {
      nodes {
        id
        fields {
          gitAuthorTime
          slug
        }
        frontmatter {
          title
        }
      }
    }
  }
`;

Tags.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired
};

export default function Tags({pageContext, data, location}) {
  const pageProps = usePageLayoutProps({
    pageContext,
    title: `Tagged with "${pageContext.tag}"`
  });

  return (
    <>
      <PathContext.Provider
        value={{
          uri: location.pathname,
          basePath: '/technotes',
          path: '/technotes'
        }}
      >
        <PageLayout {...pageProps}>
          <NotesList notes={data.notes.nodes} />
        </PageLayout>
      </PathContext.Provider>
    </>
  );
}

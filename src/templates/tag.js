import PropTypes from 'prop-types';
import React from 'react';
import {NotesList} from '../components/TechNotes';
import {PageContent, PageSeo} from '../components/PageLayout';
import {PageWidthProvider} from '../components/PageWidthContext';
import {graphql} from 'gatsby';

export const pageQuery = graphql`
  query AllTechNotesWithTag($tag: String) {
    notes: allFile(
      filter: {childMdx: {frontmatter: {tags: {in: [$tag]}}}}
      sort: {fields: childMdx___frontmatter___title, order: ASC}
      limit: 2000
    ) {
      nodes {
        fields {
          gitLogLatestDate
        }
        childMdx {
          id
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`;

Tags.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired
};

export default function Tags({pageContext, data}) {
  const title = `Tagged with “${pageContext.tag}”`;
  return (
    <PageWidthProvider>
      <PageSeo docset={pageContext.docset} title={title} />
      <PageContent title={title}>
        <NotesList notes={data.notes.nodes} />
      </PageContent>
    </PageWidthProvider>
  );
}

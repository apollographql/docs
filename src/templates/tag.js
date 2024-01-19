import PropTypes from "prop-types";
import React, { useMemo, useState } from "react";
import { NotesList } from "../components/TechNotes";
import { PageContent, PageSeo } from "../components/PageLayout";
import { PageWidthProvider } from "../components/PageWidthContext";
import { graphql } from "gatsby";
import { SORT_OPTIONS } from "../components/TechNotes/AllNotes";

export const pageQuery = graphql`
  query AllTechNotesWithTag($tag: String) {
        notesUpdatedAsc: allFile(
          filter: {childMdx: {slug: {regex: "/^TN\\d{4}/"}, frontmatter: { tags: { in: [$tag] } }}}
          sort: {fields: fields___gitLogLatestDate, order: ASC}
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
                description
                published
                tags
              }
              rawBody
              timeToRead
            }
          }
        }

        notesUpdatedDesc: allFile(
          filter: {childMdx: {slug: {regex: "/^TN\\d{4}/"}, frontmatter: { tags: { in: [$tag] } }}}
          sort: {fields: fields___gitLogLatestDate, order: DESC}
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
                description
                published
                tags
              }
              rawBody
              timeToRead
            }
          }
        }

        notesAlphabeticalAsc: allFile(
          filter: {childMdx: {slug: {regex: "/^TN\\d{4}/"}, frontmatter: { tags: { in: [$tag] } }}}
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
                description
                published
                tags
              }
              rawBody
              timeToRead
            }
          }
        }

        notesAlphabeticalDesc: allFile(
          filter: {childMdx: {slug: {regex: "/^TN\\d{4}/"}, frontmatter: { tags: { in: [$tag] } }}}
          sort: {fields: childMdx___frontmatter___title, order: DESC}
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
                description
                published
                tags
              }
              rawBody
              timeToRead
            }
          }
        }

        notesPublishedAsc: allFile(
          filter: {childMdx: {slug: {regex: "/^TN\\d{4}/"}, frontmatter: { tags: { in: [$tag] } }}}
          sort: {fields: childMdx___frontmatter___published, order: ASC}
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
                description
                published
                tags
              }
              rawBody
              timeToRead
            }
          }
        }

        notesPublishedDesc: allFile(
          filter: {childMdx: {slug: {regex: "/^TN\\d{4}/"}, frontmatter: { tags: { in: [$tag] } }}}
          sort: {fields: childMdx___frontmatter___published, order: DESC}
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
                description
                published
                tags
              }
              rawBody
              timeToRead
            }
          }
        }
      }
`;

Tags.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
};

export default function Tags({ pageContext, data }) {
  const title = `Tagged with “${pageContext.tag}”`;

  const [sort, setSort] = useState(SORT_OPTIONS.UPDATED_DESC);

  const rawNotes = useMemo(() => {
    switch (sort) {
      case SORT_OPTIONS.UPDATED_ASC:
        return data.notesUpdatedAsc;
      case SORT_OPTIONS.UPDATED_DESC:
        return data.notesUpdatedDesc;
      case SORT_OPTIONS.PUBLISHED_ASC:
        return data.notesPublishedAsc;
      case SORT_OPTIONS.PUBLISHED_DESC:
        return data.notesPublishedDesc;
      case SORT_OPTIONS.ALPHABETICAL_ASC:
        return data.notesAlphabeticalAsc;
      case SORT_OPTIONS.ALPHABETICAL_DESC:
        return data.notesAlphabeticalDesc;
    }
  }, [sort]);

  const notes = rawNotes.nodes;

  return (
    <PageWidthProvider>
      <PageSeo docset={pageContext.docset} title={title} />
      <PageContent title={title}>
        <NotesList notes={notes} sort={sort} setSort={setSort} />
      </PageContent>
    </PageWidthProvider>
  );
}

import React, { useMemo, useState } from "react";
import { NotesList } from "./NotesList";
import { TagList } from "./TagList";
import { graphql, useStaticQuery } from "gatsby";
import { Heading } from "@chakra-ui/react";

export const SORT_OPTIONS = {
  UPDATED_ASC: "UPDATED_ASC",
  UPDATED_DESC: "UPDATED_DESC",
  PUBLISHED_ASC: "PUBLISHED_ASC",
  PUBLISHED_DESC: "PUBLISHED_DESC",
  ALPHABETICAL_ASC: "ALPHABETICAL_ASC",
  ALPHABETICAL_DESC: "ALPHABETICAL_DESC",
};

export function AllNotes() {
  const data = useStaticQuery(
    graphql`
      query AllTechNotes {
        notesUpdatedAsc: allFile(
          filter: {childMdx: {slug: {regex: "/^TN\\d{4}/"}}}
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
          filter: {childMdx: {slug: {regex: "/^TN\\d{4}/"}}}
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
          filter: {childMdx: {slug: {regex: "/^TN\\d{4}/"}}}
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
          filter: {childMdx: {slug: {regex: "/^TN\\d{4}/"}}}
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
          filter: {childMdx: {slug: {regex: "/^TN\\d{4}/"}}}
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
          filter: {childMdx: {slug: {regex: "/^TN\\d{4}/"}}}
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
    `
  );

  const [currentTag, setCurrentTag] = useState();
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

  const notes = useMemo(() => {
    if (!currentTag) {
      return rawNotes.nodes;
    } else {
      return rawNotes.nodes.filter((note) => note.childMdx.frontmatter.tags.includes(currentTag));
    }
  }, [currentTag, rawNotes]);

  return (
    <>
      <Heading mb={2}>{currentTag ? `Notes tagged “${currentTag}”` : "All notes"}</Heading>
      <TagList selected={currentTag} onClick={setCurrentTag} />
      <NotesList notes={notes} setCurrentTag={setCurrentTag} sort={sort} setSort={setSort} />
    </>
  );
}

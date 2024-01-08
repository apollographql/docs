import React, { useMemo, useState } from "react";
import { NotesList } from "./NotesList";
import { TagList } from "./TagList";
import { graphql, useStaticQuery } from "gatsby";
import { Flex, Heading, Link } from "@chakra-ui/react";
import { PrimaryLink } from "../RelativeLink";

const SORT_OPTIONS = {
  RECENTLY_UPDATED: "Recently updated",
  RECENTLY_ADDED: "Recently added",
  ALPHABETICAL: "Alphabetical",
};

export function AllNotes() {
  const data = useStaticQuery(
    graphql`
      query AllTechNotes {
        notesRecentlyUpdated: allFile(
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
                summary
                published
                tags
              }
              rawBody
              timeToRead
            }
          }
        }

        notesAlphabetical: allFile(
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
                summary
                published
                tags
              }
              rawBody
              timeToRead
            }
          }
        }

        notesRecentlyAdded: allFile(
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
                summary
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
  const [sort, setSort] = useState(SORT_OPTIONS.RECENTLY_UPDATED);

  const rawNotes = useMemo(() => {
    switch (sort) {
      case SORT_OPTIONS.RECENTLY_ADDED:
        return data.notesRecentlyAdded;
      case SORT_OPTIONS.RECENTLY_UPDATED:
        return data.notesRecentlyUpdated;
      case SORT_OPTIONS.ALPHABETICAL:
        return data.notesAlphabetical;
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

      <Flex fontSize="sm" gap={4} justify={"right"} mb={2}>
        Sort By:
        {Object.keys(SORT_OPTIONS).map((sortOptionId) =>
          SORT_OPTIONS[sortOptionId] === sort ? (
            <strong>{SORT_OPTIONS[sortOptionId]}</strong>
          ) : (
            <PrimaryLink as={Link} onClick={() => setSort(SORT_OPTIONS[sortOptionId])}>
              {SORT_OPTIONS[sortOptionId]}
            </PrimaryLink>
          )
        )}
      </Flex>
      <NotesList notes={notes} setCurrentTag={setCurrentTag} />
    </>
  );
}

import React from "react";
import { NotesList } from "./NotesList";
import { graphql, useStaticQuery } from "gatsby";
import { Heading } from "@chakra-ui/react";

export function RecentlyUpdatedNotes() {
  const data = useStaticQuery(
    graphql`
      query RecentlyUpdatedNotes {
        notes: allFile(
          filter: {childMdx: {slug: {regex: "/^TN\\d{4}/"}}}
          sort: {fields: fields___gitLogLatestDate, order: DESC}
          limit: 5
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

  return (
    <div>
      <Heading mb={6}>Recently updated notes</Heading>
      <NotesList notes={data.notes.nodes} skinnyMode />
    </div>
  );
}

import React, { useMemo, useState } from "react";
import { NotesList } from "./NotesList";
import { graphql, useStaticQuery } from "gatsby";
import { Heading } from "@chakra-ui/react";

export function RecentlyAddedNotes() {
  const data = useStaticQuery(
    graphql`
      query RecentlyAddedNotes {
        notes: allFile(
          filter: {childMdx: {slug: {regex: "/^TN\\d{4}/"}, frontmatter: { published: {ne: null}}}}
          sort: {fields: childMdx___frontmatter___published, order: DESC}
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
      <Heading mb={6}>Recently added notes</Heading>
      <NotesList notes={data.notes.nodes} skinnyMode />
    </div>
  );
}

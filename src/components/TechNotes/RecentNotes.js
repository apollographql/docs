import React from 'react';
import {NotesList} from './NotesList';
import {graphql, useStaticQuery} from 'gatsby';

export function RecentNotes() {
  const data = useStaticQuery(
    graphql`
      query RecentTechNotes {
        notes: allMdx(
          filter: {slug: {regex: "/^TN\\d{4}/"}}
          sort: {fields: fields___gitAuthorTime, order: DESC}
          limit: 10
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
    `
  );
  return <NotesList notes={data.notes.nodes} />;
}

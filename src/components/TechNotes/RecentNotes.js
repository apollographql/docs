import React from 'react';
import {NotesList} from './NotesList';
import {graphql, useStaticQuery} from 'gatsby';

export function RecentNotes() {
  const data = useStaticQuery(
    graphql`
      query RecentTechNotes {
        notes: allFile(
          filter: {childMdx: {slug: {regex: "/^TN\\d{4}/"}}}
          sort: {fields: fields___gitLogLatestDate, order: DESC}
          limit: 10
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
    `
  );
  return <NotesList notes={data.notes.nodes} />;
}

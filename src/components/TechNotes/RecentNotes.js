import NotesList from './NotesList';
import React from 'react';
import {graphql, useStaticQuery} from 'gatsby';

export default function RecentNotes() {
  const data = useStaticQuery(
    graphql`
      query RecentTechNotes {
        allFile(
          filter: { childMdx: { slug: { regex: "/^TN\\d{4}/" } } }
          sort: { fields: changeTime, order: DESC }
          limit: 10
        ) {
          nodes {
            changeTime
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
  return (
    <NotesList
      notes={data.allFile.nodes.map(({childMdx, changeTime}) => ({
        ...childMdx,
        parent: {
          changeTime
        }
      }))}
    />
  );
}

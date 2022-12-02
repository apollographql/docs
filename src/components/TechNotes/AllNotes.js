import React, {useMemo, useState} from 'react';
import {Heading} from '@chakra-ui/react';
import {NotesList} from './NotesList';
import {TagList} from './TagList';
import {graphql, useStaticQuery} from 'gatsby';

export function AllNotes() {
  const data = useStaticQuery(
    graphql`
      query AllTechNotesAlphabetical {
        notes: allFile(
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
                tags
              }
            }
          }
        }
      }
    `
  );

  const [currentTag, setCurrentTag] = useState();

  const notes = useMemo(() => {
    if (!currentTag) {
      return data.notes.nodes;
    } else {
      return data.notes.nodes.filter(note =>
        note.childMdx.frontmatter.tags.includes(currentTag)
      );
    }
  }, [currentTag, data.notes.nodes]);

  return (
    <>
      <Heading>
        {currentTag ? `Notes tagged “${currentTag}”` : 'All notes'}
      </Heading>
      <TagList selected={currentTag} onClick={setCurrentTag} />
      <NotesList notes={notes} />
    </>
  );
}

import PropTypes from 'prop-types';
import React from 'react';
import RelativeLink from '../RelativeLink';
import {Flex, List, ListItem} from '@chakra-ui/react';

export function NotesList({notes}) {
  return (
    <List spacing="1">
      {notes.map(note => (
        <ListItem key={note.childMdx.id}>
          <Flex justify="space-between">
            <RelativeLink href={note.childMdx.fields.slug}>
              {note.childMdx.frontmatter.title}
            </RelativeLink>
            <span>
              Last Updated{' '}
              {new Intl.DateTimeFormat('en-US').format(
                new Date(note.fields?.gitLogLatestDate ?? Date.now())
              )}
            </span>
          </Flex>
        </ListItem>
      ))}
    </List>
  );
}

NotesList.propTypes = {
  notes: PropTypes.array.isRequired
};

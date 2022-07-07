import PropTypes from 'prop-types';
import React from 'react';
import RelativeLink from '../RelativeLink';
import {Flex, List, ListItem} from '@chakra-ui/react';

export function NotesList({notes}) {
  return (
    <List spacing="1">
      {notes.map(note => (
        <ListItem key={note.id}>
          <Flex justify="space-between">
            <RelativeLink href={note.fields.slug}>
              {note.frontmatter.title}
            </RelativeLink>
            <span>
              Last Updated{' '}
              {new Intl.DateTimeFormat('en-US').format(
                new Date(note.parent.changeTime)
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

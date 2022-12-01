import PropTypes from 'prop-types';
import React from 'react';
import RelativeLink from '../RelativeLink';
import moment from 'moment';
import {Flex, List, ListItem} from '@chakra-ui/react';

const getBrowserCompatibleDate = note => {
  // The date string here look like "2022-11-01 16:39:41 -0400"
  // This is not valid in Safari, so we are just splitting and selecting the date part
  // since the time and timezone offset are not needed
  const gitLogDate = note.fields?.gitLogLatestDate ?? '';
  const simpleDate = gitLogDate.split(' ')[0] ?? Date.now();
  return moment(simpleDate).format('YYYY-MM-DD');
};

export function NotesList({notes}) {
  return (
    <List spacing="1">
      {notes.map(note => (
        <ListItem key={note.childMdx.id}>
          <Flex justify="space-between">
            <RelativeLink href={note.childMdx.fields.slug}>
              {note.childMdx.frontmatter.title}
            </RelativeLink>
            <span style={{flexShrink: 0}}>
              Last Updated {getBrowserCompatibleDate(note)}
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

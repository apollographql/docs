import PropTypes from 'prop-types';
import React from 'react';
import RelativeLink from '../RelativeLink';
import moment from 'moment';
import {Table, Tbody, Td, Th, Thead, Tr} from '@chakra-ui/react';

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
    <Table variant="unstyled">
      <Thead>
        <Tr>
          <Th>Title</Th>
          <Th>Last updated</Th>
        </Tr>
      </Thead>
      <Tbody>
        {notes.map(note => (
          <Tr key={note.childMdx.id}>
            <Td>
              <RelativeLink href={note.childMdx.fields.slug}>
                {note.childMdx.frontmatter.title}
              </RelativeLink>
            </Td>
            <Td>
              <span style={{whiteSpace: 'nowrap'}}>
                {getBrowserCompatibleDate(note)}
              </span>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

NotesList.propTypes = {
  notes: PropTypes.array.isRequired
};

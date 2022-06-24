import PropTypes from 'prop-types';
import React from 'react';
import {HStack} from '@chakra-ui/react';
import {PrimaryLink} from '../../components/RelativeLink';

RecentTechNote.propTypes = {file: PropTypes.any};

export function RecentTechNote(props) {
  return (
    <HStack justifyContent={'space-between'}>
      <PrimaryLink href={`../..${props.file.node.fields.slug}`}>
        {props.file.node.frontmatter.title}
      </PrimaryLink>
      <span>
        Last Updated{' '}
        {new Intl.DateTimeFormat('en-US').format(
          new Date(props.file.node.parent.changeTime)
        )}
      </span>
    </HStack>
  );
}

import PropTypes from 'prop-types';
import React from 'react';
import {Button, Wrap, WrapItem} from '@chakra-ui/react';
import {graphql, useStaticQuery} from 'gatsby';

export function TagList({onClick, selected}) {
  const {
    allMdx: {group}
  } = useStaticQuery(
    graphql`
      query AllTags {
        allMdx {
          group(field: frontmatter___tags) {
            tag: fieldValue
            totalCount
          }
        }
      }
    `
  );

  return (
    <Wrap>
      {group
        .sort((a, b) => a.tag.localeCompare(b.tag))
        .map(group => (
          <WrapItem key={group.tag}>
            <Button
              size="sm"
              onClick={() =>
                group.tag === selected ? onClick() : onClick(group.tag)
              }
              isActive={group.tag === selected}
            >
              {group.tag} ({group.totalCount})
            </Button>
          </WrapItem>
        ))}
    </Wrap>
  );
}

TagList.propTypes = {
  selected: PropTypes.string,
  onClick: PropTypes.func.isRequired
};

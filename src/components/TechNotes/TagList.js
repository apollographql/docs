import React from 'react';
import {Button, Wrap, WrapItem} from '@chakra-ui/react';
import {Link as GatsbyLink, graphql, useStaticQuery} from 'gatsby';
import {kebabCase} from 'lodash';

export function TagList() {
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
              as={GatsbyLink}
              to={`/technotes/tags/${kebabCase(group.tag)}`}
            >
              {group.tag} ({group.totalCount})
            </Button>
          </WrapItem>
        ))}
    </Wrap>
  );
}

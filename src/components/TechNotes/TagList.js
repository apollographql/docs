import React from 'react';
import {Button, Flex} from '@chakra-ui/react';
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
    <Flex gap={2}>
      {group
        .sort((a, b) => a.tag.localeCompare(b.tag))
        .map(group => (
          <Button
            key={group.tag}
            as={GatsbyLink}
            to={`/technotes/tags/${kebabCase(group.tag)}`}
          >
            {group.tag} ({group.totalCount})
          </Button>
        ))}
    </Flex>
  );
}

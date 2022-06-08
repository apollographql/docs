import React from 'react';
import {graphql, useStaticQuery} from 'gatsby';
import {Flex, HStack} from '@chakra-ui/react';
import {PrimaryLink} from '../RelativeLink';

export default function RecentNotes() {
  const {
    allFile: {nodes: files}
  } = useStaticQuery(
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
              slug
              frontmatter {
                title
                id
              }
            }
          }
        }
      }
      `
  );

  return (
    <Flex direction="column">
      {files.map(file => (
        <HStack key={file.childMdx.slug} justifyContent={'space-between'}>
          <PrimaryLink href={`/technotes/${file.childMdx.slug}`}>
            {file.childMdx.frontmatter.id} - {file.childMdx.frontmatter.title}
          </PrimaryLink>
          <span>
            Last updated{' '}
            {new Intl.DateTimeFormat().format(new Date(file.changeTime))}
          </span>
        </HStack>
      ))}
    </Flex>
  );
}

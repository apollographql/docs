import PageLayout, {usePageLayoutProps} from '../components/PageLayout';
import PropTypes from 'prop-types';
import React from 'react';
import RelativeLink from '../components/RelativeLink';
import {Flex, List, ListItem} from '@chakra-ui/react';
import {PathContext} from '../utils';
import {graphql} from 'gatsby';

export const pageQuery = graphql`
  query ($tag: String) {
    notes: allMdx(
      filter: {frontmatter: {tags: {in: [$tag]}}}
      sort: {fields: frontmatter___title, order: ASC}
      limit: 2000
    ) {
      totalCount
      nodes {
        id
        fields {
          slug
        }
        frontmatter {
          title
        }
        parent {
          ... on File {
            changeTime
          }
        }
      }
    }
  }
`;

Tags.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired
};

export default function Tags({pageContext, data, location}) {
  const pageProps = usePageLayoutProps({
    pageContext,
    title: `Tagged with "${pageContext.tag}"`
  });

  return (
    <>
      <PathContext.Provider
        value={{
          uri: location.pathname,
          basePath: '/technotes',
          path: '/technotes'
        }}
      >
        <PageLayout {...pageProps}>
          <List spacing="1">
            {data.notes.nodes.map(note => (
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
        </PageLayout>
      </PathContext.Provider>
    </>
  );
}

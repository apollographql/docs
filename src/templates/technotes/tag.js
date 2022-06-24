import DocsetMenu from '../../components/DocsetMenu';
import Footer from '../../components/Footer';
import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import useLocalStorage from 'react-use/lib/useLocalStorage';
import {ApolloHeader} from '../../components/ApolloHeader';
import {ApolloSidebar} from '../../components/ApolloSidebar';
import {Box, Divider, Flex, Heading, useToken} from '@chakra-ui/react';
import {PathContext} from '../../utils';
import {RecentTechNote} from './RecentTechNote';
import {SIDEBAR_WIDTH_BASE, SIDEBAR_WIDTH_XL} from '../../components/Sidebar';
import {graphql} from 'gatsby';

export const pageQuery = graphql`
  query ($tag: String) {
    allMdx(
      filter: {frontmatter: {tags: {in: [$tag]}}}
      sort: {fields: frontmatter___title, order: ASC}
      limit: 2000
    ) {
      totalCount
      edges {
        node {
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
  }
`;

Tags.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired
};

export default function Tags(props) {
  const {pageContext, data, location} = props;
  const [sidebarHidden, setSidebarHidden] = useLocalStorage('sidebar');
  const paddingTop = useToken('space', 10);
  const paddingBottom = useToken('space', 12);

  const {pathname: uri} = location;
  const {docset, versions, currentVersion, navItems, algoliaFilters} =
    pageContext;

  const renderSwitcher = useCallback(
    props => (
      <DocsetMenu
        docset={docset}
        versions={versions ?? []}
        currentVersion={currentVersion}
        {...props}
      />
    ),
    [docset, versions, currentVersion]
  );

  return (
    <>
      <PathContext.Provider
        value={{
          uri,
          basePath: '/technotes',
          path: '/technotes'
        }}
      >
        <ApolloHeader
          algoliaFilters={algoliaFilters}
          navItems={navItems}
          renderSwitcher={renderSwitcher({size: 'sm'})}
          renderSwitcher1={renderSwitcher({d: {base: 'none', md: 'flex'}})}
        />
        <ApolloSidebar
          in={sidebarHidden}
          onClick={() => setSidebarHidden(false)}
          navItems={navItems}
          onHide={() => setSidebarHidden(true)}
        />
        <Box
          marginLeft={{
            base: 0,
            md: sidebarHidden ? 0 : SIDEBAR_WIDTH_BASE,
            xl: sidebarHidden ? 0 : SIDEBAR_WIDTH_XL
          }}
          transitionProperty="margin-left"
          transitionDuration="normal"
        >
          <Flex
            maxW="6xl"
            mx="auto"
            align="flex-start"
            px={{base: 6, md: 10}}
            as="main"
            sx={{
              paddingTop,
              paddingBottom
            }}
          >
            <Box flexGrow="1" w="0">
              <Heading as="h1" size="2xl">
                Tagged with &ldquo;{pageContext.tag}&rdquo;
              </Heading>

              <Divider my="8" />
              <Box fontSize={{md: 'lg'}} lineHeight={{md: 1.7}}>
                <Flex direction="column">
                  {data.allMdx.edges.map(file => (
                    <RecentTechNote key={file.node.fields.slug} file={file} />
                  ))}
                </Flex>
              </Box>
            </Box>
          </Flex>
          <Footer />
        </Box>
      </PathContext.Provider>
    </>
  );
}

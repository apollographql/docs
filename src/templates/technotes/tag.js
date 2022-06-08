import DocsetMenu from '../../components/DocsetMenu';
import Footer from '../../components/Footer';
import Header, {TOTAL_HEADER_HEIGHT} from '../../components/Header';
import MobileNav from '../../components/MobileNav';
import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import Sidebar, {
  SIDEBAR_WIDTH_BASE,
  SIDEBAR_WIDTH_XL,
  SidebarNav
} from '../../components/Sidebar';
import useLocalStorage from 'react-use/lib/useLocalStorage';
import {
  Box,
  Divider,
  Fade,
  Flex,
  HStack,
  Heading,
  IconButton,
  Tooltip,
  useToken
} from '@chakra-ui/react';
import {FiChevronsRight} from 'react-icons/fi';
import {PathContext} from '../../utils';
import {PrimaryLink} from '../../components/RelativeLink';
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
        <Header algoliaFilters={algoliaFilters}>
          <MobileNav>
            <SidebarNav navItems={navItems} darkBg="gray.700">
              <Box px="3" pt="1" pb="3">
                {renderSwitcher({size: 'sm'})}
              </Box>
            </SidebarNav>
          </MobileNav>
          {renderSwitcher({d: {base: 'none', md: 'flex'}})}
        </Header>
        <Fade in={sidebarHidden} unmountOnExit delay={0.25}>
          <Tooltip placement="right" label="Show sidebar">
            <IconButton
              d={{base: 'none', md: 'flex'}}
              pos="fixed"
              mt="2"
              left="2"
              size="sm"
              variant="outline"
              fontSize="md"
              icon={<FiChevronsRight />}
              css={{top: TOTAL_HEADER_HEIGHT}}
              onClick={() => setSidebarHidden(false)}
            />
          </Tooltip>
        </Fade>
        <Sidebar isHidden={sidebarHidden}>
          <SidebarNav
            navItems={navItems}
            onHide={() => setSidebarHidden(true)}
          />
        </Sidebar>
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
                    <HStack
                      key={file.node.fields.slug}
                      justifyContent={'space-between'}
                    >
                      <PrimaryLink href={`../..${file.node.fields.slug}`}>
                        {file.node.frontmatter.title}
                      </PrimaryLink>
                      <span>
                        Last Updated{' '}
                        {new Intl.DateTimeFormat('en-US').format(
                          new Date(file.node.parent.changeTime)
                        )}
                      </span>
                    </HStack>
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

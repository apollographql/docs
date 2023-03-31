import React, {useContext} from 'react';
import {AiOutlineHome} from '@react-icons/all-files/ai/AiOutlineHome';
import {
  Box,
  Button,
  DarkMode,
  Stack,
  StackDivider,
  chakra,
  useColorModeValue
} from '@chakra-ui/react';
import {DOCSET_ICONS} from '../DocsetMenu';
import {
  DocsetContext,
  SidebarCategory,
  SidebarCategoryLink
} from './SidebarCategory';
import {Link as GatsbyLink} from 'gatsby';
import {IoSchoolOutline} from 'react-icons/io5';
import {Rocket} from 'lucide-react';

export const SIDEBAR_WIDTH = 280;
export const COLLAPSED_SIDEBAR_WIDTH = 93;

export function LeftSidebarNav() {
  const {
    setActiveDocset,
    sidebarOpen,
    setSidebarOpen,
    dismissSidebar,
    clickToSelect
  } = useContext(DocsetContext);

  const bgColor = useColorModeValue('gray.800', 'gray.900');

  return (
    <Box
      w={SIDEBAR_WIDTH}
      color="white"
      fontWeight="semibold"
      bgColor={bgColor}
      flexShrink="0"
      overflow="auto"
      overscrollBehavior="none"
      onMouseOver={event => {
        if (!clickToSelect) {
          setSidebarOpen(true);

          if (event.target === event.currentTarget) {
            setActiveDocset(null);
          }
        }
      }}
    >
      <Stack
        p="4"
        spacing="4"
        divider={
          <StackDivider
            css={{width: !sidebarOpen && COLLAPSED_SIDEBAR_WIDTH - 32}}
            borderColor="whiteAlpha.300"
          />
        }
      >
        <SidebarCategory title="Start">
          <SidebarCategoryLink docset="/" icon={<AiOutlineHome />} />
          <SidebarCategoryLink docset="odyssey" icon={<IoSchoolOutline />} />
        </SidebarCategory>
        <SidebarCategory title="SDKs">
          <SidebarCategoryLink
            docset="apollo-server"
            icon={DOCSET_ICONS['apollo-server']}
          />
          <SidebarCategoryLink
            docset="react"
            icon={DOCSET_ICONS['apollo-client']}
          />
          <SidebarCategoryLink
            docset="kotlin"
            icon={DOCSET_ICONS['apollo-kotlin']}
          />
          <SidebarCategoryLink docset="ios" icon={DOCSET_ICONS['apollo-ios']} />
        </SidebarCategory>
        <SidebarCategory
          title={
            <>
              GraphOS{' '}
              <chakra.span ml="auto">
                <DarkMode>
                  <Button
                    as={GatsbyLink}
                    size="sm"
                    to="/graphos/quickstart/cloud"
                    leftIcon={<Box as={Rocket} boxSize="1em" />}
                    onClick={dismissSidebar}
                  >
                    Get started
                  </Button>
                </DarkMode>
              </chakra.span>
            </>
          }
        >
          <SidebarCategoryLink docset="graphos" icon={DOCSET_ICONS.graphos}>
            <span>Building Graphs</span>
          </SidebarCategoryLink>
          <SidebarCategoryLink
            docset="graphos/delivery"
            icon={DOCSET_ICONS.delivery}
          />
          <SidebarCategoryLink
            docset="graphos/metrics"
            icon={DOCSET_ICONS.metrics}
          />
          <SidebarCategoryLink
            docset="graphos/security"
            icon={DOCSET_ICONS.security}
          />
          <SidebarCategoryLink
            docset="federation"
            icon={DOCSET_ICONS.federation}
          />
          <SidebarCategoryLink docset="graphos/org" icon={DOCSET_ICONS.org} />
          <SidebarCategoryLink docset="rover" icon={DOCSET_ICONS.rover} />
          <SidebarCategoryLink docset="router" icon={DOCSET_ICONS.router} />
          <SidebarCategoryLink
            docset="technotes"
            icon={DOCSET_ICONS.technotes}
          />
        </SidebarCategory>
      </Stack>
    </Box>
  );
}

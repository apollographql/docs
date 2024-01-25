import React, {useContext} from 'react';
import {
  Box,
  Button,
  DarkMode,
  Stack,
  StackDivider,
  chakra
} from '@chakra-ui/react';
import {DOCSET_ICONS} from '../DocsetMenu';
import {
  DocsetContext,
  SidebarCategory,
  SidebarCategoryLink
} from './SidebarCategory';
import {Link as GatsbyLink} from 'gatsby';
import {Rocket} from 'lucide-react';

export const SIDEBAR_WIDTH = 280;
export const COLLAPSED_SIDEBAR_WIDTH = 93;

export function LeftSidebarNav(props) {
  const {sidebarOpen, dismissSidebar} = useContext(DocsetContext);

  return (
    <Box
      color="text"
      fontWeight="semibold"
      bgColor="bg"
      flexShrink="0"
      overflowY="auto"
      overflowX="hidden"
      overscrollBehavior="none"
      {...props}
    >
      <Stack
        p="4"
        spacing="4"
        divider={
          <StackDivider
            css={{width: !sidebarOpen && COLLAPSED_SIDEBAR_WIDTH - 32}}
            borderColor="border"
          />
        }
      >
        <SidebarCategory title="Welcome">
          <SidebarCategoryLink docset="/" icon={DOCSET_ICONS.home} />
          <SidebarCategoryLink docset="odyssey" icon={DOCSET_ICONS.education} />
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
          <SidebarCategoryLink docset="graphos" icon={DOCSET_ICONS.graphos} />
          <SidebarCategoryLink
            docset="graphos/delivery"
            icon={DOCSET_ICONS.delivery}
          />
          <SidebarCategoryLink
            docset="graphos/explorer"
            icon={DOCSET_ICONS.explorer}
          />
          <SidebarCategoryLink
            docset="graphos/metrics"
            icon={DOCSET_ICONS.metrics}
          />
          <SidebarCategoryLink docset="graphos/org" icon={DOCSET_ICONS.org} />
          <SidebarCategoryLink
            docset="federation"
            icon={DOCSET_ICONS.federation}
          />
          <SidebarCategoryLink docset="rover" icon={DOCSET_ICONS.rover} />
          <SidebarCategoryLink docset="router" icon={DOCSET_ICONS.router} />
          <SidebarCategoryLink
            docset="graphos/enterprise"
            icon={DOCSET_ICONS.enterprise}
          />
          <SidebarCategoryLink
            docset="technotes"
            icon={DOCSET_ICONS.technotes}
          />
        </SidebarCategory>
      </Stack>
    </Box>
  );
}

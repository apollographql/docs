import React, {useContext} from 'react';
import {
  ApolloClientIcon,
  ApolloIOSIcon,
  ApolloKotlinIcon,
  ApolloServerIcon,
  DeliveryIcon,
  EnterpriseIcon,
  ExplorerIcon,
  FederationIcon,
  GraphOSIcon,
  HomeIcon,
  MetricsIcon,
  OdysseyIcon,
  OrgIcon,
  RocketIcon,
  RouterIcon,
  RoverIcon,
  TechnotesIcon
} from '../Icons';
import {
  Box,
  Button,
  DarkMode,
  Stack,
  StackDivider,
  chakra
} from '@chakra-ui/react';
import {
  DocsetContext,
  SidebarCategory,
  SidebarCategoryLink
} from './SidebarCategory';
import {Link as GatsbyLink} from 'gatsby';

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
          <SidebarCategoryLink docset="/" icon={<HomeIcon />} />
          <SidebarCategoryLink docset="odyssey" icon={<OdysseyIcon />} />
        </SidebarCategory>
        <SidebarCategory title="SDKs">
          <SidebarCategoryLink
            docset="apollo-server"
            icon={<ApolloServerIcon />}
          />
          <SidebarCategoryLink docset="react" icon={<ApolloClientIcon />} />
          <SidebarCategoryLink docset="kotlin" icon={<ApolloKotlinIcon />} />
          <SidebarCategoryLink docset="ios" icon={<ApolloIOSIcon />} />
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
                    leftIcon={<RocketIcon />}
                    onClick={dismissSidebar}
                  >
                    Get started
                  </Button>
                </DarkMode>
              </chakra.span>
            </>
          }
        >
          <SidebarCategoryLink docset="graphos" icon={<GraphOSIcon />} />
          <SidebarCategoryLink
            docset="graphos/delivery"
            icon={<DeliveryIcon />}
          />
          <SidebarCategoryLink
            docset="graphos/explorer"
            icon={<ExplorerIcon />}
          />
          <SidebarCategoryLink
            docset="graphos/metrics"
            icon={<MetricsIcon />}
          />
          <SidebarCategoryLink docset="graphos/org" icon={<OrgIcon />} />
          <SidebarCategoryLink docset="federation" icon={<FederationIcon />} />
          <SidebarCategoryLink docset="rover" icon={<RoverIcon />} />
          <SidebarCategoryLink docset="router" icon={<RouterIcon />} />
          <SidebarCategoryLink
            docset="graphos/enterprise"
            icon={<EnterpriseIcon />}
          />
          <SidebarCategoryLink docset="technotes" icon={<TechnotesIcon />} />
        </SidebarCategory>
      </Stack>
    </Box>
  );
}

import DocsetButton from './DocsetButton';
import DocsetGroup from './DocsetGroup';
import PropTypes from 'prop-types';
import React from 'react';
import {ReactComponent as ApolloMark} from '@apollo/space-kit/logos/mark.svg';
import {
  Box,
  Button,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  useDisclosure
} from '@chakra-ui/react';
import {ReactComponent as Document} from "@apollo/icons/default/IconDocument.svg";
import {ReactComponent as Education} from "@apollo/icons/default/IconEducation.svg";
import {ReactComponent as Enterprise} from "@apollo/icons/default/IconEnterpriseFeatures.svg";
import {ReactComponent as Explorer} from "@apollo/icons/default/IconExplorer.svg";
import {ReactComponent as Federation} from "@apollo/icons/default/IconHierarchy.svg";
import {ReactComponent as GraphQL} from "@apollo/icons/default/IconGraphQL.svg";
import {ReactComponent as Home} from "@apollo/icons/default/IconHome.svg";
import {ReactComponent as Insights} from "@apollo/icons/default/IconInsights.svg";
import {ReactComponent as Pipeline} from "@apollo/icons/default/IconPipeline.svg";
import {ReactComponent as ReactIcon} from "@apollo/icons/default/IconReact.svg";
import {ReactComponent as Rocket} from "@apollo/icons/default/IconRocket.svg";
import {ReactComponent as Router} from "@apollo/icons/default/IconRouter.svg";
import {ReactComponent as Satellite} from "@apollo/icons/default/IconSatellite3.svg";
import {ReactComponent as Schema} from "@apollo/icons/default/IconSchema.svg";
import {ReactComponent as Success} from "@apollo/icons/default/IconSuccess.svg";
import {ReactComponent as Team} from "@apollo/icons/default/IconTeam.svg";
import {ReactComponent as Terminal} from "@apollo/icons/default/IconAppWindow.svg";
import {FaJava, FaNodeJs} from 'react-icons/fa';
import {Link as GatsbyLink} from 'gatsby';
import {ReactComponent as LayoutModule} from "@apollo/icons/default/IconLayoutModule.svg";
import {ReactComponent as Kotlin} from "@apollo/icons/default/IconKotlin.svg";
import {SiCsharp} from 'react-icons/si';
import {ReactComponent as Swift} from "@apollo/icons/default/IconSwift.svg";
import {ReactComponent as ChevronDown} from "@apollo/icons/default/IconChevronDown.svg";

const CustomIcon = ({icon}) => <Box fill="color" boxSize="1em" as={icon} />;

CustomIcon.propTypes = {
  icon: PropTypes.elementType.isRequired
};

export const DOCSET_ICONS = {
  default: <CustomIcon icon={ApolloMark} />,
  'apollo-client': <CustomIcon icon={ReactIcon} />,
  'apollo-ios': <CustomIcon icon={Swift} />,
  'apollo-kotlin': <CustomIcon icon={Kotlin} />,
  'apollo-server': <CustomIcon icon={Satellite} />,
  check: <CustomIcon icon={Success} />,
  csharp: <SiCsharp />,
  delivery: <CustomIcon icon={Pipeline} />,
  education: <CustomIcon icon={Education} />,
  enterprise: <CustomIcon icon={Enterprise} />,
  explorer: <CustomIcon icon={Explorer} />,
  federation: <CustomIcon icon={Federation} />,
  graphos: <CustomIcon icon={Schema} />,
  graphql: <CustomIcon icon={GraphQL} />,
  home: <CustomIcon icon={Home} />,
  java: <FaJava />,
  metrics: <CustomIcon icon={Insights} />,
  nodejs: <FaNodeJs />,
  odyssey: <CustomIcon icon={Rocket} />,
  org: <CustomIcon icon={Team} />,
  rover: <CustomIcon icon={Terminal} />,
  router: <CustomIcon icon={Router} />,
  technotes: <CustomIcon icon={Document} />
};

export function DocsetMenu({docset, versions = [], currentVersion, ...props}) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  return (
    <>
      <ButtonGroup isAttached {...props}>
        <Button rightIcon={<CustomIcon icon={LayoutModule} />} onClick={onOpen} colorScheme="indigo">
          {docset}
        </Button>
        {versions.length > 1 && (
          <Menu>
            <MenuButton
              as={Button}
              variant="outline"
              rightIcon={<CustomIcon icon={ChevronDown} />}
              borderLeft="none"
            >
              {currentVersion}
            </MenuButton>
            <MenuList>
              {versions.map((version, index) => (
                <GatsbyLink key={index} to={'/' + version.slug}>
                  <MenuItem>{version.label}</MenuItem>
                </GatsbyLink>
              ))}
            </MenuList>
          </Menu>
        )}
      </ButtonGroup>
      <Modal returnFocusOnClose={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mx={[4, 6, 8]}>
          <ModalCloseButton />
          <Stack spacing="4" p="6">
            <DocsetGroup title="Get started">
              <DocsetButton
                to="/"
                leftIcon={DOCSET_ICONS.default}
                tooltipLabel="Introduction to Apollo"
              >
                Docs Home
              </DocsetButton>
              <DocsetButton
                to="https://www.apollographql.com/tutorials/"
                leftIcon={DOCSET_ICONS.odyssey}
                tooltipLabel="Fun, interactive courses with videos and quizzes"
              >
                Odyssey Tutorials
              </DocsetButton>
            </DocsetGroup>
            <DocsetGroup title="Build your supergraph">
              <DocsetButton
                leftIcon={DOCSET_ICONS.graphos}
                to="/graphos"
                tooltipLabel="Cloud platform for building, managing, and collaborating on your supergraph"
              >
                GraphOS
              </DocsetButton>
              <DocsetButton
                leftIcon={DOCSET_ICONS.federation}
                to="/federation"
                tooltipLabel="Architecture for building a unified supergraph from multiple GraphQL APIs"
              >
                Federation
              </DocsetButton>
            </DocsetGroup>
            <DocsetGroup title="Technical reference">
              <DocsetButton
                leftIcon={DOCSET_ICONS['apollo-server']}
                to="/apollo-server"
                tooltipLabel="Node.js GraphQL server library for standalone use or as a subgraph"
              >
                Server
              </DocsetButton>
              <DocsetButton
                leftIcon={DOCSET_ICONS.router}
                to="/router"
                tooltipLabel="High-performance router executable for self-hosted supergraphs"
              >
                Router
              </DocsetButton>
              <DocsetButton
                leftIcon={DOCSET_ICONS.rover}
                to="/rover"
                tooltipLabel="Command-line tool for managing graphs"
              >
                Rover CLI
              </DocsetButton>
              <DocsetButton
                leftIcon={DOCSET_ICONS.technotes}
                to="/technotes"
                tooltipLabel="In-depth articles on specialized topics"
              >
                Tech Notes
              </DocsetButton>
            </DocsetGroup>
            <DocsetGroup title="Apollo Client">
              <DocsetButton
                leftIcon={DOCSET_ICONS['apollo-client']}
                to="/react"
                tooltipLabel="GraphQL client library for React and JavaScript"
              >
                React
              </DocsetButton>
              <DocsetButton
                leftIcon={DOCSET_ICONS['apollo-ios']}
                to="/ios"
                tooltipLabel="GraphQL client library for iOS"
              >
                iOS
              </DocsetButton>
              <DocsetButton
                leftIcon={DOCSET_ICONS['apollo-kotlin']}
                to="/kotlin"
                tooltipLabel="GraphQL client library for Kotlin and Android"
              >
                Kotlin
              </DocsetButton>
            </DocsetGroup>
          </Stack>
        </ModalContent>
      </Modal>
    </>
  );
}

DocsetMenu.propTypes = {
  docset: PropTypes.string.isRequired,
  versions: PropTypes.array,
  currentVersion: PropTypes.string
};

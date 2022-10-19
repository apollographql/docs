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
import {FaNodeJs} from 'react-icons/fa';
import {ReactComponent as Federation} from '../../assets/icons/federation.svg';
import {FiChevronDown, FiFileText, FiGrid} from 'react-icons/fi';
import {Link as GatsbyLink} from 'gatsby';
import {GoTerminal} from 'react-icons/go';
import {IoRocketSharp} from 'react-icons/io5';
import {ReactComponent as Router} from '../../assets/icons/router.svg';
import {ReactComponent as Schema} from '../../assets/icons/schema.svg';
import {SiKotlin, SiReact, SiSwift} from 'react-icons/si';

const CustomIcon = ({icon}) => <Box fill="current" boxSize="1em" as={icon} />;

CustomIcon.propTypes = {
  icon: PropTypes.elementType.isRequired
};

export const DOCSET_ICONS = {
  default: <CustomIcon icon={ApolloMark} />,
  'apollo-client': <SiReact />,
  'apollo-ios': <SiSwift />,
  'apollo-kotlin': <SiKotlin />,
  'apollo-server': <FaNodeJs />,
  federation: <CustomIcon icon={Federation} />,
  graphos: <CustomIcon icon={Schema} />,
  rover: <GoTerminal />,
  router: <CustomIcon icon={Router} />,
  odyssey: <IoRocketSharp />,
  technotes: <FiFileText />
};

export function DocsetMenu({docset, versions = [], currentVersion, ...props}) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  return (
    <>
      <ButtonGroup isAttached {...props}>
        <Button rightIcon={<FiGrid />} onClick={onOpen} colorScheme="indigo">
          {docset}
        </Button>
        {versions.length > 1 && (
          <Menu>
            <MenuButton
              as={Button}
              variant="outline"
              rightIcon={<FiChevronDown />}
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
              <DocsetButton to="/" leftIcon={DOCSET_ICONS.default}>
                Docs Home
              </DocsetButton>
              <DocsetButton
                to="https://www.apollographql.com/tutorials/"
                leftIcon={DOCSET_ICONS.odyssey}
              >
                Odyssey Tutorials
              </DocsetButton>
            </DocsetGroup>
            <DocsetGroup title="Build your supergraph">
              <DocsetButton leftIcon={DOCSET_ICONS.graphos} to="/graphos">
                GraphOS
              </DocsetButton>
              <DocsetButton leftIcon={DOCSET_ICONS.federation} to="/federation">
                Federation
              </DocsetButton>
            </DocsetGroup>
            <DocsetGroup title="Technical reference">
              <DocsetButton
                leftIcon={DOCSET_ICONS['apollo-server']}
                to="/apollo-server"
              >
                Server
              </DocsetButton>
              <DocsetButton leftIcon={DOCSET_ICONS.router} to="/router">
                Router
              </DocsetButton>
              <DocsetButton leftIcon={DOCSET_ICONS.rover} to="/rover">
                Rover CLI
              </DocsetButton>
              <DocsetButton leftIcon={DOCSET_ICONS.technotes} to="/technotes">
                Tech Notes
              </DocsetButton>
            </DocsetGroup>
            <DocsetGroup title="Apollo Client">
              <DocsetButton
                leftIcon={DOCSET_ICONS['apollo-client']}
                to="/react"
              >
                React
              </DocsetButton>
              <DocsetButton leftIcon={DOCSET_ICONS['apollo-ios']} to="/ios">
                iOS
              </DocsetButton>
              <DocsetButton
                leftIcon={DOCSET_ICONS['apollo-kotlin']}
                to="/kotlin"
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

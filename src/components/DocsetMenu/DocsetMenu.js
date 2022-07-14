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
import {ReactComponent as Federation} from '../../assets/icons/federation.svg';
import {FiChevronDown, FiGrid} from 'react-icons/fi';
import {Link as GatsbyLink} from 'gatsby';
import {IoBookOutline, IoRocketSharp} from 'react-icons/io5';
import {ReactComponent as Router} from '../../assets/icons/router.svg';
import {ReactComponent as Rover} from '../../assets/icons/rover.svg';
import {ReactComponent as Satellite} from '../../assets/icons/satellite.svg';
import {ReactComponent as Schema} from '../../assets/icons/schema.svg';
import {SiKotlin, SiReact, SiSwift} from 'react-icons/si';

const CustomIcon = ({icon}) => <Box fill="current" boxSize="1em" as={icon} />;

CustomIcon.propTypes = {
  icon: PropTypes.elementType.isRequired
};

export const DOCSET_ICONS = {
  react: <SiReact />,
  ios: <SiSwift />,
  android: <SiKotlin />, // TODO: update algolia index to be called "kotlin"
  server: <CustomIcon icon={Satellite} />,
  apollo: <CustomIcon icon={ApolloMark} />,
  federation: <CustomIcon icon={Federation} />,
  studio: <CustomIcon icon={Schema} />,
  rover: <CustomIcon icon={Rover} />,
  router: <CustomIcon icon={Router} />,
  odyssey: <IoRocketSharp />,
  technotes: <IoBookOutline />
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
              <DocsetButton to="/" leftIcon={DOCSET_ICONS.apollo}>
                Docs Home
              </DocsetButton>
              <DocsetButton
                to="https://www.apollographql.com/tutorials/"
                leftIcon={DOCSET_ICONS.odyssey}
              >
                Odyssey Tutorials
              </DocsetButton>
            </DocsetGroup>
            <DocsetGroup title="Apollo Client">
              <DocsetButton leftIcon={DOCSET_ICONS.react} to="/react">
                React
              </DocsetButton>
              <DocsetButton leftIcon={DOCSET_ICONS.ios} to="/ios">
                iOS
              </DocsetButton>
              <DocsetButton leftIcon={DOCSET_ICONS.android} to="/kotlin">
                Kotlin
              </DocsetButton>
            </DocsetGroup>
            <DocsetGroup title="Backend">
              <DocsetButton leftIcon={DOCSET_ICONS.server} to="/apollo-server">
                Server
              </DocsetButton>
              <DocsetButton leftIcon={DOCSET_ICONS.federation} to="/federation">
                Federation
              </DocsetButton>
              <DocsetButton leftIcon={DOCSET_ICONS.router} to="/router">
                Router
              </DocsetButton>
            </DocsetGroup>
            <DocsetGroup title="Cloud">
              <DocsetButton leftIcon={DOCSET_ICONS.studio} to="/studio">
                Studio
              </DocsetButton>
              <DocsetButton leftIcon={DOCSET_ICONS.rover} to="/rover">
                Rover CLI
              </DocsetButton>
            </DocsetGroup>
            <DocsetGroup title="Specialized topics">
              <DocsetButton leftIcon={DOCSET_ICONS.technotes} to="/technotes">
                Tech Notes
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

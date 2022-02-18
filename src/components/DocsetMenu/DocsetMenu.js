import DocsetButton from './DocsetButton';
import DocsetGroup from './DocsetGroup';
import PropTypes from 'prop-types';
import React from 'react';
import {ReactComponent as ApolloMark} from '@apollo/space-kit/logos/mark.svg';
import {
  Box,
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  useDisclosure
} from '@chakra-ui/react';
import {ReactComponent as Federation} from '../../assets/icons/federation.svg';
import {FiGrid} from 'react-icons/fi';
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
  rover: <CustomIcon icon={Rover} />
};

export function DocsetMenu(props) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  return (
    <>
      <Button rightIcon={<FiGrid />} onClick={onOpen} {...props} />
      <Modal returnFocusOnClose={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <Stack spacing="4" p="6">
            <DocsetGroup title="Get started">
              <DocsetButton to="/" leftIcon={DOCSET_ICONS.apollo}>
                Apollo Basics
              </DocsetButton>
            </DocsetGroup>
            <DocsetGroup title="Client">
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
              <DocsetButton to="/router">Router</DocsetButton>
            </DocsetGroup>
            <DocsetGroup title="Tools">
              <DocsetButton leftIcon={DOCSET_ICONS.studio} to="/studio">
                Studio
              </DocsetButton>
              <DocsetButton leftIcon={DOCSET_ICONS.rover} to="/rover">
                Rover CLI
              </DocsetButton>
            </DocsetGroup>
          </Stack>
        </ModalContent>
      </Modal>
    </>
  );
}

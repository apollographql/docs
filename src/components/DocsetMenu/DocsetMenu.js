import DocsetButton from './DocsetButton';
import DocsetGroup from './DocsetGroup';
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
import {IoGitNetworkOutline} from 'react-icons/io5';
import {SiKotlin, SiNodedotjs, SiReact, SiSwift} from 'react-icons/si';

export const DOCSET_ICONS = {
  react: <SiReact />,
  ios: <SiSwift />,
  android: <SiKotlin />, // TODO: update algolia index to be called "kotlin"
  server: <SiNodedotjs />,
  apollo: <Box fill="current" h="1em" as={ApolloMark} />,
  federation: <IoGitNetworkOutline />
};

export function DocsetMenu(props) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  return (
    <>
      <Button onClick={onOpen} {...props} />
      <Modal isOpen={isOpen} onClose={onClose}>
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
              <DocsetButton to="/studio">Studio</DocsetButton>
              <DocsetButton to="/rover">Rover CLI</DocsetButton>
            </DocsetGroup>
          </Stack>
        </ModalContent>
      </Modal>
    </>
  );
}

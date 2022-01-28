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
import {SiKotlin, SiReact, SiSwift} from 'react-icons/si';

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
              <DocsetButton
                to="/"
                leftIcon={<Box fill="current" h="1em" as={ApolloMark} />}
              >
                Apollo Basics
              </DocsetButton>
            </DocsetGroup>
            <DocsetGroup title="Client">
              <DocsetButton leftIcon={<SiReact />} to="/react">
                React
              </DocsetButton>
              <DocsetButton leftIcon={<SiSwift />} to="/ios">
                iOS
              </DocsetButton>
              <DocsetButton leftIcon={<SiKotlin />} to="/kotlin">
                Kotlin
              </DocsetButton>
            </DocsetGroup>
            <DocsetGroup title="Backend">
              <DocsetButton to="/apollo-server">Server</DocsetButton>
              <DocsetButton to="/federation">Federation</DocsetButton>
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

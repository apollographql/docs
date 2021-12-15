import DocsetButton from './DocsetButton';
import DocsetGroup from './DocsetGroup';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  useDisclosure
} from '@chakra-ui/react';

export function DocsetMenu(props) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  return (
    <>
      <Button onClick={onOpen} fontSize="sm" colorScheme="indigo" {...props} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <Stack spacing="4" p="6">
            <DocsetGroup title="Get started">
              <DocsetButton to="/">Apollo Basics</DocsetButton>
            </DocsetGroup>
            <DocsetGroup title="Client">
              <DocsetButton to="/react">React</DocsetButton>
              <DocsetButton to="/ios">iOS</DocsetButton>
              <DocsetButton to="/kotlin">Kotlin</DocsetButton>
            </DocsetGroup>
            <DocsetGroup title="Backend">
              <DocsetButton to="/apollo-server">Server</DocsetButton>
              <DocsetButton to="/federation">Federation</DocsetButton>
              <DocsetButton to="/router">Router</DocsetButton>
            </DocsetGroup>
          </Stack>
        </ModalContent>
      </Modal>
    </>
  );
}

DocsetMenu.propTypes = {
  label: PropTypes.string.isRequired
};

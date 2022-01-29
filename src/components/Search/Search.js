import Autocomplete from './Autocomplete';
import React from 'react';
import SearchButton from './SearchButton';
import useKey from 'react-use/lib/useKey';
import {
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react';

export function Search() {
  const {isOpen, onOpen, onClose} = useDisclosure();
  useKey(
    '/',
    event => {
      if (!isOpen) {
        event.preventDefault();
        onOpen();
      }
    },
    undefined,
    [isOpen]
  );
  return (
    <>
      <SearchButton onClick={onOpen} />
      <Modal size="4xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent overflow="hidden">
          <Autocomplete onClose={onClose} />
        </ModalContent>
      </Modal>
    </>
  );
}

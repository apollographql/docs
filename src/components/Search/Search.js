import Autocomplete from './Autocomplete';
import React from 'react';
import SearchButton from './SearchButton';
import {
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react';

export function Search() {
  const {isOpen, onOpen, onClose} = useDisclosure();
  return (
    <>
      <SearchButton onClick={onOpen} />
      <Modal size="4xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent overflow="hidden">
          <Autocomplete />
        </ModalContent>
      </Modal>
    </>
  );
}

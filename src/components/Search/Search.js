import Autocomplete from './Autocomplete';
import React from 'react';
import SearchButton from './SearchButton';
import useKey from 'react-use/lib/useKey';
import {FiSearch} from 'react-icons/fi';
import {
  IconButton,
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
      <IconButton
        d={{base: 'flex', sm: 'none'}}
        fontSize="xl"
        icon={<FiSearch />}
        onClick={onOpen}
      />
      <Modal
        returnFocusOnClose={false}
        size="4xl"
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent overflow="hidden" mx="8">
          <Autocomplete onClose={onClose} />
        </ModalContent>
      </Modal>
    </>
  );
}

import PropTypes from 'prop-types';
import React from 'react';
import SearchButton from './SearchButton';
import loadable from '@loadable/component';
import useKey from 'react-use/lib/useKey';
import {FiSearch} from 'react-icons/fi';
import {
  IconButton,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react';

const Autocomplete = loadable(() => import('./Autocomplete'));

export function Search({algoliaFilters}) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  useKey(
    event =>
      event.key === '/' ||
      // allow cmd+k to open the search modal
      (event.metaKey && event.key === 'k'),
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
      <SearchButton mr="2" onClick={onOpen} />
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
        <ModalContent overflow="hidden" mx={[4, 6, 8]}>
          {/* TODO: consider using context to avoid passing down site config */}
          <Autocomplete onClose={onClose} optionalFilters={algoliaFilters} />
        </ModalContent>
      </Modal>
    </>
  );
}

Search.propTypes = {
  algoliaFilters: PropTypes.array
};

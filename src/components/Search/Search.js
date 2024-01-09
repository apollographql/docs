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

const AutocompleteWithQuery = loadable(() => import('./AutocompleteWithQuery'));

export function Search({algoliaFilters}) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  // const hasSearchQuery = Boolean(
  //   new URL(window.location).searchParams.get('search')
  // );
  // const isOpen = hasSearchQuery;
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
      <SearchButton
        mx={{
          base: 10,
          md: 88
        }}
        onClick={onOpen}
      />
      <IconButton
        ml="auto"
        mr="2"
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
          <AutocompleteWithQuery
            onClose={onClose}
            optionalFilters={algoliaFilters}
          />
        </ModalContent>
      </Modal>
    </>
  );
}

Search.propTypes = {
  algoliaFilters: PropTypes.array
};

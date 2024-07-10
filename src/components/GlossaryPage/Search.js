import React from 'react';
import {CloseIcon, SearchIcon} from '../Icons';
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement
} from '@chakra-ui/react';
import {useSearchBox} from 'react-instantsearch';

function Search(props) {
  const {query, refine, clear} = useSearchBox(props);

  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.300" />
      </InputLeftElement>
      <Input
        type="text"
        placeholder="Search for terms"
        value={query}
        onChange={e => refine(e.target.value)}
      />
      <InputRightElement>
      <IconButton
        aria-label="Clear search"
        cursor="pointer"
        variant="ghost"
        onClick={clear}
        icon={<CloseIcon />}
      />
      </InputRightElement>
    </InputGroup>
  );
}

export default Search;

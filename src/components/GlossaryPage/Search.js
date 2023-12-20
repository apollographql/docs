import React from 'react';
import {FiSearch, FiX} from 'react-icons/fi';
import {
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
        <FiSearch color="gray.300" />
      </InputLeftElement>
      <Input
        type="text"
        placeholder="Search for terms"
        value={query}
        onChange={e => refine(e.target.value)}
      />
      <InputRightElement>
        <FiX color="gray.300" onClick={clear} />
      </InputRightElement>
    </InputGroup>
  );
}

export default Search;

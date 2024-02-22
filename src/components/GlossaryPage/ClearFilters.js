import React from 'react';
import {Button} from '@chakra-ui/react';
import {useClearRefinements} from 'react-instantsearch';

export const ClearFilters = props => {
  const {refine, canRefine} = useClearRefinements(props);
  return (
    <Button
      onClick={() => refine()}
      disabled={!canRefine}
      visibility={canRefine ? 'visible' : 'hidden'}
      colorScheme="navy"
      variant="link"
      fontWeight="bold"
      _hover={{textDecoration: 'underline'}}
      ml="4"
    >
      Clear
    </Button>
  );
};

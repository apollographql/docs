import React from 'react';
import {Button} from '@chakra-ui/react';
import {useClearRefinements} from 'react-instantsearch';

export const ClearFilters = props => {
  const {refine, canRefine} = useClearRefinements(props);
  return (
    <Button
      onClick={() => refine()}
      disabled={!canRefine}
      colorScheme="teal"
      variant="outline"
    >
      Clear filters
    </Button>
  );
};

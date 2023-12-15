import React from 'react';
import {Button} from '@chakra-ui/react';
import {useRefinementList} from 'react-instantsearch';

export const LabelFilterButton = ({label}) => {
  const {items, refine} = useRefinementList({attribute: 'labels'});
  const currentItem = items.find(item => (item.label = label));

  const handleClick = () => {
    if (!currentItem.isRefined) {
      refine(currentItem.value);
    }
  };

  return (
    <Button
      onClick={handleClick}
      colorScheme={currentItem.isRefined ? 'teal' : 'gray'}
      variant={currentItem.isRefined ? 'solid' : 'outline'}
    >
      {label}
    </Button>
  );
};

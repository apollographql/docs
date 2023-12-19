import React from 'react';
import {Box, Checkbox, Flex, Stack, Text} from '@chakra-ui/react';
import {ClearFilters} from './ClearFilters';
import {useRefinementList} from 'react-instantsearch';

function LabelsFilter() {
  const {items, refine} = useRefinementList({
    attribute: 'labels',
    sortBy: ['count:desc']
  });

  const handleCheckboxChange = value => {
    refine(value);
  };

  return (
    <Box pb="4">
      {items.length > 0 && (
        <Flex alignItems="center" pb="2">
          <Text fontWeight="bold">Filter by labels</Text>
          <ClearFilters />
        </Flex>
      )}
      <Stack spacing="2">
        {items.map(item => (
          <Checkbox
            key={item.label}
            isChecked={item.isRefined}
            onChange={() => handleCheckboxChange(item.label)}
          >
            {item.label} ({item.count})
          </Checkbox>
        ))}
      </Stack>
    </Box>
  );
}

export default LabelsFilter;

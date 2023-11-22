import React from 'react';
import {Box, Checkbox, Stack, Text} from '@chakra-ui/react';
import {useRefinementList} from 'react-instantsearch';

function LabelsFilter() {
  const {items, refine} = useRefinementList({
    attribute: 'labels',
    sortBy: ['name:asc']
  });

  const handleCheckboxChange = value => {
    refine(value);
  };

  return (
    <Box>
      <Text fontWeight="bold">Filter by labels:</Text>
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

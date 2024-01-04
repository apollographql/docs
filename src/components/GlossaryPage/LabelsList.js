import React from 'react';
import {
  Box,
  Checkbox,
  Flex,
  Stack,
  Tag,
  TagLabel,
  Text
} from '@chakra-ui/react';
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
            <Tag
              key={item.label}
              size="md"
              colorScheme="indigo"
              _dark={{
                color: 'indigo.100'
              }}
              variant="outline"
              borderRadius="md"
            >
              <TagLabel>{item.label}</TagLabel>
            </Tag>
            <Text ml="1" as="span">
              ({item.count})
            </Text>
          </Checkbox>
        ))}
      </Stack>
    </Box>
  );
}

export default LabelsFilter;

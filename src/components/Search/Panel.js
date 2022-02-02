import Preview from './Preview';
import PropTypes from 'prop-types';
import React from 'react';
import Result from './Result';
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  useColorModeValue
} from '@chakra-ui/react';

export default function Panel({sources, autocomplete, autocompleteState}) {
  const markColor = useColorModeValue('indigo.500', 'inherit');
  return (
    <SimpleGrid
      h="md"
      columns="2"
      sx={{
        mark: {
          bg: 'none',
          color: markColor,
          fontWeight: 'semibold',
          textDecoration: 'underline'
        }
      }}
      {...autocomplete.getPanelProps({})}
    >
      <Box borderRightWidth="1px" overflow="auto">
        {autocompleteState.collections.map((collection, index) => {
          const {source, items} = collection;
          return (
            <div key={index}>
              <Flex align="center" p="2" pr="0">
                <Heading size="sm">{sources[source.sourceId]}</Heading>
                <Box borderBottomWidth="1px" flexGrow="1" ml="2" />
              </Flex>
              {items.length > 0 && (
                <ul {...autocomplete.getListProps()}>
                  {items.map(item => (
                    <Result
                      key={item.objectID}
                      item={item}
                      {...autocomplete.getItemProps({
                        item,
                        source
                      })}
                    />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </Box>
      {autocompleteState.context.preview && (
        <Preview preview={autocompleteState.context.preview} />
      )}
    </SimpleGrid>
  );
}

Panel.propTypes = {
  sources: PropTypes.object.isRequired,
  autocomplete: PropTypes.object.isRequired,
  autocompleteState: PropTypes.object.isRequired
};

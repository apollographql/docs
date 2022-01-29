import PropTypes from 'prop-types';
import React from 'react';
import {Box, List, ListItem, useColorMode, useTheme} from '@chakra-ui/react';

export default function Results({autocomplete, collections}) {
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const {
    _hover: {bg: activeBg}
  } = theme.components.Button.variants.ghost({
    theme,
    colorMode,
    colorScheme: 'indigo'
  });
  return (
    <div>
      {collections.map((collection, index) => {
        const {source, items} = collection;
        return (
          <div key={index}>
            {items.length > 0 && (
              <List {...autocomplete.getListProps()}>
                {items.map(item => (
                  <ListItem
                    key={item.objectID}
                    px="4"
                    py="2"
                    sx={{
                      '&[aria-selected="true"]': {
                        bg: activeBg
                      }
                    }}
                    {...autocomplete.getItemProps({
                      item,
                      source
                    })}
                  >
                    <Box fontSize="lg">{item.title}</Box>
                    <Box fontSize="sm" isTruncated>
                      {item.excerpt}
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </div>
        );
      })}
    </div>
  );
}

Results.propTypes = {
  autocomplete: PropTypes.object.isRequired,
  collections: PropTypes.array.isRequired
};

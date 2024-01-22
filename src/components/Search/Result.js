import Highlight from './Highlight';
import PropTypes from 'prop-types';
import React from 'react';
import ResultIcon from './ResultIcon';
import {Box, Flex, chakra, useColorMode, useTheme} from '@chakra-ui/react';

export default function Result({item, ...props}) {
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const {
    _hover: {bg: activeBg}
  } = theme.components.Button.variants.ghost({
    theme,
    colorMode,
    colorScheme: 'indigo'
  });

  const {text, title, description} = item._highlightResult;
  const {'aria-selected': isSelected} = props;

  const url = item.__autocomplete_indexName == "staging_docs" && typeof window !== 'undefined' ? window.location.origin + item.slug : item.url;

  return (
    <chakra.li bg={isSelected && activeBg} {...props}>
      <Flex as="a" href={url} p="2">
        <Box mr="3" fontSize="xl" color="primary" flexShrink="0">
          <ResultIcon result={item} />
        </Box>
        <Box lineHeight="shorter" w="0" flexGrow="1">
          <Box fontSize="lg">
            <Highlight value={title.value} />
          </Box>
          <Box
            fontSize="sm"
            color="gray.500"
            _dark={{
              color: 'gray.400'
            }}
            isTruncated
          >
            <Highlight value={(text || description).value} />
          </Box>
        </Box>
        <Box
          ml="2"
          my="auto"
          d={!isSelected && 'none'}
          color="gray.500"
          _dark={{
            color: 'gray.400'
          }}
        >
          ⏎
        </Box>
      </Flex>
    </chakra.li>
  );
}

Result.propTypes = {
  item: PropTypes.object.isRequired,
  'aria-selected': PropTypes.bool.isRequired
};

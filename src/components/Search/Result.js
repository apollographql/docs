import Highlight from './Highlight';
import PropTypes from 'prop-types';
import React from 'react';
import ResultIcon from './ResultIcon';
import {
  Box,
  Flex,
  useColorMode,
  useColorModeValue,
  useTheme
} from '@chakra-ui/react';
import {useAccentColor} from '../../utils';

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

  const iconColor = useAccentColor();
  const highlightColor = useColorModeValue('gray.500', 'gray.400');
  const {text, title, description} = item._highlightResult;

  return (
    <Flex
      as="li"
      p="2"
      sx={{
        '&[aria-selected="true"]': {
          bg: activeBg
        }
      }}
      {...props}
    >
      <Box mr="3" fontSize="xl" color={iconColor} flexShrink="0">
        <ResultIcon result={item} />
      </Box>
      <Box lineHeight="shorter" w="0" flexGrow="1">
        <Box fontSize="lg">
          <Highlight value={title.value} />
        </Box>
        <Box fontSize="sm" color={highlightColor} isTruncated>
          <Highlight value={(text || description).value} />
        </Box>
      </Box>
      <Box
        ml="2"
        my="auto"
        display="none"
        color={highlightColor}
        sx={{
          '[aria-selected="true"] > &': {
            display: 'block'
          }
        }}
      >
        ⏎
      </Box>
    </Flex>
  );
}

Result.propTypes = {
  item: PropTypes.object.isRequired
};

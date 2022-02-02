import PropTypes from 'prop-types';
import React from 'react';
import {Box, Button, Collapse, useDisclosure} from '@chakra-ui/react';
import {FiChevronDown, FiChevronUp} from 'react-icons/fi';
import {useAccentColor} from '../utils';

export default function ExpansionPanel({children, title = 'Click to expand'}) {
  const {isOpen, onToggle} = useDisclosure();
  const borderColor = useAccentColor();
  return (
    <Box
      borderWidth="1px"
      borderLeftWidth="2px"
      borderLeftColor={borderColor}
      roundedRight="md"
      overflow="hidden"
    >
      <Button
        isFullWidth
        variant="ghost"
        rounded="none"
        justifyContent="flex-start"
        leftIcon={isOpen ? <FiChevronUp /> : <FiChevronDown />}
        onClick={onToggle}
        _focus={{shadow: 'none'}}
      >
        {title}
      </Button>
      <Collapse in={isOpen}>
        <Box p="4">{children}</Box>
      </Collapse>
    </Box>
  );
}

ExpansionPanel.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string
};

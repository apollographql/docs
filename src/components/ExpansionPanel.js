import PropTypes from 'prop-types';
import React from 'react';
import {
  Box,
  Button,
  Circle,
  Collapse,
  Flex,
  List,
  ListItem,
  Stack,
  useDisclosure
} from '@chakra-ui/react';
import {FiCheck, FiChevronDown, FiChevronUp} from 'react-icons/fi';

function ExpansionPanelLine(props) {
  return <Box w="px" mx="auto" bg="current" {...props} />;
}

export function ExpansionPanelListItem({number, children}) {
  const isLast = isNaN(number);
  return (
    <ListItem>
      <Flex>
        <Flex mr="2" shrink="0" direction="column" color="primary">
          <ExpansionPanelLine h="0.5" sx={number === 1 && {bg: 'none'}} />
          <Circle
            size="6"
            borderWidth="1px"
            lineHeight="none"
            fontSize="sm"
            borderColor="current"
          >
            {number}
          </Circle>
          {!isLast && <ExpansionPanelLine flexGrow="1" />}
        </Flex>
        <Stack shouldWrapChildren spacing="4" pb={isLast ? 0 : 6}>
          {children}
        </Stack>
      </Flex>
    </ListItem>
  );
}

ExpansionPanelListItem.propTypes = {
  number: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired
};

export function ExpansionPanelList({children}) {
  return (
    <List>
      {React.Children.toArray(children).map((child, index, array) => {
        const number = index + 1;
        return React.cloneElement(child, {
          number: number < array.length ? number : <FiCheck />
        });
      })}
    </List>
  );
}

ExpansionPanelList.propTypes = {
  children: PropTypes.node.isRequired
};

export default function ExpansionPanel({
  children,
  title = 'Click to expand',
  defaultIsOpen
}) {
  const {isOpen, onToggle} = useDisclosure({defaultIsOpen});
  return (
    <Box
      borderWidth="1px"
      borderLeftWidth="2px"
      borderLeftColor="primary"
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
        <Stack shouldWrapChildren spacing="4" p="4">
          {children}
        </Stack>
      </Collapse>
    </Box>
  );
}

ExpansionPanel.propTypes = {
  defaultIsOpen: PropTypes.bool,
  children: PropTypes.node.isRequired,
  title: PropTypes.string
};

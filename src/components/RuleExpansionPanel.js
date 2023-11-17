import PropTypes from 'prop-types';
import React from 'react';
import {
  Box,
  Button,
  Circle,
  Collapse,
  Flex,
  Heading,
  List,
  ListItem,
  Stack,
  StackDivider,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import {CustomHeading} from './CustomHeading';
import {FiCheck, FiChevronDown, FiChevronUp} from 'react-icons/fi';
import {MarkdownInAdmonitions} from './MarkdownInAdmonitions';

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
        <Stack shouldWrapChildren minW="0" spacing="4" pb={isLast ? 0 : 6}>
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

export default function RuleExpansionPanel({
  children,
  title,
  whatItDoes,
  rationale,
  defaultIsOpen
}) {
  const {isOpen, onToggle} = useDisclosure({defaultIsOpen});
  return (
    <Box borderWidth="1px" overflow="hidden">
      <Button
        isFullWidth
        variant="ghost"
        rounded="none"
        borderBottomWidth="1px"
        justifyContent="flex-start"
        leftIcon={isOpen ? <FiChevronUp /> : <FiChevronDown />}
        onClick={onToggle}
        _focus={{shadow: 'none'}}
      >
        <CustomHeading as="h4" size="sm">
          <code>{title}</code>
        </CustomHeading>
      </Button>
      <Collapse in={isOpen}>
        <Stack
          shouldWrapChildren
          divider={<StackDivider borderColor="border" />}
          spacing="6"
          pb="6"
        >
          {whatItDoes && (
            <Box px="6" pt="6">
              <Heading as="h4" size="md" mb={2}>
                What it does
              </Heading>
              <MarkdownInAdmonitions>{whatItDoes}</MarkdownInAdmonitions>
            </Box>
          )}
          {rationale && (
            <Box px="6">
              <Heading as="h4" size="md" mb={2}>
                Rationale
              </Heading>
              <MarkdownInAdmonitions>{rationale}</MarkdownInAdmonitions>
            </Box>
          )}
          {children && (
            <Box px="6">
              <Heading as="h4" size="md" mb={2}>
                Examples
              </Heading>
              {children ? children : ' '}
            </Box>
          )}
        </Stack>
      </Collapse>
    </Box>
  );
}

RuleExpansionPanel.propTypes = {
  defaultIsOpen: PropTypes.bool,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  whatItDoes: PropTypes.string,
  rationale: PropTypes.string
};

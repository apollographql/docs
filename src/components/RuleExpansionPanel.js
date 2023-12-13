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
  useDisclosure
} from '@chakra-ui/react';
import {FiCheck, FiChevronDown, FiChevronUp, FiPaperclip} from 'react-icons/fi';
import {MarkdownInAdmonitions} from './MarkdownInAdmonitions';

function CustomHeader({level, id, children, ...props}) {
  return React.createElement(
    Heading,
    {as: `h${level}`, ...props, id},
    children
  );
}

CustomHeader.propTypes = {
  level: PropTypes.string.required,
  id: PropTypes.string.required,
  children: PropTypes.node.required
};

function CopyLinkButton({headingId, isOpen}) {
  const handleCopyLink = event => {
    if (isOpen) {
      event.stopPropagation();
    }
    if (headingId) {
      const basePath = window.location.origin + window.location.pathname;
      const headingLink = `${basePath}#${headingId}`;
      navigator.clipboard.writeText(headingLink);

      // Update the URL in the browser
      const newUrl = headingLink;
      window.history.pushState({path: newUrl}, '', newUrl);
    }
  };

  return (
    <Button
      size="sm"
      ml="2"
      variant="ghost"
      color="gray.500"
      onClick={handleCopyLink}
    >
      <FiPaperclip />
    </Button>
  );
}

CopyLinkButton.propTypes = {
  headingId: PropTypes.string.required,
  isOpen: PropTypes.bool
};

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
        <Stack shouldWrapChildren minW="0" spacing="4" pb={isLast ? 2 : 6}>
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
  const id = title.replace(/\s+/g, '-').toLowerCase();
  return (
    <Box borderWidth="1px" overflow="hidden" id={`${id}-expansion-panel`}>
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
        <CustomHeader level="4" size="sm" id={id}>
          <code>{title}</code>
          <CopyLinkButton headingId={id} isOpen={isOpen} />
        </CustomHeader>
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

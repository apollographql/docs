import Highlight from './Highlight';
import InlineCode from '../InlineCode';
import Markdown from 'react-markdown';
import PropTypes from 'prop-types';
import React from 'react';
import {Box, Flex, Heading, Icon, Text} from '@chakra-ui/react';
import {BsJournals} from 'react-icons/bs';
import {PrimaryLink} from '../RelativeLink';

const DefinitionText = ({children}) => {
  return (
    <Box
      py="2"
      color="gray.500"
      _dark={{
        color: 'gray.400'
      }}
    >
      <Text>{children}</Text>
    </Box>
  );
};

function stripCodeExample(definition) {
  // Check if there are any code blocks
  const hasCodeBlocks = /```[\s\S]*?```/g.test(definition);

  if (hasCodeBlocks) {
    // Remove sentences with "the following example"
    definition = definition.replace(/.*?following example.*?(\n|$)/g, '');

    // Remove sentences starting with "For example:"
    definition = definition.replace(/For example.*?(\n|$)/g, '');

    // Remove sentences with the phrase "shown below"
    definition = definition.replace(/.*?shown below.*?(\n|$)/g, '');

    // Remove sentences with the phrase "example below"
    definition = definition.replace(/.*?example below.*?(\n|$)/g, '');

    // Remove all code blocks
    definition = definition.replace(/```[\s\S]*?```/g, '');
  }

  return definition;
}

export default function GlossaryResult({item}) {
  return (
    <Box key="Apollopedia" borderBottomWidth="1px" pb="16px">
      <Flex align="center" p="2" pr="0">
        <Heading size="sm">Glossary</Heading>
        <Box borderBottomWidth="1px" flexGrow="1" ml="2" />
      </Flex>
      <Flex p="2">
        <Box mr="3" fontSize="xl" color="primary" flexShrink="0">
          <Icon as={BsJournals} />
        </Box>
        <Box lineHeight="shorter" w="0" flexGrow="1">
          <Box fontSize="lg">
            <Highlight value={item._highlightResult.term.value} />
          </Box>
          <Markdown
            components={{
              p: DefinitionText,
              a: PrimaryLink,
              code: InlineCode
            }}
          >
            {stripCodeExample(item.definition)}
          </Markdown>
          <PrimaryLink
            aria-label="Go to the glossary"
            as="a"
            href={`https://www.apollographql.com/docs/resources/graphql-glossary#${item.term
              .replace(/\s+/g, '-')
              .toLowerCase()}`}
            mt="12px"
            style={{display: 'flex', alignItems: 'center'}}
          >
            {item.definition === stripCodeExample(item.definition)
              ? 'Go to the glossary ⏎'
              : 'Explore an example in the glossary ⏎'}
          </PrimaryLink>
        </Box>
      </Flex>
    </Box>
  );
}

GlossaryResult.propTypes = {
  item: PropTypes.object.isRequired
};

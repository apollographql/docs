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
  const hasCodeBlocks = /```[\s\S]*?```/g.test(definition);

  if (hasCodeBlocks) {
    // Find the index of the first occurrence of the code block
    const codeBlockIndex = definition.indexOf('```');

    if (codeBlockIndex !== -1) {
      // Capture the text before the code block
      const beforeCodeBlock = definition.substring(0, codeBlockIndex);

      // Remove everything after the code block
      definition = beforeCodeBlock.replace(/(\n|^)\s*$/, '');
    }

    // Remove the last sentence if it contains "example" or "shown below"
    const sentences = definition.split('.').map(sentence => sentence.trim());
    const filteredSentences = sentences
      .filter(sentence => sentence !== '')
      .filter(
        (sentence, i, arr) =>
          i !== arr.length - 1 ||
          (!sentence.includes('example') && !sentence.includes('shown below'))
      );

    definition = filteredSentences.join('. ').trim();
    if (!definition.endsWith('.')) {
      definition = definition += '.';
    }
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

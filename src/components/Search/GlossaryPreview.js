import Highlight from './Highlight';
import InlineCode from '../InlineCode';
import Markdown from 'react-markdown';
import PropTypes from 'prop-types';
import React from 'react';
import {Box, Flex, Heading, Icon, Text} from '@chakra-ui/react';
import {PrimaryLink} from '../RelativeLink';
import {RepositoryIcon} from '../Icons';
import {makeGlossaryTermId} from '../GlossaryPage/Results';

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

DefinitionText.propTypes = {
  children: PropTypes.node.isRequired
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

export default function GlossaryPreview({item}) {
  const host =
    process.env.CONTEXT === 'production'
      ? 'https://www.apollographql.com/docs'
      : process.env.DEPLOY_URL;

  return (
    <Flex borderLeftWidth="1px" direction="column" pos="relative">
      <Flex align="center" p="2">
        <Heading size="sm">Content preview</Heading>
        <Box borderBottomWidth="1px" flexGrow="1" ml="2" />
      </Flex>
      <Box px="5">
        <Flex my="5">
          <Box fontSize="2xl" color="primary">
            <Icon as={RepositoryIcon} />
          </Box>
          <Heading ml="2" size="md">
            Glossary
          </Heading>
        </Flex>

        <Box>
          <PrimaryLink
            color="text"
            as="a"
            href={`${host}/resources/glossary#${makeGlossaryTermId(item.term)}`}
          >
            <Highlight value={item._highlightResult.term.value} />
          </PrimaryLink>
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
          href={`${host}/resources/glossary#${makeGlossaryTermId(item.term)}`}
          mt="12px"
          style={{display: 'flex', alignItems: 'center'}}
        >
          {item.definition === stripCodeExample(item.definition)
            ? 'Go to the term in the glossary ⏎'
            : 'Explore an example in the glossary ⏎'}
        </PrimaryLink>
      </Box>
    </Flex>
  );
}

GlossaryPreview.propTypes = {
  item: PropTypes.object.isRequired
};

import Highlight from './Highlight';
import InlineCode from '../InlineCode';
import Markdown from 'react-markdown';
import PropTypes from 'prop-types';
import React from 'react';
import {Box, Flex, Heading, Icon, Text} from '@chakra-ui/react';
import {BsJournals} from 'react-icons/bs';
import {MarkdownCodeBlock} from '@apollo/chakra-helpers';
import {PrimaryLink} from '../RelativeLink';

export default function GlossaryResult({item}) {
  console.log(item);
  return (
    <Box key="Apollopedia" borderBottomWidth="1px" flexGrow="1" ml="2" p="2">
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
              p: Text,
              a: PrimaryLink,
              pre: MarkdownCodeBlock,
              code: InlineCode
            }}
          >
            {item.definition}
          </Markdown>
          <PrimaryLink
            aria-label="See term in glossary"
            mt="4"
            as="a"
            href={`https://www.apollographql.com/docs/resources/graphql-glossary#${item.term
              .replace(/\s+/g, '-')
              .toLowerCase()}`}
            style={{display: 'flex', alignItems: 'center'}}
          >
            See term in glossary ⏎
          </PrimaryLink>
        </Box>
      </Flex>
    </Box>
  );
}

GlossaryResult.propTypes = {
  item: PropTypes.object.isRequired
};

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

export default function GlossaryResult({item}) {
  return (
    <Box key="Apollopedia" borderBottomWidth="1px">
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
            {item.definitionWithoutExample
              ? item.definitionWithoutExample
              : item.definition}
          </Markdown>
          <PrimaryLink
            aria-label="See term in glossary"
            as="a"
            href={`https://www.apollographql.com/docs/resources/graphql-glossary#${item.term
              .replace(/\s+/g, '-')
              .toLowerCase()}`}
            style={{display: 'flex', alignItems: 'center'}}
          >
            {item.definitionWithoutExample
              ? 'See an example in the glossary ⏎'
              : 'See term in glossary ⏎'}
          </PrimaryLink>
        </Box>
      </Flex>
    </Box>
  );
}

GlossaryResult.propTypes = {
  item: PropTypes.object.isRequired
};

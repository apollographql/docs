import Highlight from './Highlight';
import InlineCode from '../InlineCode';
import Markdown from 'react-markdown';
import Preview from './Preview';
import PropTypes from 'prop-types';
import React, {useRef} from 'react';
import Result from './Result';
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  Wrap,
  WrapItem,
  useBreakpointValue
} from '@chakra-ui/react';
import {BsJournals} from 'react-icons/bs';
import {MarkdownCodeBlock} from '@apollo/chakra-helpers';
import {PrimaryLink} from '../RelativeLink';

export const DOCS_INDEX = 'docs';
export const QUERY_SUGGESTIONS_INDEX = 'docs_query_suggestions';
export const APOLLOPEDIA_INDEX = 'apollopedia';

export default function Panel({sources, autocomplete, autocompleteState}) {
  const scrollArea = useRef();
  const columns = useBreakpointValue({md: 2});
  const apollopediaResults = autocompleteState.collections.filter(
    collection =>
      collection.items.length > 0 &&
      collection.source.sourceId === 'apollopedia'
  )[0]?.items;
  console.log(apollopediaResults);
  return (
    <Box>
      {autocompleteState.query.length > 2 && apollopediaResults?.length > 0 && (
        <Box
          key="Apollopedia"
          borderBottomWidth="1px"
          flexGrow="1"
          ml="2"
          p="2"
        >
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
                <Highlight
                  value={apollopediaResults[0]._highlightResult.term.value}
                />
              </Box>
              <Markdown
                components={{
                  p: Text,
                  a: PrimaryLink,
                  pre: MarkdownCodeBlock,
                  code: InlineCode
                }}
              >
                {apollopediaResults[0].definition}
              </Markdown>
              <PrimaryLink
                aria-label="See term in glossary"
                mt="4"
                as="a"
                href={`https://www.apollographql.com/docs/resources/graphql-glossary#${apollopediaResults[0].term
                  .replace(/\s+/g, '-')
                  .toLowerCase()}`}
                style={{display: 'flex', alignItems: 'center'}}
              >
                See term in glossary ⏎
              </PrimaryLink>
            </Box>
          </Flex>
        </Box>
      )}
      <SimpleGrid h="md" columns={columns} {...autocomplete.getPanelProps()}>
        <Box ref={scrollArea} overflow="auto" pb="4">
          {autocompleteState.collections
            .filter(collection => collection.items.length > 0)
            .map((collection, index) => {
              const {source, items} = collection;
              if (source.sourceId !== 'apollopedia')
                return (
                  <div key={index}>
                    <Flex align="center" p="2" pr="0">
                      <Heading size="sm">{sources[source.sourceId]}</Heading>
                      <Box borderBottomWidth="1px" flexGrow="1" ml="2" />
                    </Flex>
                    {source.sourceId === QUERY_SUGGESTIONS_INDEX ? (
                      <Wrap px="2">
                        {items.map(item => (
                          <WrapItem key={item.objectID}>
                            <Button
                              variant="outline"
                              onClick={() => {
                                autocomplete.setQuery(item.query);
                                autocomplete.refresh();
                                scrollArea.current.scrollTo({top: 0});
                              }}
                            >
                              {item.query}
                            </Button>
                          </WrapItem>
                        ))}
                      </Wrap>
                    ) : (
                      <ul {...autocomplete.getListProps()}>
                        {items.map(item => (
                          <Result
                            key={item.objectID}
                            item={item}
                            {...autocomplete.getItemProps({
                              item,
                              source
                            })}
                          />
                        ))}
                      </ul>
                    )}
                  </div>
                );
            })}
        </Box>
        {columns === 2 && autocompleteState.context.preview && (
          <Preview preview={autocompleteState.context.preview} />
        )}
      </SimpleGrid>
    </Box>
  );
}

Panel.propTypes = {
  sources: PropTypes.object.isRequired,
  autocomplete: PropTypes.object.isRequired,
  autocompleteState: PropTypes.object.isRequired
};

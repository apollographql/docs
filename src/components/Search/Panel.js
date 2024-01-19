import GlossaryResult from './GlossaryResult';
import Preview from './Preview';
import PropTypes from 'prop-types';
import React, {useRef} from 'react';
import Result from './Result';
import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Wrap,
  WrapItem,
  useBreakpointValue
} from '@chakra-ui/react';

export const DOCS_INDEX = process.env.CONTEXT === 'production' ? 'docs' : 'staging_docs';
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
  const filteredApollopediaResults = apollopediaResults
    ?.filter(item => !item.internalOnly && item._rankingInfo?.nbTypos === 0)
    .sort((a, b) => a.term.length - b.term.length);
  return (
    <Box>
      {autocompleteState.query.length > 2 &&
        filteredApollopediaResults?.length > 0 && (
          <GlossaryResult item={filteredApollopediaResults[0]} />
        )}
      <SimpleGrid
        h="md"
        columns={columns}
        {...autocomplete.getPanelProps()}
        bg="bg"
      >
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

import Preview from './Preview';
import React, {useMemo, useState} from 'react';
import Results from './Results';
import algoliasearch from 'algoliasearch/lite';
import {FiSearch} from 'react-icons/fi';
import {
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid
} from '@chakra-ui/react';
import {createAutocomplete} from '@algolia/autocomplete-core';
import {getAlgoliaResults} from '@algolia/autocomplete-preset-algolia';

const searchClient = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_SEARCH_KEY
);

export default function Autocomplete() {
  const [autocompleteState, setAutocompleteState] = useState({});

  const autocomplete = useMemo(
    () =>
      createAutocomplete({
        debug: true,
        defaultActiveItemId: 0,
        onStateChange: ({state}) => setAutocompleteState(state),
        getSources: () => [
          {
            sourceId: 'docs',
            getItemUrl: ({item}) => item.url,
            getItemInputValue: ({item}) => item.query,
            getItems: ({query}) =>
              getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: 'docs',
                    query,
                    params: {
                      hitsPerPage: 4,
                      highlightPreTag: '<mark>',
                      highlightPostTag: '</mark>'
                    }
                  }
                ]
              }),
            onActive: ({item, setContext}) => setContext({preview: item})
          }
        ]
      }),
    []
  );

  return (
    <div {...autocomplete.getRootProps({})}>
      <InputGroup size="lg">
        <Input
          borderWidth="0"
          focusBorderColor="transparent"
          roundedBottom={autocompleteState.isOpen ? 'none' : undefined}
          {...autocomplete.getInputProps({
            type: null,
            placeholder: 'What do you want to learn about GraphQL?'
          })}
        />
        <InputLeftElement>
          <FiSearch />
        </InputLeftElement>
      </InputGroup>
      {autocompleteState.isOpen && (
        <SimpleGrid
          columns="2"
          borderTopWidth="1px"
          {...autocomplete.getPanelProps({})}
        >
          <Results
            autocomplete={autocomplete}
            collections={autocompleteState.collections}
          />
          {autocompleteState.context.preview && (
            <Preview preview={autocompleteState.context.preview} />
          )}
        </SimpleGrid>
      )}
    </div>
  );
}

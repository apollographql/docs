import Panel, {DOCS_INDEX, QUERY_SUGGESTIONS_INDEX} from './Panel';
import PropTypes from 'prop-types';
import React, {useEffect, useMemo, useState} from 'react';
import algoliasearch from 'algoliasearch/lite';
import insightsClient from 'search-insights';
import usePreviousDistinct from 'react-use/lib/usePreviousDistinct';
import {FiSearch} from 'react-icons/fi';
import {Input, InputGroup, InputLeftElement} from '@chakra-ui/react';
import {createAlgoliaInsightsPlugin} from '@algolia/autocomplete-plugin-algolia-insights';
import {createAutocomplete} from '@algolia/autocomplete-core';
import {getAlgoliaResults} from '@algolia/autocomplete-preset-algolia';

const SOURCES = {
  [DOCS_INDEX]: 'Documentation',
  blog: 'Blog',
  odyssey: 'Odyssey',
  [QUERY_SUGGESTIONS_INDEX]: "Can't find what you're looking for?"
};

const appId = process.env.ALGOLIA_APP_ID;
const apiKey = process.env.ALGOLIA_SEARCH_KEY;

const searchClient = algoliasearch(appId, apiKey);
insightsClient('init', {
  appId,
  apiKey,
  useCookie: true
});

function getEventName(index) {
  switch (index) {
    case QUERY_SUGGESTIONS_INDEX:
      return 'Suggestion selected from Autocomplete';
    case DOCS_INDEX:
      return 'Article selected from docs index';
    default:
      return 'Article selected from Autocomplete';
  }
}

const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({
  insightsClient,
  onSelect({insights, insightsEvents}) {
    const events = insightsEvents.map(insightsEvent => ({
      ...insightsEvent,
      eventName: getEventName(insightsEvent.index)
    }));
    insights.clickedObjectIDsAfterSearch(...events);
  }
});

export default function Autocomplete({onClose, optionalFilters}) {
  const [autocompleteState, setAutocompleteState] = useState({});
  const previousActiveItemId = usePreviousDistinct(
    autocompleteState.activeItemId
  );

  useEffect(() => {
    if (
      !isNaN(previousActiveItemId) &&
      autocompleteState.activeItemId === null
    ) {
      onClose();
    }
  }, [autocompleteState, previousActiveItemId, onClose]);

  const autocomplete = useMemo(
    () =>
      createAutocomplete({
        debug: true,
        defaultActiveItemId: 0,
        openOnFocus: true,
        autoFocus: true,
        plugins: [algoliaInsightsPlugin],
        onStateChange: ({state}) => setAutocompleteState(state),
        getSources: () =>
          Object.keys(SOURCES).map((indexName, index) => ({
            sourceId: indexName,
            getItemUrl: ({item}) => item.url,
            getItemInputValue: ({item}) => item.query,
            getItems: ({query}) =>
              getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName,
                    query,
                    params: {
                      optionalFilters,
                      clickAnalytics: true,
                      hitsPerPage: !index
                        ? 8
                        : indexName === QUERY_SUGGESTIONS_INDEX
                        ? 4
                        : 2,
                      highlightPreTag: '<mark>',
                      highlightPostTag: '</mark>'
                    }
                  }
                ]
              }),
            onActive: ({item, setContext}) => {
              if (item.__autocomplete_indexName !== QUERY_SUGGESTIONS_INDEX) {
                setContext({preview: item});
              }
            }
          }))
      }),
    [optionalFilters]
  );

  return (
    <div {...autocomplete.getRootProps({})}>
      <InputGroup
        size="lg"
        borderBottomWidth={autocompleteState.isOpen && '1px'}
      >
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
        <Panel
          sources={SOURCES}
          autocomplete={autocomplete}
          autocompleteState={autocompleteState}
        />
      )}
    </div>
  );
}

Autocomplete.propTypes = {
  onClose: PropTypes.func.isRequired,
  optionalFilters: PropTypes.array
};

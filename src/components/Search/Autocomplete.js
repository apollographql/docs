import Panel, {
  APOLLOPEDIA_INDEX,
  DOCS_INDEX,
  QUERY_SUGGESTIONS_INDEX
} from './Panel';
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
  [APOLLOPEDIA_INDEX]: 'Apollopedia',
  blog: 'Blog',
  odyssey: 'Odyssey',
  [QUERY_SUGGESTIONS_INDEX]: "Can't find what you're looking for?"
};

const appId = process.env.ALGOLIA_APP_ID;
const apiKey = process.env.GATSBY_ALGOLIA_RANKING_INFO_KEY;

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
    case APOLLOPEDIA_INDEX:
      return 'Apollopedia term selected from Apollopedia index';
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

function updateURL(query) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('search', query);

  // Update the browser URL
  window.history.replaceState(
    {},
    '',
    `${window.location.pathname}?${urlParams.toString()}`
  );
}

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
        initialState: {
          // This uses the `search` query parameter as the initial query
          query: new URL(window.location).searchParams.get('search')
        },
        onStateChange: ({state}) => {
          setAutocompleteState(state);
          if (state.query?.length > 0) updateURL(state.query);
        },
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
                        : indexName === APOLLOPEDIA_INDEX
                        ? 10
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
          bg="bg"
          roundedBottom={autocompleteState.isOpen ? 'none' : undefined}
          {...autocomplete.getInputProps({
            type: null,
            placeholder: 'Search Apollo'
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

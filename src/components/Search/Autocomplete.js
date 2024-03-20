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
import {Input, InputGroup, InputLeftElement} from '@chakra-ui/react';
import {SearchIcon} from '../Icons';
import {createAlgoliaInsightsPlugin} from '@algolia/autocomplete-plugin-algolia-insights';
import {createAutocomplete} from '@algolia/autocomplete-core';
import {getAlgoliaResults} from '@algolia/autocomplete-preset-algolia';

const SOURCES = {
  [APOLLOPEDIA_INDEX]: 'Glossary',
  [DOCS_INDEX]: 'Documentation',
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

function getHitsPerPage(indexName, queryLength) {
  switch (indexName) {
    case QUERY_SUGGESTIONS_INDEX:
      return 4;
    case APOLLOPEDIA_INDEX:
      if (queryLength > 0) return 2;
      else return 0;
    default:
      return 2;
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
          Object.keys(SOURCES).map(indexName => ({
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
                      filters:
                        indexName === 'apollopedia' ? 'internalOnly:false' : '',
                      clickAnalytics: true,
                      hitsPerPage: getHitsPerPage(indexName, query.length),
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
          <SearchIcon />
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

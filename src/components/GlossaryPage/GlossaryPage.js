import LabelsList from './LabelsList';
import React, {useEffect, useState} from 'react';
import Results from './Results';
import Search from './Search';
import {Box, Flex, Text} from '@chakra-ui/react';
import {PrimaryLink} from '../RelativeLink';

import algoliasearch from 'algoliasearch/lite';
import {Configure, InstantSearch, useInstantSearch} from 'react-instantsearch';

const appId = process.env.ALGOLIA_APP_ID;
const apiKey = process.env.GATSBY_ALGOLIA_EXTERNAL_APOLLOPEDIA_SEARCH_KEY;
const algoliaIndexName = 'apollopedia';

const searchClient = algoliasearch(appId, apiKey);

const scrollToHash = hash => {
  const headingElement = document.getElementById(hash);
  if (headingElement) {
    headingElement.scrollIntoView({behavior: 'smooth'});
  }
};

const onStateChange = ({uiState, setUiState}) => {
  setUiState(uiState);
  let hash;
  if (typeof window !== 'undefined') {
    hash = window.location.hash.substring(1);
  }
  if (hash && uiState.apollopedia.refinementList === undefined)
    scrollToHash(hash);
};

function NoResultsBoundary({children, fallback}) {
  const {results} = useInstantSearch();

  // The `__isArtificial` flag makes sure not to display the No Results message
  // when no hits have been returned.
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return children;
}

function NoResults() {
  return (
    <Box m="2em" textAlign="center">
      <Text>
        Looks like the glossary doesn&apos;t have the term you&apos;re looking
        for. 🤔
      </Text>
      <br />
      <Text>
        Please submit a{' '}
        <PrimaryLink href="https://forms.gle/qoTHxX9ut9bTYdQD6">
          glossary request
        </PrimaryLink>
        .
      </Text>
    </Box>
  );
}

export function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const index = searchClient.initIndex(algoliaIndexName);
      const {hits} = await index.search(searchTerm, {hitsPerPage: 150});
      return hits;
    };

    const fetchDataAndScroll = async () => {
      const hits = await fetchData();
      const hitHashes = hits.map(hit =>
        hit.term.replace(/\s+/g, '-').toLowerCase()
      );
      let hash;
      if (typeof window !== 'undefined') {
        hash = window.location.hash.substring(1);
      }
      if (hash && hitHashes.includes(hash)) {
        scrollToHash(hash);
      }
    };

    fetchDataAndScroll();
  }, [searchTerm]);

  return (
    <Box>
      <InstantSearch
        searchClient={searchClient}
        indexName={algoliaIndexName}
        onStateChange={onStateChange}
      >
        <Configure hitsPerPage={150} />
        <Flex justify="flex-start" p="4" maxW="full">
          {/* First column */}
          <Flex flexDirection="column" mr="6" flex="3">
            <Box pb="4">
              <Search />
            </Box>
            <NoResultsBoundary fallback={<NoResults />}>
              <Results />
            </NoResultsBoundary>
          </Flex>
          {/* Second column */}
          <Flex flexDirection="column" flex="1">
            <LabelsList />
          </Flex>
        </Flex>
      </InstantSearch>
    </Box>
  );
}

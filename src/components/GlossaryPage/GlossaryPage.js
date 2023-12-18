import LabelsList from './LabelsList';
import React, {useEffect, useState} from 'react';
import Results from './Results';
import Search from './Search';
import {Box, Flex, Grid, GridItem, Text} from '@chakra-ui/react';
import {ClearFilters} from './ClearFilters';
import {PrimaryLink} from '../RelativeLink';

import algoliasearch from 'algoliasearch/lite';
import {Configure, InstantSearch, useInstantSearch} from 'react-instantsearch';

const appId = process.env.ALGOLIA_APP_ID;
const apiKey = 'a6299c4459c18bfb42e0f8e723bcd96a';
// const apiKey = process.env.ALGOLIA_EXTERNAL_APOLLOPEDIA_SEARCH_KEY;
const algoliaIndexName = 'apollopedia';

console.log(apiKey);

const searchClient = algoliasearch(appId, apiKey);

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
    // Fetch data from Algolia index based on the search term
    // and update the component state with the search results.

    const fetchData = async () => {
      const index = searchClient.initIndex(algoliaIndexName);

      const {hits} = await index.search(searchTerm);
      console.log(hits);
    };

    fetchData();
  }, [searchTerm]);

  if (typeof window !== 'undefined') {
    // Check if there is an anchor in the URL and scroll to it
    const fragment = window.location.hash.substring(1);
    if (fragment) {
      const headingElement = document.getElementById(fragment);
      if (headingElement) {
        headingElement.scrollIntoView({behavior: 'smooth'});
      }
    }
  }

  return (
    <Box>
      <InstantSearch searchClient={searchClient} indexName={algoliaIndexName}>
        <Configure hitsPerPage={150} />
        <Flex justify="flex-start" p="4" maxW="full">
          <Grid templateColumns="3fr 1fr" gap="6" width="100%">
            <GridItem>
              <Search />
            </GridItem>
            <GridItem>
              <ClearFilters />
            </GridItem>
            <GridItem>
              <NoResultsBoundary fallback={<NoResults />}>
                <Results />
              </NoResultsBoundary>
            </GridItem>
            <GridItem>
              <LabelsList />
            </GridItem>
          </Grid>
        </Flex>
      </InstantSearch>
    </Box>
  );
}

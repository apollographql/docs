import LabelsFilter from './LabelsFilter';
import React, {useEffect, useState} from 'react';
import Results from './Results';
import Search from './Search';
import {Box, Flex, Grid, GridItem} from '@chakra-ui/react';

import algoliasearch from 'algoliasearch/lite';
import {Configure, InstantSearch} from 'react-instantsearch';

const appId = process.env.ALGOLIA_APP_ID;
const apiKey = process.env.ALGOLIA_EXTERNAL_APOLLOPEDIA_SEARCH_KEY;
const algoliaIndexName = 'apollopedia';

const searchClient = algoliasearch(appId, apiKey);

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

  return (
    <Box>
      <InstantSearch searchClient={searchClient} indexName={algoliaIndexName}>
        <Configure hitsPerPage={150} />
        <Search />
        <Flex justify="center" p="4">
          <Grid templateColumns="3fr 1fr" gap="6">
            <GridItem>
              <Results />
            </GridItem>
            <GridItem>
              <LabelsFilter />
            </GridItem>
          </Grid>
        </Flex>
      </InstantSearch>
    </Box>
  );
}

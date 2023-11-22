import React, {useEffect, useState} from 'react';
import Results from './Results';
import Search from './Search';
import algoliasearch from 'algoliasearch/lite';
import {InstantSearch} from 'react-instantsearch';

const appId = process.env.ALGOLIA_APP_ID;
const apiKey = process.env.ALGOLIA_SEARCH_KEY;
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
    <div>
      <InstantSearch searchClient={searchClient} indexName={algoliaIndexName}>
        <Search />
        <Results />
      </InstantSearch>
    </div>
  );
}

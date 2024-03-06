import LabelsList from './LabelsList';
import React, {useEffect, useState} from 'react';
import Results from './Results';
import Search from './Search';
import {Box, Flex, Text} from '@chakra-ui/react';
import {Note} from '../Note';
import {PrimaryLink} from '../RelativeLink';
import {useUser} from '../../utils';

import algoliasearch from 'algoliasearch/lite';
import {Configure, InstantSearch, useInstantSearch} from 'react-instantsearch';

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

function HashScroll() {
  const {status, results} = useInstantSearch();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (
      status === 'idle' &&
      results.hits.length > 0 &&
      !hasScrolled &&
      typeof window !== 'undefined' &&
      window.location.hash
    ) {
      document.querySelector(window.location.hash)?.scrollIntoView();
      setHasScrolled(true);
    }
  }, [status, results, hasScrolled]);
  return null;
}

export function GlossaryPage() {
  const {isInternal} = useUser();

  const appId = process.env.ALGOLIA_APP_ID;
  const apiKey = isInternal
    ? process.env.ALGOLIA_SEARCH_KEY
    : process.env.GATSBY_ALGOLIA_EXTERNAL_APOLLOPEDIA_SEARCH_KEY;

  const attributesToRetrieve = isInternal
    ? ['*']
    : [
        '*',
        '-internalOnly',
        '-usageInstructions',
        '-exampleUsage',
        '-businessContext'
      ];
  const algoliaIndexName = 'apollopedia';

  const searchClient = algoliasearch(appId, apiKey);
  return (
    <>
      {isInternal && (
        <Note>
          The 🔒 in front of a term denotes it&apos;s only visible to logged in
          Apollonauts. The same applies for the{' '}
          <strong>Internal information 🔒</strong>.
        </Note>
      )}
      <Box>
        <InstantSearch searchClient={searchClient} indexName={algoliaIndexName}>
          <HashScroll />
          <Configure
            hitsPerPage={150}
            attributesToRetrieve={attributesToRetrieve}
          />
          <Flex justify="flex-start" p="4" maxW="full">
            <Flex flexDirection="column" mr="6" flex="3">
              <Box pb="4">
                <Search />
              </Box>
              <NoResultsBoundary fallback={<NoResults />}>
                <Results />
              </NoResultsBoundary>
            </Flex>
            <Flex flexDirection="column" flex="1">
              <LabelsList />
            </Flex>
          </Flex>
        </InstantSearch>
      </Box>
    </>
  );
}

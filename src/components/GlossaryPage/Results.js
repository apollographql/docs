import InlineCode from '../InlineCode';
import Markdown from 'react-markdown';
import React from 'react';
import {Box, Button, Text} from '@chakra-ui/react';
import {CustomHeading} from '../CustomHeading';
import {PrimaryLink} from '../RelativeLink';
import {useHits} from 'react-instantsearch';

const Results = () => {
  const {hits, hasMore, refineNext} = useHits();

  const handleLoadMore = () => {
    refineNext();
  };

  return (
    <Box mt="6">
      {hits.map(hit => (
        <Box
          key={hit.objectID}
          borderBottom="1px"
          borderColor="gray.200"
          mb="4"
          pb="4"
        >
          <CustomHeading as="h4" fontSize="lg" fontWeight="bold">
            {hit.term}
          </CustomHeading>
          <Markdown
            components={{
              p: Text,
              a: PrimaryLink,
              code: ({children}) => <InlineCode>{children}</InlineCode>
            }}
          >
            {hit.shortDefinition}
          </Markdown>
          {/* Add additional content based on your hit structure */}
        </Box>
      ))}
      {hasMore && (
        <Button onClick={handleLoadMore} mt="4" size="sm">
          Load More
        </Button>
      )}
    </Box>
  );
};

export default Results;

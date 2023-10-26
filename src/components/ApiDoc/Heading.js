import PropTypes from 'prop-types';
import React from 'react';
import {Box, Heading} from '@chakra-ui/react';
import {PrimaryLink} from '../RelativeLink';
import {useApiDocContext} from './Context';

export function ApiDocHeading({canonicalReference, headingLevel}) {
  const item = useApiDocContext(canonicalReference);
  return (
    <Box pt="4">
      <Heading
        as={`h${headingLevel}`}
        size="xl"
        fontFamily="mono"
        title={item.displayName}
        id={item.displayName}
      >
        <PrimaryLink href={`#${item.displayName}`}>
          {item.displayName}
        </PrimaryLink>
      </Heading>
      {item.file && (
        <Heading as="h6" fontWeight="normal" size="sm" mt="2">
          <PrimaryLink
            href={`https://github.com/apollographql/apollo-client/blob/main/${item.file}`}
            isExternal
          >
            ({item.file})
          </PrimaryLink>
        </Heading>
      )}
    </Box>
  );
}
ApiDocHeading.propTypes = {
  canonicalReference: PropTypes.string.isRequired,
  headingLevel: PropTypes.number.isRequired
};

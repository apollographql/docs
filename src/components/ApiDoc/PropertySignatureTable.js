import InlineCode from '../InlineCode';
import PropTypes from 'prop-types';
import React from 'react';
import {DocBlock, FunctionSignature, useApiDocContext} from '.';
import {GridItem, Text, chakra} from '@chakra-ui/react';
import {ResponsiveGrid} from './ResponsiveGrid';

export function PropertySignatureTable({
  canonicalReference,
  prefix = '',
  showHeaders = true,
  display = 'parent'
}) {
  const getItem = useApiDocContext();
  const item = getItem(canonicalReference);
  const Wrapper = display === 'parent' ? ResponsiveGrid : React.Fragment;
  return (
    <>
      {showHeaders ? (
        <GridItem className="row">
          <chakra.h6
            className="fullWidth"
            mb="4"
            fontWeight="bold"
            textTransform="uppercase"
            fontSize="sm"
            letterSpacing="wider"
          >
            Properties
          </chakra.h6>
        </GridItem>
      ) : null}
      {item.childrenIncomplete ? (
        <GridItem className="row">
          <br />
          (Warning: some properties might be missing from the table due to
          complex inheritance!)
        </GridItem>
      ) : null}

      <Wrapper>
        {showHeaders ? (
          <>
            <GridItem className="first cell heading">Name / Type</GridItem>
            <GridItem className="cell heading">Description</GridItem>
          </>
        ) : null}

        {item.properties.map(getItem).map(property => (
          <React.Fragment key={property.id}>
            <GridItem
              className="first cell"
              fontSize="md"
              sx={{code: {bg: 'none', p: 0}}}
            >
              <chakra.h6 fontSize="lg" mb="1" mr="1">
                <InlineCode>
                  <Text color="gray.400" as="span">
                    {prefix}
                  </Text>
                  {property.displayName}
                </InlineCode>
                {property.optional ? <em> (optional)</em> : null}
              </chakra.h6>
              <InlineCode color="tertiary">
                {property.kind === 'MethodSignature' ? (
                  <FunctionSignature
                    canonicalReference={property.canonicalReference}
                    name={false}
                    parameterTypes
                    arrow
                  />
                ) : (
                  property.type
                )}
              </InlineCode>
            </GridItem>
            <GridItem className="cell" fontSize="md" lineHeight="base">
              <DocBlock canonicalReference={property.canonicalReference} />
            </GridItem>
          </React.Fragment>
        ))}
      </Wrapper>
    </>
  );
}

PropertySignatureTable.propTypes = {
  canonicalReference: PropTypes.string.isRequired,
  prefix: PropTypes.string,
  showHeaders: PropTypes.bool,
  display: PropTypes.oneOf(['parent', 'child'])
};

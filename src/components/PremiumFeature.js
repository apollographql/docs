import PropTypes from 'prop-types';
import React from 'react';
import {Box, Center, Flex, Text, chakra} from '@chakra-ui/react';
import RelativeLink from './RelativeLink';
import {EnterpriseIcon} from './Icons';

export const PremiumFeature = ({children}) => {
  return (
    <Box
      pl="2"
      py="1"
      borderLeftWidth="2px"
      borderColor="primary"
      fontSize="lg"
      sx={{
        '>': {
          ':not(:last-child)': {
            mb: 2
          }
        }
      }}
    >
      <Flex as="span">
        <chakra.span pl="10px" pr="10px">
          <Center h="100%">
            <EnterpriseIcon />
          </Center>
        </chakra.span>

        {children ? (
          <Text pl="1">{children}</Text>
        ) : (
          <Text pl="1">
              <strong>This feature is only available with a GraphOS Dedicated or Enterprise plan.</strong>
              <br/>To compare GraphOS feature support across all plan types, see the{' '}
            <RelativeLink
              color={'tertiary'}
              href="https://www.apollographql.com/pricing/"
            >
              pricing page
            </RelativeLink>
            .
          </Text>
        )}
      </Flex>
    </Box>
  );
};

PremiumFeature.propTypes = {
  children: PropTypes.node
};

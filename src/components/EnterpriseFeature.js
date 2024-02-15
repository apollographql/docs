import PropTypes from 'prop-types';
import React from 'react';
import {Box, Center, Flex, Text, chakra} from '@chakra-ui/react';
import RelativeLink from './RelativeLink';
import {EnterpriseIcon} from './Icons';

export const EnterpriseFeature = ({linkWithAnchor, children}) => {
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
            <strong>
              This feature is only available with a{' '}
              <RelativeLink color={'tertiary'} href={linkWithAnchor ? linkWithAnchor : "https://www.apollographql.com/pricing/"}>
                GraphOS Enterprise plan
              </RelativeLink>
              .{' '}
            </strong>
            You can test it out by signing up for a free{' '}
            <RelativeLink
              color={'tertiary'}
              href="https://studio.apollographql.com/signup?type=enterprise-trial&referrer=docs-content"
            >
              Enterprise trial
            </RelativeLink>
            .
          </Text>
        )}
      </Flex>
    </Box>
  );
};

EnterpriseFeature.propTypes = {
  children: PropTypes.node,
  linkWithAnchor: PropTypes.string
};

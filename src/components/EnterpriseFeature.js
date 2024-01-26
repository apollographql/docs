import PropTypes from 'prop-types';
import React from 'react';
import {Box, Center, Flex, Link, Text, chakra} from '@chakra-ui/react';
import {EnterpriseIcon} from './Icons'

export const EnterpriseFeature = ({children}) => {
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
            <EnterpriseFeature />
          </Center>
        </chakra.span>

        {children ? (
          <Text pl="1">{children}</Text>
        ) : (
          <Text pl="1">
            <strong>
              This feature is only available with a{' '}
              <Link color={'primary'} href="/graphos/enterprise/">
                GraphOS Enterprise plan
              </Link>
              .{' '}
            </strong>
            If your organization doesn&apos;t currently have an Enterprise plan,
            you can test this functionality by signing up for a free{' '}
            <Link
              color={'primary'}
              href="https://studio.apollographql.com/signup?type=enterprise-trial&referrer=docs-content"
            >
              Enterprise trial
            </Link>
            .
          </Text>
        )}
      </Flex>
    </Box>
  );
};

EnterpriseFeature.propTypes = {
  children: PropTypes.node
};

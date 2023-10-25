import PropTypes from 'prop-types';
import React from 'react';
import {Box, Center, Flex, Link, Text, chakra} from '@chakra-ui/react';
import {IoFlaskOutline} from 'react-icons/io5';

export const ExperimentalFeature = ({
  discordLink = 'https://discord.gg/yFZJH2QYrK'
}) => {
  return (
    <Box
      pl="2"
      py="1"
      borderLeftWidth="2px"
      borderColor="primary"
      fontSize="md"
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
            <IoFlaskOutline />
          </Center>
        </chakra.span>
        <Text pl="1">
          <b>
            This feature is currently{' '}
            <Link
              color={'primary'}
              href="https://www.apollographql.com/docs/resources/product-launch-stages#experimental-features"
            >
              experimental
            </Link>
            .
          </b>{' '}
          Your questions and feedback are highly valued{'—'}don&apos;t hesitate
          to get in touch with your Apollo contact or on the official
          <Link color={'primary'} href={discordLink}>
            {' '}
            Apollo GraphQL Discord
          </Link>
          .
        </Text>
      </Flex>
    </Box>
  );
};

ExperimentalFeature.propTypes = {
  discordLink: PropTypes.node.isRequired
};

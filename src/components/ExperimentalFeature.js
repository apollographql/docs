import PropTypes from 'prop-types';
import React from 'react';
import {Box, Center, Flex, Link, Text, chakra} from '@chakra-ui/react';
import {IoFlaskOutline} from 'react-icons/io5';

import {MarkdownInAdmonitions} from './MarkdownInAdmonitions';

export const ExperimentalFeature = ({
  discordLink = 'https://discord.gg/yFZJH2QYrK',
  appendText = '',
  children
}) => {
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
            <IoFlaskOutline />
          </Center>
        </chakra.span>
        <Text pl="1">
          {children ? (
            children
          ) : (
            <>
              <b>
                This feature is{' '}
                <Link
                  color={'tertiary'}
                  href="https://www.apollographql.com/docs/resources/product-launch-stages#experimental-features"
                >
                  experimental
                </Link>
                .
              </b>{' '}
              Your questions and feedback are highly valued{'—'}don&apos;t
              hesitate to get in touch with your Apollo contact or on the
              official
              <Link color={'tertiary'} href={discordLink}>
                {' '}
                Apollo GraphQL Discord
              </Link>
              .{' '}
              {appendText.length > 0 && (
                <MarkdownInAdmonitions>{appendText}</MarkdownInAdmonitions>
              )}
            </>
          )}
        </Text>
      </Flex>
    </Box>
  );
};

ExperimentalFeature.propTypes = {
  discordLink: PropTypes.string,
  appendText: PropTypes.node,
  children: PropTypes.node
};

import PropTypes from 'prop-types';
import React from 'react';
import RelativeLink from './RelativeLink';
import {Box, Center, Flex, Text, chakra} from '@chakra-ui/react';
import {PreviewIcon} from './Icons';

import {MarkdownInAdmonitions} from './MarkdownInAdmonitions';

export const PreviewFeature = ({
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
            <PreviewIcon />
          </Center>
        </chakra.span>
        <Text pl="1">
          {children ? (
            children
          ) : (
            <>
              <b>
                This feature is in{' '}
                <RelativeLink
                  color={'tertiary'}
                  href="https://www.apollographql.com/docs/resources/product-launch-stages#preview"
                >
                  preview
                </RelativeLink>
                .
              </b>{' '}
              Your questions and feedback are highly valued{'—'}don&apos;t
              hesitate to get in touch with your Apollo contact or on the
              official
              <RelativeLink color={'tertiary'} href={discordLink}>
                {' '}
                Apollo GraphQL Discord
              </RelativeLink>
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

PreviewFeature.propTypes = {
  discordLink: PropTypes.string,
  appendText: PropTypes.node,
  children: PropTypes.node
};

import PropTypes from 'prop-types';
import React from 'react';
import {Box, Divider, Flex, Heading} from '@chakra-ui/react';
import {DOCS_PAGE_WIDTH_VAR, usePageWidthContext} from '../PageWidthContext';
import {PAGE_PADDING_BOTTOM, PAGE_PADDING_TOP} from './PageLayout';

export function PageContent({
  title,
  subtitle,
  children,
  pagination,
  aside,
  ...props
}) {
  const {pageRefCallback} = usePageWidthContext();
  return (
    <Flex
      ref={pageRefCallback}
      maxW={`var(${DOCS_PAGE_WIDTH_VAR})`}
      mx="auto"
      align="flex-start"
      px={{base: 6, md: 10}}
      as="main"
      css={{
        paddingTop: PAGE_PADDING_TOP,
        paddingBottom: PAGE_PADDING_BOTTOM
      }}
    >
      <Box flexGrow="1" w="0">
        <Heading as="h1" size="2xl">
          {title}
        </Heading>
        {subtitle}
        <Divider my="8" />
        <Box fontSize={{md: 'lg'}} lineHeight={{md: 1.7}} {...props}>
          {children}
        </Box>
        {pagination}
      </Box>
      {aside}
    </Flex>
  );
}

PageContent.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.node,
  pagination: PropTypes.element,
  aside: PropTypes.element
};

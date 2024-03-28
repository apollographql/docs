import Highlight from './Highlight';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import ResultIcon from './ResultIcon';
import searchByAlgoliaDark from '../../assets/logos/search-by-algolia-dark.svg';
import searchByAlgoliaLight from '../../assets/logos/search-by-algolia-light.svg';
import upperFirst from 'lodash/upperFirst';
import {
  Box,
  Flex,
  HStack,
  Heading,
  Img,
  Link,
  Tag,
  TagLabel,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import {ChevronRightIcon} from '../Icons';

const DOCSET_TITLES = {
  'apollo-client': 'React',
  'apollo-ios-dev': 'iOS',
  'apollo-kotlin': 'Kotlin',
  'apollo-server': 'Server',
  'graphos(/[a-z-]+)?': 'GraphOS'
};

function getDocsetTitle(docset) {
  for (const pattern in DOCSET_TITLES) {
    if (new RegExp(`^${pattern}$`).test(docset)) {
      return DOCSET_TITLES[pattern];
    }
  }
  return upperFirst(docset);
}

export default function Preview({preview}) {
  const {
    url,
    type,
    docset,
    categories,
    sectionTitle,
    ancestors = [],
    _snippetResult,
    _highlightResult
  } = preview;

  const allAncestors = sectionTitle
    ? [...ancestors, {url, title: sectionTitle}]
    : ancestors;

  const searchByAlgolia = useColorModeValue(
    searchByAlgoliaLight,
    searchByAlgoliaDark
  );

  return (
    <Flex borderLeftWidth="1px" direction="column" pos="relative">
      <Flex align="center" p="2">
        <Heading size="sm">Content preview</Heading>
        <Box borderBottomWidth="1px" flexGrow="1" ml="2" />
      </Flex>
      <Box px="5">
        <Flex my="5">
          <Box fontSize="2xl" color="primary">
            <ResultIcon result={preview} />
          </Box>
          <Heading ml="2" size="md">
            {!docset
              ? !type
                ? 'Glossary'
                : upperFirst(type)
              : docset === 'technotes'
              ? 'Tech notes'
              : `${getDocsetTitle(docset)} docs`}
          </Heading>
        </Flex>
        <Text fontSize="lg" fontWeight="medium" mb="2">
          <Link href={url}>
            <Highlight
              value={
                _highlightResult.title
                  ? _highlightResult.title.value
                  : _highlightResult.term.value
              }
            />
          </Link>
        </Text>
        {allAncestors.length > 0 && (
          <HStack
            as="nav"
            aria-label="Breadcrumb"
            mb="2"
            pr="2"
            rounded="sm"
            spacing="1"
            wrap="wrap"
          >
            {allAncestors.map((ancestor, index) => (
              <Fragment key={index}>
                {index > 0 && <Box as={ChevronRightIcon} flexShrink="0" />}
                <Text fontSize="md" fontWeight="medium">
                  <Link isTruncated href={ancestor.url} title={ancestor.title}>
                    {ancestor.title === sectionTitle &&
                    _highlightResult.sectionTitle ? (
                      <Highlight value={_highlightResult.sectionTitle.value} />
                    ) : (
                      ancestor.title
                    )}
                  </Link>
                </Text>
              </Fragment>
            ))}
          </HStack>
        )}
        {_snippetResult?.text && (
          <Text>
            <Highlight value={_snippetResult.text.value} />
          </Text>
        )}
        {categories && (
          <Flex mt="4" flexWrap="wrap">
            {categories.map((category, index) => (
              <Tag
                variant="outline"
                colorScheme="navy"
                key={index}
                mb="2"
                mr="2"
              >
                <TagLabel>{category}</TagLabel>
              </Tag>
            ))}
          </Flex>
        )}
      </Box>
      <Img
        h="4"
        pos="absolute"
        bottom="1.5"
        right="1.5"
        src={searchByAlgolia}
      />
    </Flex>
  );
}

Preview.propTypes = {
  preview: PropTypes.object.isRequired
};

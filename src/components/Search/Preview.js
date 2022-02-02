import PropTypes from 'prop-types';
import React from 'react';
import ResultIcon from './ResultIcon';
import searchByAlgoliaDark from '../../assets/logos/search-by-algolia-dark.svg';
import searchByAlgoliaLight from '../../assets/logos/search-by-algolia-light.svg';
import upperFirst from 'lodash/upperFirst';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  HStack,
  Heading,
  Img,
  Link,
  Tag,
  Text,
  chakra,
  useColorModeValue
} from '@chakra-ui/react';
import {FiChevronRight} from 'react-icons/fi';
import {Markup} from 'interweave';
import {useAccentColor} from '../../utils';

function getDocsetTitle(docset) {
  switch (docset) {
    case 'ios':
      return 'iOS';
    case 'android':
      return 'Kotlin';
    default:
      return upperFirst(docset);
  }
}

export default function Preview({preview}) {
  const {
    url,
    type,
    title,
    docset,
    categories,
    sectionTitle,
    ancestors = [],
    _snippetResult
  } = preview;

  const allAncestors = sectionTitle
    ? [...ancestors, {url, title: sectionTitle}]
    : ancestors;

  const iconColor = useAccentColor();
  const breadcrumbBg = useColorModeValue('gray.100', 'gray.800');
  const searchByAlgolia = useColorModeValue(
    searchByAlgoliaLight,
    searchByAlgoliaDark
  );

  return (
    <Flex
      direction="column"
      align="center"
      textAlign="center"
      py="10"
      px="5"
      pos="relative"
    >
      <Flex mb="5" align="center">
        <Box fontSize="2xl" color={iconColor}>
          <ResultIcon result={preview} />
        </Box>
        <chakra.span ml="2">
          {docset ? `${getDocsetTitle(docset)} docs` : upperFirst(type)}
        </chakra.span>
      </Flex>
      <Heading size="lg" mb="2">
        <Link href={url}>{title}</Link>
      </Heading>
      {allAncestors.length > 0 && (
        <Breadcrumb
          mb="2"
          px="2"
          rounded="sm"
          fontSize="sm"
          bg={breadcrumbBg}
          spacing="1"
          separator={<FiChevronRight />}
        >
          {allAncestors.map((ancestor, index) => (
            <BreadcrumbItem key={index}>
              <BreadcrumbLink href={ancestor.url}>
                {ancestor.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      )}
      {_snippetResult?.text && (
        <Text>
          <Markup content={_snippetResult.text.value} />
        </Text>
      )}
      {categories && (
        <HStack mt="4">
          {categories.map((category, index) => (
            <Tag variant="outline" colorScheme="indigo" key={index}>
              {category}
            </Tag>
          ))}
        </HStack>
      )}
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

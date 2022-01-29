import PropTypes from 'prop-types';
import React from 'react';
import searchByAlgoliaDark from '../../assets/logos/search-by-algolia-dark.svg';
import searchByAlgoliaLight from '../../assets/logos/search-by-algolia-light.svg';
import {
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
  useColorModeValue
} from '@chakra-ui/react';
import {FiChevronRight} from 'react-icons/fi';
import {Markup} from 'interweave';

export default function Preview({preview}) {
  const {
    url,
    title,
    categories,
    sectionTitle,
    ancestors = [],
    _snippetResult
  } = preview;

  const allAncestors = sectionTitle
    ? [...ancestors, {url, title: sectionTitle}]
    : ancestors;

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
      <Heading size="lg" mb="2">
        <Link href={url}>{title}</Link>
      </Heading>
      {allAncestors.length > 0 && (
        <Breadcrumb
          mb="2"
          px="2"
          rounded="sm"
          fontSize="sm"
          bg="gray.100"
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
      <Text>
        <Markup content={_snippetResult.text.value} />
      </Text>
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

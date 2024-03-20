import Highlight from './Highlight';
import PropTypes from 'prop-types';
import React from 'react';
import ResultIcon from './ResultIcon';
import {Box, Flex, chakra, useColorMode} from '@chakra-ui/react';
import {ChevronRightIcon} from '../Icons';
import {makeGlossaryTermId} from '../GlossaryPage/Results';

const stripMarkdown = text => {
  // Remove bold formatting (e.g., **bold**)
  text = text.replace(/\*\*(.*?)\*\*/g, '$1');
  // Remove italic formatting (e.g., *italic*)
  text = text.replace(/\*(.*?)\*/g, '$1');
  // Remove inline code formatting (e.g., `code`)
  text = text.replace(/`(.*?)`/g, '$1');
  // Remove links (e.g., [link text](url))
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, '$1');
  return text;
};

export default function Result({item, ...props}) {
  const {text, title, sectionTitle, description, term} = item._highlightResult;
  const definition = item.definition ? stripMarkdown(item.definition) : null;

  const {'aria-selected': isSelected} = props;

  const {colorMode} = useColorMode();
  const activeBg = colorMode === 'light' ? 'silver.400' : 'navy.400';

  let {url} = item;

  switch (item.__autocomplete_indexName) {
    case 'staging_docs':
      url = new URL(item.slug, process.env.DEPLOY_URL).toString();
      break;
    case 'apollopedia':
      url = new URL(
        `/resources/glossary#${makeGlossaryTermId(item.term)}`,
        process.env.DEPLOY_URL
      ).toString();
      break;
    default:
  }

  return (
    <chakra.li bg={isSelected && activeBg} {...props}>
      <Flex as="a" href={url} p="2">
        <Box mr="3" fontSize="xl" color="primary" flexShrink="0">
          <ResultIcon result={item} />
        </Box>
        <Box lineHeight="shorter" w="0" flexGrow="1">
          <Box fontWeight="medium">
            <Highlight value={title ? title.value : term.value} />
          </Box>
          {sectionTitle && sectionTitle.matchedWords.length > 0 && (
            <Box my="1" display="flex">
              <Box as={ChevronRightIcon} flexShrink="0" />
              <Highlight value={sectionTitle.value} />
            </Box>
          )}
          <Box
            fontSize="sm"
            color="gray.500"
            _dark={{
              color: 'gray.400'
            }}
            isTruncated
          >
            <Highlight
              value={
                text || description ? (text || description).value : definition
              }
            />
          </Box>
        </Box>
        <Box
          ml="2"
          my="auto"
          d={!isSelected && 'none'}
          color="gray.500"
          _dark={{
            color: 'gray.400'
          }}
        >
          ⏎
        </Box>
      </Flex>
    </chakra.li>
  );
}

Result.propTypes = {
  item: PropTypes.object.isRequired,
  'aria-selected': PropTypes.bool.isRequired
};

import InlineCode from '../InlineCode';
import Markdown from 'react-markdown';
import React from 'react';
import {Box, HStack, Tag, TagLabel, Text} from '@chakra-ui/react';
import {CustomHeading} from '../CustomHeading';
import {MarkdownCodeBlock} from '@apollo/chakra-helpers';
import {PrimaryLink} from '../RelativeLink';
import {useHits} from 'react-instantsearch';

const Results = () => {
  const {hits} = useHits();

  const handleLabelClick = label => {
    //To-do: Hook into search state and refine on the label
    console.log(label);
  };

  return (
    <Box mt="6">
      {hits.map(hit => (
        <Box
          key={hit.objectID}
          borderBottom="1px"
          borderColor="gray.200"
          mb="4"
          pb="4"
        >
          <CustomHeading as="h4" fontSize="lg" fontWeight="bold">
            {hit.term}
          </CustomHeading>
          <HStack mt="2">
            {hit.labels &&
              hit.labels.map(label => (
                <Tag
                  key={label}
                  size="sm"
                  variant="solid"
                  colorScheme="indigo"
                  borderRadius="md"
                  onClick={() => handleLabelClick(label)}
                >
                  <TagLabel>{label}</TagLabel>
                </Tag>
              ))}
          </HStack>
          <Markdown
            components={{
              p: Text,
              a: PrimaryLink,
              pre: MarkdownCodeBlock
            }}
          >
            {hit.definition}
          </Markdown>
        </Box>
      ))}
    </Box>
  );
};

export default Results;

import InlineCode from '../InlineCode';
import Markdown from 'react-markdown';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Box,
  HStack,
  Heading,
  Link,
  Stack,
  StackDivider,
  Tag,
  TagLabel,
  Text
} from '@chakra-ui/react';
import {Highlight, useHits} from 'react-instantsearch';
// import {LabelFilterButton} from './LabelFilterButton';
import RelativeLink, {PrimaryLink} from '../RelativeLink';
import {MarkdownCodeBlock} from '@apollo/chakra-helpers';

const ClickableHeading = ({as, fontSize, fontWeight, id, children}) => {
  const handleCopyClick = () => {
    if (id) {
      const basePath = window.location.origin + window.location.pathname;
      const headingLink = `${basePath}#${id}`;
      navigator.clipboard.writeText(headingLink);

      // Update the URL in the browser
      const newUrl = headingLink;
      window.history.pushState({path: newUrl}, '', newUrl);

      // Scroll to the heading
      const headingElement = document.getElementById(id);
      if (headingElement) {
        headingElement.scrollIntoView({behavior: 'smooth'});
      }
    }
  };

  return (
    <Heading
      as={as}
      fontSize={fontSize}
      fontWeight={fontWeight}
      id={id}
      onClick={handleCopyClick}
    >
      <Link to={`#${id}`}>{children}</Link>
    </Heading>
  );
};

ClickableHeading.propTypes = {
  as: PropTypes.string, // Component type for the heading (e.g., 'h1', 'h2', etc.)
  fontSize: PropTypes.string, // Font size of the heading
  fontWeight: PropTypes.string, // Font weight of the heading
  id: PropTypes.string.isRequired, // ID for the heading (required)
  children: PropTypes.node.isRequired // Content of the heading (React node, required)
};

const Results = () => {
  const {hits} = useHits();

  const makeId = term => term.replace(/\s+/g, '-').toLowerCase();

  return (
    <Stack divider={<StackDivider borderColor="border" />} spacing={6}>
      {hits.map(hit => (
        <Box key={hit.objectID} mt="2">
          <HStack mt="2" pb="4">
            <ClickableHeading
              as="h2"
              fontSize="xl"
              fontWeight="bold"
              id={makeId(hit.term)}
            >
              <Highlight attribute="term" hit={hit} />
            </ClickableHeading>

            {hit.labels &&
              hit.labels.map(label => (
                <Tag
                  key={label}
                  size="md"
                  variant="solid"
                  colorScheme="indigo"
                  borderRadius="md"
                >
                  <TagLabel>{label}</TagLabel>
                </Tag>
                // <LabelFilterButton key={hit.objectID + label} label={label} />
              ))}
          </HStack>
          <Markdown
            components={{
              p: Text,
              a: PrimaryLink,
              pre: MarkdownCodeBlock,
              code: InlineCode
            }}
          >
            {hit.learnMore
              ? hit.definition.concat(` [Learn more.](${hit.learnMore})`)
              : hit.definition}
          </Markdown>

          <HStack mt="2" pb="2">
            {hit.relatedTerms && (
              <Text>
                <strong>{`Related term definition${
                  hit.relatedTerms.length > 1 ? 's' : ''
                }:`}</strong>
              </Text>
            )}
            {hit.relatedTerms && (
              <>
                {hit.relatedTerms.map((term, index) => (
                  <React.Fragment key={`${hit.objectID}_${index}`}>
                    <RelativeLink href={`#${makeId(term)}`}>
                      {term}
                    </RelativeLink>
                    {index < hit.relatedTerms.length - 1 && ', '}
                  </React.Fragment>
                ))}
              </>
            )}
          </HStack>
        </Box>
      ))}
    </Stack>
  );
};

export default Results;

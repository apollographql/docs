import EditOnGitHub from './EditOnGitHub';
import InlineCode from '../InlineCode';
import Markdown from 'react-markdown';
import PropTypes from 'prop-types';
import React from 'react';
import RelativeLink, {PrimaryLink} from '../RelativeLink';
import {
  Box,
  Divider,
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
import {MarkdownCodeBlock} from '@apollo/chakra-helpers';
import {useUser} from '../../utils';

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
        headingElement.scrollIntoView();
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
  as: PropTypes.string,
  fontSize: PropTypes.string,
  fontWeight: PropTypes.string,
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

const Results = () => {
  const {hits} = useHits();
  const makeId = term => term.replace(/\s+/g, '-').toLowerCase();
  const {user} = useUser();
  const isApollonaut = user?.name.includes('@apollographql.com');

  return (
    <Stack divider={<StackDivider borderColor="border" />} spacing={6}>
      {hits.map(hit => (
        <Box key={hit.objectID} mt="2">
          <HStack mt="2" pb="4">
            <ClickableHeading
              as="h2"
              fontSize="2xl"
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
                  colorScheme="indigo"
                  variant="outline"
                  borderRadius="md"
                >
                  <TagLabel>{label}</TagLabel>
                </Tag>
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
            {hit.definition}
          </Markdown>
          {hit.learnMore && (
            <Text my="4">
              <PrimaryLink href={hit.learnMore}>Learn more. ➜</PrimaryLink>
            </Text>
          )}
          <HStack my="2" pb="2">
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
          {isApollonaut &&
            (hit.usageInstructions ||
              hit.businessContext ||
              hit.exampleUsage) && (
              <Box
                pl="4"
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
                <Heading as="h4" fontSize="xl" fontWeight="bold" pb="2">
                  Internal information
                </Heading>
                {isApollonaut && hit.businessContext && (
                  <>
                    <Text>
                      <strong>Business context</strong>
                    </Text>
                    <Text>{hit.businessContext}</Text>
                  </>
                )}
                {isApollonaut && hit.usageInstructions && (
                  <>
                    <Text>
                      <strong>Usage instructions</strong>
                    </Text>
                    <Box>
                      <Markdown
                        components={{
                          p: Text,
                          a: PrimaryLink,
                          pre: MarkdownCodeBlock,
                          code: InlineCode
                        }}
                      >
                        {hit.usageInstructions}
                      </Markdown>
                    </Box>
                  </>
                )}
                {isApollonaut && hit.exampleUsage && (
                  <>
                    <Text>
                      <strong>Example usage</strong>
                    </Text>
                    <Box>
                      <Markdown
                        components={{
                          p: Text,
                          a: PrimaryLink,
                          pre: MarkdownCodeBlock,
                          code: InlineCode
                        }}
                      >
                        {`_${hit.exampleUsage}_`}
                      </Markdown>
                    </Box>
                  </>
                )}
              </Box>
            )}

          {isApollonaut && (
            <Box pt="4" textAlign="right">
              <EditOnGitHub term={hit.objectID} />
            </Box>
          )}
        </Box>
      ))}
    </Stack>
  );
};

export default Results;

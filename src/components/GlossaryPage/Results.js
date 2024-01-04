import EditOnGitHub from './EditOnGitHub';
import InlineCode from '../InlineCode';
import Markdown from 'react-markdown';
import PropTypes from 'prop-types';
import React from 'react';
import RelativeLink, {PrimaryLink} from '../RelativeLink';
import {
  Box,
  Flex,
  HStack,
  Heading,
  Link,
  Stack,
  StackDivider,
  Tag,
  TagLabel,
  Text
} from '@chakra-ui/react';
import {FiArrowRight} from 'react-icons/fi';
import {Highlight, useHits} from 'react-instantsearch';
import {MarkdownCodeBlock} from '@apollo/chakra-helpers';
import {useUser} from '../../utils';

const PaddedMarkdownCodeBlock = ({children}) => {
  return (
    <Box py="4">
      <MarkdownCodeBlock>{children}</MarkdownCodeBlock>
    </Box>
  );
};

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
    <Stack divider={<StackDivider borderColor="border" />} spacing={1}>
      {hits.map(hit => (
        <Box key={hit.objectID} mt="6">
          <HStack mt="2" pb="4">
            <ClickableHeading
              as="h2"
              fontSize="2xl"
              fontWeight="bold"
              id={makeId(hit.term)}
            >
              {hit.internalOnly && <span>🔒 </span>}
              <Highlight attribute="term" hit={hit} />
            </ClickableHeading>
            {hit.labels &&
              hit.labels.map(label => (
                <Tag
                  key={label}
                  size="md"
                  colorScheme="indigo"
                  _dark={{
                    color: 'indigo.100'
                  }}
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
              pre: PaddedMarkdownCodeBlock,
              code: InlineCode
            }}
          >
            {hit.definition}
          </Markdown>
          {Boolean(hit.relatedTerms?.length) && (
            <Box py="2">
              <HStack>
                <Text>
                  <strong>{`Related term definition${
                    hit.relatedTerms.length !== 1 ? 's' : ''
                  }:`}</strong>
                </Text>
                {hit.relatedTerms.map((term, index) => (
                  <React.Fragment key={`${hit.objectID}_${index}`}>
                    <RelativeLink href={`#${makeId(term)}`}>
                      {term}
                    </RelativeLink>
                    {index < hit.relatedTerms.length - 1 && ', '}
                  </React.Fragment>
                ))}
              </HStack>
            </Box>
          )}
          {isApollonaut &&
            (hit.usageInstructions ||
              hit.businessContext ||
              hit.exampleUsage) && (
              <Box
                pl="4"
                py="1"
                my="4"
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
                  Internal information 🔒
                </Heading>
                {hit.businessContext && (
                  <>
                    <Text>
                      <strong>Business context</strong>
                    </Text>
                    <Text>{hit.businessContext}</Text>
                  </>
                )}
                {hit.usageInstructions && (
                  <>
                    <Text>
                      <strong>Usage instructions</strong>
                    </Text>
                    <Box pb="4">
                      <Markdown
                        components={{
                          p: Text,
                          a: PrimaryLink,
                          code: InlineCode
                        }}
                      >
                        {hit.usageInstructions}
                      </Markdown>
                    </Box>
                  </>
                )}
                {hit.exampleUsage && (
                  <>
                    <Text>
                      <strong>Example usage</strong>
                    </Text>
                    <Box>
                      <Markdown
                        components={{
                          p: Text,
                          a: PrimaryLink,
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
          {hit.learnMore ? (
            <Flex gap={10}>
              <PrimaryLink
                my="4"
                as="a"
                href={hit.learnMore}
                style={{display: 'flex', alignItems: 'center'}}
              >
                {hit.learnMoreText
                  ? hit.learnMoreText
                  : 'Learn more about this term'}
                <FiArrowRight style={{marginLeft: '0.5rem'}} />
              </PrimaryLink>
              {isApollonaut && <EditOnGitHub term={hit.objectID} />}
            </Flex>
          ) : (
            <Box>{isApollonaut && <EditOnGitHub term={hit.objectID} />}</Box>
          )}
        </Box>
      ))}
    </Stack>
  );
};

export default Results;

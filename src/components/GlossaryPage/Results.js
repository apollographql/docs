import CustomHighlight from '../Search/Highlight';
import EditOnGitHub from './EditOnGitHub';
import InlineCode from '../InlineCode';
import Markdown from 'react-markdown';
import PropTypes from 'prop-types';
import React from 'react';
import RelativeLink, {PrimaryLink} from '../RelativeLink';
import {ArrowRightIcon} from '../Icons';
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

PaddedMarkdownCodeBlock.propTypes = {
  children: PropTypes.node.isRequired
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

export const makeGlossaryTermId = term =>
  term.replace(/\s+/g, '-').replace(/@/g, '').replace(/\//g, '').toLowerCase();

const updateHost = url => {
  if (process.env.CONTEXT === 'production') {
    return url;
  }

  return url.replace(
    'https://www.apollographql.com/docs',
    process.env.DEPLOY_URL
  );
};

const Results = () => {
  const {hits} = useHits();
  const {isInternal} = useUser();

  return (
    <Stack divider={<StackDivider borderColor="border" />} spacing={1}>
      {hits.map(hit => (
        <Box key={hit.objectID} mt="6">
          <HStack mt="2" pb="4">
            <ClickableHeading
              as="h2"
              fontSize="2xl"
              fontWeight="bold"
              id={makeGlossaryTermId(hit.term)}
            >
              {hit.internalOnly && <span>🔒 </span>}
              <Highlight attribute="term" hit={hit} />
            </ClickableHeading>
            {hit._highlightResult.labels &&
              hit._highlightResult.labels.map(label => (
                <Tag
                  key={label}
                  size="md"
                  colorScheme="navy"
                  _dark={{
                    color: 'navy.100'
                  }}
                  variant="outline"
                  borderRadius="md"
                >
                  <TagLabel>
                    <CustomHighlight value={label.value} />
                  </TagLabel>
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
                    <RelativeLink href={`#${makeGlossaryTermId(term)}`}>
                      {term}
                    </RelativeLink>
                    {index < hit.relatedTerms.length - 1 && ', '}
                  </React.Fragment>
                ))}
              </HStack>
            </Box>
          )}
          {isInternal &&
            (hit.usageInstructions ||
              hit.businessContext ||
              hit.exampleUsage) && (
              <Box
                pl="4"
                py="1"
                my="4"
                borderLeftWidth="2px"
                borderColor="primary"
                sx={{
                  '>': {
                    ':not(a):not(:last-child)': {
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
                href={updateHost(hit.learnMore)}
                style={{display: 'flex', alignItems: 'center'}}
              >
                <Text style={{marginRight: '0.5rem'}}>
                  {hit.learnMoreText
                    ? hit.learnMoreText
                    : 'Learn more about this term'}
                </Text>
                <ArrowRightIcon />
              </PrimaryLink>
              {isInternal && <EditOnGitHub term={hit.objectID} />}
            </Flex>
          ) : (
            <Box>{isInternal && <EditOnGitHub term={hit.objectID} />}</Box>
          )}
        </Box>
      ))}
    </Stack>
  );
};

export default Results;

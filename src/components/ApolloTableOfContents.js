import PropTypes from 'prop-types';
import React from 'react';
import TableOfContents from './TableOfContents';
import {Button, Heading, Stack, chakra} from '@chakra-ui/react';
import {FaDiscourse} from 'react-icons/fa';
import {FiStar} from 'react-icons/fi';

ApolloTableOfContents.propTypes = {
  toc: PropTypes.any,
  top: PropTypes.string,
  paddingBottom: PropTypes.any,
  title: PropTypes.any,
  headings: PropTypes.any,
  onClick: PropTypes.func,
  editOnGitHub: PropTypes.any
};

export function ApolloTableOfContents(props) {
  return (
    <>
      {props.toc !== false && (
        // hide the table of contents on the home page
        <chakra.aside
          d={{base: 'none', lg: 'flex'}}
          flexDirection="column"
          ml={{base: 10, xl: 16}}
          w={250}
          flexShrink="0"
          pos="sticky"
          top={props.top}
          maxH={`calc(100vh - ${props.top} - ${props.paddingBottom})`}
        >
          <Heading size="md" mb="3">
            {props.title}
          </Heading>
          <TableOfContents headings={props.headings} />
          <Stack align="flex-start" spacing="3" mt="8">
            <Button
              onClick={props.onClick}
              variant="link"
              size="lg"
              leftIcon={<FiStar />}
            >
              Rate article
            </Button>
            {props.editOnGitHub}
            <Button
              as="a"
              href="https://community.apollographql.com/"
              variant="link"
              size="lg"
              leftIcon={<FaDiscourse />}
            >
              Discuss in forums
            </Button>
          </Stack>
        </chakra.aside>
      )}
    </>
  );
}

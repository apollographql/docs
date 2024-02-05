import PropTypes from 'prop-types';
import React from 'react';
import {ListItem, OrderedList, UnorderedList} from '@chakra-ui/react';

import InlineCode from './InlineCode';
import Markdown from 'react-markdown';
import RelativeLink from './RelativeLink';
import {HighlightKeyTerms} from '@apollo/pedia';
import {MarkdownCodeBlock} from '@apollo/chakra-helpers';

const LIST_SPACING = 1;

const NESTED_LIST_STYLES = {
  [['ul', 'ol']]: {
    mt: 3,
    lineHeight: 'normal'
  }
};

export const MarkdownInAdmonitions = ({children}) => {
  return (
    <Markdown
      components={{
        ul: props => (
          <UnorderedList
            spacing={LIST_SPACING}
            sx={{
              ...NESTED_LIST_STYLES,
              marginStart: '2em',
              ul: {
                listStyleType: 'circle'
              }
            }}
            {...props}
          />
        ),
        ol: props => (
          <OrderedList
            spacing={LIST_SPACING}
            sx={NESTED_LIST_STYLES}
            {...props}
          />
        ),
        li: ({children, ...props}) => (
          <ListItem
            sx={{
              '>': {
                ':not(:last-child)': {
                  mb: 3
                }
              }
            }}
            {...props}
          >
            <HighlightKeyTerms>{children}</HighlightKeyTerms>
          </ListItem>
        ),
        p: ({children}) => {
          return <HighlightKeyTerms>{children}</HighlightKeyTerms>;
        },
        a: RelativeLink,
        pre: MarkdownCodeBlock,
        code: ({children}) => <InlineCode pt="10px">{children}</InlineCode>
      }}
    >
      {children}
    </Markdown>
  );
};

MarkdownInAdmonitions.propTypes = {
  children: PropTypes.node.isRequired
};

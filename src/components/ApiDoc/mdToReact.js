import InlineCode from '../InlineCode';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import {PrimaryLink} from '../RelativeLink';
import {Text} from '@chakra-ui/react';

export function mdToReact(text) {
  const sanitized = text
    .replace(/\{@link (\w*)\}/g, '[$1](#$1)')
    .replace(/<p ?\/>/g, '');
  return (
    <ReactMarkdown
      components={{
        p: Text,
        a: PrimaryLink,
        code: ({children}) => <InlineCode>{children}</InlineCode>
      }}
    >
      {sanitized}
    </ReactMarkdown>
  );
}

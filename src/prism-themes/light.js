import {colors} from '@apollo/space-kit/colors';
import {sharedStyles} from './sharedStyles';

const {black, silver, orange, grey, pink, teal, indigo, yellow} = colors;

export const theme = {
  plain: {
    color: black.lighter,
    backgroundColor: silver.lighter
  },
  styles: [
    ...sharedStyles,
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: orange.dark
      }
    },

    {
      types: ['punctuation'],
      style: {
        color: grey.dark
      }
    },
    {
      types: [
        'property',
        'tag',
        'boolean',
        'number',
        'constant',
        'symbol',
        'deleted',
        'class-name',
        'function'
      ],
      style: {
        color: pink.darker
      }
    },
    {
      types: ['selector', 'attr-name', 'string', 'char', 'builtin', 'inserted'],
      style: {
        color: teal.darker
      }
    },
    {
      types: ['atrule', 'attr-value', 'keyword'],
      style: {
        color: 'inherit',
        background: 'transparent'
      }
    },
    {
      types: ['atrule', 'attr-value', 'keyword'],
      style: {
        color: indigo.dark
      }
    },
    {
      types: ['regex', 'important', 'variable'],
      style: {
        color: yellow.darker
      }
    }
  ]
};

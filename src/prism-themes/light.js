import {colors} from '@apollo/space-kit/colors';

const {black, silver, orange, grey, pink, teal, indigo, yellow} = colors;

export const theme = {
  plain: {
    color: black.lighter,
    backgroundColor: silver.lighter
  },
  styles: [
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
    },
    {
      types: ['important', 'bold'],
      style: {
        fontWeight: 'bold'
      }
    },
    {
      types: ['italic'],
      style: {
        fontStyle: 'italic'
      }
    },
    {
      types: ['entity'],
      style: {
        cursor: 'help'
      }
    }
  ]
};

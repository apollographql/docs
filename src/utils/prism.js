import {colors} from '@apollo/space-kit/colors';
import {useColorModeValue} from '@chakra-ui/react';

const {silver, midnight, orange, grey, pink, teal, indigo, yellow} = colors;

export function usePrismTheme() {
  const isDark = useColorModeValue(false, true);
  return {
    plain: {
      color: 'currentColor',
      backgroundColor: isDark ? midnight.darkest : silver.lighter
    },
    styles: [
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
      },
      {
        types: ['comment', 'prolog', 'doctype', 'cdata'],
        style: {
          color: orange[isDark ? 'light' : 'darker'],
          fontWeight: 'bold'
        }
      },
      {
        types: ['punctuation'],
        style: {
          color: grey[isDark ? 'light' : 'dark']
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
          color: pink[isDark ? 'light' : 'dark']
        }
      },
      {
        types: [
          'selector',
          'attr-name',
          'string',
          'char',
          'builtin',
          'inserted'
        ],
        style: {
          color: teal[isDark ? 'light' : 'darker']
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
          color: indigo[isDark ? 'light' : 'dark']
        }
      },
      {
        types: ['regex', 'important', 'variable'],
        style: {
          color: yellow[isDark ? 'light' : 'darker']
        }
      }
    ]
  };
}

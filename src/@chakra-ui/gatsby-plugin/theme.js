import {colors} from '@apollo/space-kit/colors';
import {
  components,
  createColorPalette,
  createGrayPalette,
  fonts
} from '@apollo/chakra-helpers';
import {extendTheme} from '@chakra-ui/react';

const {grey, silver, indigo, teal, blilet, midnight, yellow} = colors;

const theme = extendTheme({
  config: {
    initialColorMode: 'system'
  },
  styles: {
    global: {
      strong: {
        fontWeight: 'strong'
      }
    }
  },
  semanticTokens: {
    fontWeights: {
      strong: {
        default: 'semibold',
        _dark: 'bold'
      }
    },
    colors: {
      bg: {
        default: 'white',
        _dark: 'gray.800'
      },
      primary: {
        default: 'indigo.500',
        _dark: 'indigo.200'
      },
      secondary: {
        default: 'pink.600',
        _dark: 'pink.300'
      },
      tertiary: {
        default: 'teal.600',
        _dark: 'teal.300'
      }
    }
  },
  components: {
    ...components,
    Table: {
      baseStyle: {
        table: {
          borderCollapse: 'separate',
          borderSpacing: 0,
          borderWidth: '1px',
          rounded: 'md'
        },
        th: {
          fontWeight: 'normal'
        }
      }
    }
  },
  fonts,
  colors: {
    gray: createGrayPalette(silver, grey, midnight),
    indigo: createColorPalette(indigo),
    teal: createColorPalette(teal),
    blue: createColorPalette(blilet),
    yellow: createColorPalette(yellow)
  }
});

export default theme;

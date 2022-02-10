import {colors} from '@apollo/space-kit/colors';
import {
  components,
  createColorPalette,
  createGrayPalette,
  fonts
} from '@apollo/chakra-helpers';
import {extendTheme} from '@chakra-ui/react';

const {grey, silver, indigo, teal, blilet, midnight} = colors;

const theme = extendTheme({
  config: {
    initialColorMode: 'system'
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
    blue: createColorPalette(blilet)
  }
});

export default theme;

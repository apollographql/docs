import {colors} from '@apollo/space-kit/colors';
import {
  createColorPalette,
  createGrayPalette,
  fonts
} from '@apollo/chakra-helpers';
import {extendTheme} from '@chakra-ui/react';

const {grey, silver, indigo, midnight} = colors;

const theme = extendTheme({
  config: {
    initialColorMode: 'system'
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: 'semibold'
      }
    }
  },
  fonts,
  colors: {
    gray: createGrayPalette(silver, grey, midnight),
    indigo: createColorPalette(indigo)
  }
});

export default theme;

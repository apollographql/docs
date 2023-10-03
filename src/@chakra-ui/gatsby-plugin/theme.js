import {colors} from '@apollo/space-kit/colors';
import {
  components,
  createColorPalette,
  createGrayPalette,
  fonts
} from '@apollo/chakra-helpers';
import {extendTheme} from '@chakra-ui/react';

const {grey, silver, indigo, teal, blilet, midnight, yellow, orange} = colors;

const theme = extendTheme({
  config: {
    initialColorMode: 'system'
  },
  styles: {
    global: {
      strong: {
        fontWeight: 'strong'
      },
      body: {
        bg: 'bg',
        color: 'text'
      },
      '*': {
        borderColor: 'border'
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
        default: 'regolith',
        _dark: 'nebula.500'
      },
      text: {
        default: 'nebula.500',
        _dark: 'regolith'
      },
      border: {
        default: 'nebula.500',
        _dark: 'whiteAlpha.300'
      },
      primary: {
        default: 'horizon.600',
        _dark: 'horizon.300'
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
    yellow: createColorPalette(yellow),
    orange: createColorPalette(orange),
    regolith: '#FFEADB',
    horizon: createColorPalette({
      darkest: '#612000',
      darker: '#943000',
      dark: '#C74100',
      base: '#FC5200',
      light: '#FF722E',
      lighter: '#FF9461',
      lightest: '#FFB794'
    }),
    nebula: createColorPalette({
      darkest: '#000',
      darker: '#0B1418',
      dark: '#15252D',
      base: '#254250',
      light: '#365E72',
      lighter: '#467B95',
      lightest: '#5C96B2'
    }),
    satellite: createColorPalette({
      darkest: '#7C928F',
      darker: '#98A9A7',
      dark: '#B4C0BE',
      base: '#CFD7D6',
      light: '#ECEFEF',
      lighter: '#F9FAFA',
      lightest: '#FFF'
    })
  }
});

export default theme;

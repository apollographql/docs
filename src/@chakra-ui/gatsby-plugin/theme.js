import {components} from '@apollo/chakra-helpers';
import {extendTheme} from '@chakra-ui/react';
import {colors as newBrandColors} from '@apollo/brand';

const {gray, navy, blue, yellow, orange, red, green, purple, silver, black} =
  newBrandColors.primitives;

const {bg, button, border, text} = newBrandColors.tokens;

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
      code: {
        fontSize: 'sm',
        color: 'blue.400',
        bgColor: 'silver.400',
        _dark: {
          color: 'navy.100',
          bgColor: 'black.200'
        }
      },
      pre: {
        fontSize: 'sm'
      },
      mark: {
        bg: 'transparent',
        color: 'inherit',
        textDecor: 'underline'
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
        default: bg.primary.base,
        _dark: black[100]
      },
      text: {
        default: text.primary.base,
        _dark: text.primary.dark
      },
      border: {
        default: border.primary.base,
        _dark: navy[400]
      },
      primary: {
        default: button.primary.base,
        _dark: button.primary.dark
      },
      secondary: {
        default: text.secondary.base,
        _dark: button.secondary.dark
      },
      tertiary: {
        default: 'blue.400',
        _dark: 'navy.100'
      }
    }
  },
  components: {
    ...components,
    Heading: {
      baseStyle: {
        // TODO: contribute this back to chakra-helpers
        fontWeight: 'medium'
      }
    },
    Text: {
      baseStyle: {
        lineHeight: '1.8rem'
      }
    },
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
  fontSizes: {
    xs: '0.75rem',
    sm: '0.9rem',
    md: '1rem',
    lg: '1.1rem',
    xl: '1.2rem',
    '2xl': '1.3rem',
    '3xl': '1.7rem',
    '4xl': '2.1rem',
    '5xl': '2.8rem',
    '6xl': '4rem'
  },
  fonts: {
    heading: 'Aeonik, sans-serif',
    body: 'Inter, sans-serif',
    mono: 'Fira Code, monospace'
  },
  colors: {
    silver,
    gray,
    navy,
    blue,
    yellow,
    orange,
    purple,
    red,
    green,
    black
  }
});

export default theme;

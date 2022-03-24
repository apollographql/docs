import {ColorHues} from '@chakra-ui/react';
import {ColorPalette, MonochromePalette} from '@apollo/space-kit/colors';
import {mix} from 'polished';

const body = "'Source Sans Pro', sans-serif";
export const fonts = {
  body,
  heading: body,
  mono: "'Source Code Pro', monospace"
};

export const components = {
  Heading: {
    baseStyle: {
      fontWeight: 'semibold'
    }
  }
};

export const createGrayPalette = (
  low: MonochromePalette,
  mid: MonochromePalette,
  high: ColorPalette
): ColorHues => ({
  50: low.light,
  100: low.base,
  200: low.dark,
  300: low.darker,
  400: mid.light,
  500: mid.dark,
  600: high.dark,
  700: mix(0.5, high.dark, high.darker),
  800: high.darker,
  900: high.darkest
});

// since space kit palettes only contain 7 keys (lightest not included here)
// we need to mix colors together to fill the gaps and create a complete
// chakra color palette
export const createColorPalette = (color: ColorPalette): ColorHues => ({
  50: color.lightest,
  100: color.lighter,
  200: color.light,
  300: mix(0.5, color.light, color.base),
  400: color.base,
  500: color.dark,
  600: mix(0.5, color.dark, color.darker),
  700: color.darker,
  800: mix(0.5, color.darker, color.darkest),
  900: color.darkest
});

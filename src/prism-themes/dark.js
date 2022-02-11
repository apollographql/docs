import {colors} from '@apollo/space-kit/colors';
import {mix} from 'polished';

const {midnight, blilet, orange, teal, yellow, purple, blue} = colors;

export const theme = {
  plain: {
    color: 'white',
    backgroundColor: midnight.darkest
  },
  styles: [
    {
      types: ['comment', 'punctuation'],
      style: {
        color: midnight.lighter
      }
    },
    {
      types: ['variable', 'string'],
      style: {
        color: orange.light
      }
    },
    {
      types: ['constant'],
      style: {
        color: 'white'
      }
    },
    {
      types: ['keyword', 'builtin', 'number', 'char'],
      style: {
        color: orange.base
      }
    },
    {
      types: ['tag', 'deleted'],
      style: {
        color: teal.base
      }
    },
    {
      types: ['function'],
      style: {
        color: blilet.light
      }
    },
    {
      types: ['symbol', 'inserted'],
      style: {
        color: teal.light
      }
    },
    {
      types: ['changed'],
      style: {
        color: mix(0.5, yellow.dark, yellow.base) // fairly close to original #FFCB6B, but using space kit colors here
      }
    },
    {
      types: ['attr-name'],
      style: {
        color: mix(0.5, purple.base, purple.lightest) // fairly close to original #C792EA, but using space kit colors here
      }
    },
    {
      types: ['regex'],
      style: {
        color: mix(0.5, teal.light, blue.light) // fairly close to original #89DDFF, but using space kit colors here
      }
    },
    {
      types: ['boolean'],
      style: {
        color: yellow.base
      }
    }
  ]
};

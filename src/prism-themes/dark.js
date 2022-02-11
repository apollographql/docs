import {colors} from '@apollo/space-kit/colors';

const {midnight, blilet, orange, teal, yellow} = colors;
const white = '#ffffff'; // TODO: import white directly from chakra theme

export const theme = {
  plain: {
    color: white,
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
        color: white
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
        color: '#FFCB6B'
      }
    },
    {
      types: ['attr-name'],
      style: {
        color: '#C792EA'
      }
    },
    {
      types: ['regex'],
      style: {
        color: '#89DDFF'
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

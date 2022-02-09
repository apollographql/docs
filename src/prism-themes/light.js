export const theme = {
  plain: {
    color: '#2F353F', // black.lighter
    backgroundColor: '#F4F6F8' // silver.light
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: '#B46626' // orange.dark
      }
    },

    {
      types: ['punctuation'],
      style: {
        color: '#5A6270' // grey.dark
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
        'deleted'
      ],
      style: {
        color: '#832363' // pink.darker
      }
    },
    {
      types: ['selector', 'attr-name', 'string', 'char', 'builtin', 'inserted'],
      style: {
        color: '#1D7B78' // teal.darker
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
        color: '#311C87' // indigo.dark
      }
    },
    {
      types: ['class-name', 'function'],
      style: {
        color: '#832363' // pink.darker
      }
    },
    {
      types: ['regex', 'important', 'variable'],
      style: {
        color: '#84671D' // yellow.darker
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

module.exports = {
  extends: ['@trevorblades/eslint-config/react', 'plugin:mdx/recommended'],
  overrides: [
    {
      files: ['*.mdx'],
      globals: {
        Button: 'readonly',
        ExpansionPanel: 'readonly',
        MultiCodeBlock: 'readonly'
      }
    }
  ]
};

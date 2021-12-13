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
    },
    {
      files: ['**/__tests__/*.js', '**.test.js'],
      env: {
        jest: true
      }
    }
  ]
};

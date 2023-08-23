module.exports = {
  extends: ['@trevorblades/eslint-config/react', 'plugin:mdx/recommended'],
  overrides: [
    {
      files: ['*.mdx'],
      globals: {
        Button: 'readonly',
        ButtonLink: 'readonly',
        ExpansionPanel: 'readonly',
        MultiCodeBlock: 'readonly',
        YouTube: 'readonly',
        EmbeddableExplorer: 'readonly',
        MinVersion: 'readonly',
        // shared content
        CalloutCard: 'readonly',
        ClientPQDifferences: 'readonly',
        ClientPQImplementation: 'readonly',
        ClientPQIntro: 'readonly',
        Disclaimer: 'readonly',
        GraphOSEnterpriseRequired: 'readonly',
        ObtainGraphApiKey: 'readonly',
        ObtainPersonalApiKey: 'readonly',
        PQIntro: 'readonly',
        PQRouterConfiguration: 'readonly',
        PQSecurityLevels: 'readonly',
        PublishPQMs: 'readonly',
        RegisterCLI: 'readonly',
        RegisterFederatedCLI: 'readonly',
        TopLevelAwait: 'readonly'
      },
      rules: {
        'react/no-unescaped-entities': 'off'
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

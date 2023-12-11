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
        CreateSelfHostedSupergraph: 'readonly',
        ClientPQDifferences: 'readonly',
        ClientPQImplementation: 'readonly',
        ClientPQIntro: 'readonly',
        DirectiveCompositionRules: 'readonly',
        Disclaimer: 'readonly',
        EnterpriseFeature: 'readonly',
        Caution: 'readonly',
        Note: 'readonly',
        Tip: 'readonly',
        ExperimentalFeature: 'readonly',
        GraphOSEnterpriseRequired: 'readonly',
        InconsistentCompositionRules: 'readonly',
        ObtainGraphApiKey: 'readonly',
        ObtainPersonalApiKey: 'readonly',
        OverriddenCompositionRules: 'readonly',
        PQIntro: 'readonly',
        PQRouterConfiguration: 'readonly',
        PQSecurityLevels: 'readonly',
        PreviewFeature: 'readonly',
        PublishPQMs: 'readonly',
        RegisterCLI: 'readonly',
        RegisterFederatedCLI: 'readonly',
        SetApolloVCSCommit: 'readonly',
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

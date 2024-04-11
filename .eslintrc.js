module.exports = {
  extends: ['@trevorblades/eslint-config/react', 'plugin:mdx/recommended'],
  overrides: [
    {
      files: ['*.mdx'],
      globals: {
        ApprovedSchemaProposals: 'readonly',
        Button: 'readonly',
        ButtonLink: 'readonly',
        ExpansionPanel: 'readonly',
        MultiCodeBlock: 'readonly',
        YouTube: 'readonly',
        PropertyList: 'readonly',
        Property: 'readonly',
        Tabs: 'readonly',
        Tab: 'readonly',
        EmbeddableExplorer: 'readonly',
        MinVersion: 'readonly',
        // shared content
        CalloutCard: 'readonly',
        CreateSelfHostedSupergraph: 'readonly',
        ClientPQDifferences: 'readonly',
        ClientPQImplementation: 'readonly',
        ClientPQIntro: 'readonly',
        DedicatedPreview: 'readonly',
        DirectiveCompositionRules: 'readonly',
        Disclaimer: 'readonly',
        EnterpriseFeature: 'readonly',
        PremiumFeature: 'readonly',
        Caution: 'readonly',
        Note: 'readonly',
        Tip: 'readonly',
        ExperimentalFeature: 'readonly',
        GraphOSEnterpriseRequired: 'readonly',
        GraphOSRouterFeatures: 'readonly',
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
        SchemaProposalCreationMermaid: 'readonly',
        SchemaProposalReviewMermaid: 'readonly',
        SchemaProposalImplementationMermaid: 'readonly',
        SchemaProposalImplementationNote: 'readonly',
        SchemaProposalPublicationMermaid: 'readonly',
        SetApolloVCSCommit: 'readonly',
        SSOLegacyCaution: 'readonly',
        SSOMigrationNotice: 'readonly',
        SSOPreviewNotice: 'readonly',
        SSOSAMLInfoRequest: 'readonly',
        StudioPages: 'readonly',
        HowSubscriptionsWork: 'readonly',
        WhatSubscriptionsAreFor: 'readonly',
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

// mapping of remote source paths to their git repo and branch name
module.exports = {
  react: {
    remote: 'https://github.com/apollographql/apollo-client',
    branch: 'main'
  },
  'react/v2': {
    remote: 'https://github.com/apollographql/apollo-client',
    branch: 'version-2.6'
  },
  'apollo-server': {
    remote: 'https://github.com/apollographql/apollo-server',
    branch: 'main'
  },
  'apollo-server/v3': {
    remote: 'https://github.com/apollographql/apollo-server',
    branch: 'version-3'
  },
  'apollo-server/v2': {
    remote: 'https://github.com/apollographql/apollo-server',
    branch: 'version-2'
  },
  'customer-success': {
    remote: `https://svc-apollo-docs:${process.env.GITHUB_TOKEN}@github.com/apollographql/customer-success`,
    branch: 'main'
  },
  ios: {
    remote: 'https://github.com/apollographql/apollo-ios',
    branch: 'main'
  },
  'ios/v0-legacy': {
    remote: 'https://github.com/apollographql/apollo-ios',
    branch: '0.x-legacy'
  },
  kotlin: {
    remote: 'https://github.com/apollographql/apollo-kotlin',
    branch: 'release-3.x'
  },
  'kotlin/v4': {
    remote: 'https://github.com/apollographql/apollo-kotlin',
    branch: 'main'
  },
  'kotlin/v2': {
    remote: 'https://github.com/apollographql/apollo-kotlin',
    branch: 'release-2.x'
  },
  federation: {
    remote: 'https://github.com/apollographql/federation',
    branch: 'main'
  },
  'federation/v1': {
    remote: 'https://github.com/apollographql/federation',
    branch: 'version-0.x'
  },
  rover: {
    remote: 'https://github.com/apollographql/rover',
    branch: 'main'
  },
  router: {
    remote: 'https://github.com/apollographql/router',
    branch: 'main'
  },
  'platform-users': {
    remote: `https://svc-apollo-docs:${process.env.GITHUB_TOKEN}@github.com/apollographql/platform-users-docs`,
    branch: 'main'
  }
};

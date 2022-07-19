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
  'apollo-server/v4': {
    remote: 'https://github.com/apollographql/apollo-server',
    branch: 'version-4'
  },
  'apollo-server': {
    remote: 'https://github.com/apollographql/apollo-server',
    branch: 'main'
  },
  'apollo-server/v2': {
    remote: 'https://github.com/apollographql/apollo-server',
    branch: 'version-2'
  },
  'customer-success': {
    remote: `https://trevorblades:${process.env.GITHUB_TOKEN}@github.com/apollographql/customer-success`,
    branch: 'main'
  },
  ios: {
    remote: 'https://github.com/apollographql/apollo-ios',
    branch: 'main'
  },
  'ios/v1': {
    remote: 'https://github.com/apollographql/apollo-ios',
    branch: 'release/1.0'
  },
  kotlin: {
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
  }
};

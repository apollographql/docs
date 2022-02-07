# Apollo Docs

This repo contains the code responsible for building the Apollo Docs site. It also houses the content for the Apollo Basics and Studio **docsets**. We also export shared utilities and components from the [`@apollo/chakra-helpers`](./packages/chakra-helpers) package in the `packages` directory.

> We use the word **docset** to describe an individual docs website. For example, "I just updated the Android docset".

The central piece of this repo, the docs infrastructure, is a Gatsby website that sources MDX and Markdown files from the remote git repos of Apollo's tools, like https://github.com/apollographql/apollo-client. It pulls in all of this data and outputs a single static site. To learn more about this approach, check out [this section](#the-approach).

- [Developing locally](#developing-locally)
  - [Developing a local docset](#developing-a-local-docset)
- [Meet the docsets](#meet-the-docsets)
  - [Local](#local)
  - [Remote](#remote)
- [Running against a local docset](#running-against-a-local-docset)
- [History](#history)
  - [Benefits](#benefits)
  - [Drawbacks](#drawbacks)
  - [The solution](#the-solution)

## Developing locally

To run this site locally, you'll first want to make sure you have the following tools installed on your system:

- [Volta](https://volta.sh/): ensures that we're all using the same Node and NPM versions when running the site
- [Netlify CLI](https://docs.netlify.com/cli/get-started/): automatically injects required environment variables into the build

If it's your first time running the docs site locally, you must link your local directory with Netlify. Follow the prompts in your terminal and the site should be linked automatically.

```sh
netlify login # if you haven't already
netlify init
```

Next, install NPM dependencies and run the site using the Netlify CLI.

```sh
npm i # install dependencies
netlify dev # start local development environment
```

> ⌚ The first run may take a long time as it has to source a lot of content, but subsequent runs will be shorter since most of that data will have been cached.

### Developing a local docset

By default, running the local development environment will build a site with _everything_ included. If you're working on a content edit to a single docset and want to preview those changes within the context of the docs site, you can specify a `DOCS_PATH` environment variable pointing to the location of your local content directory. This will cause the site to source content _only_ from the provided local directory, and content changes will be hot-reloaded.

```sh
DOCS_PATH=../apollo-client/docs/source netlify dev
```

## Meet the docsets

The docs content is written and maintained in the following places. Many of them are other git repositories, but some of the content on this site is stored in this repo.

### Local

- [Apollo Basics](./src/content/basics)
- [Apollo Studio](./src/content/studio)

### Remote

- [Apollo Client (React)](https://github.com/apollographql/apollo-client)
- [Apollo Server](https://github.com/apollographql/apollo-server)
- [Apollo iOS](https://github.com/apollographql/apollo-ios)
- [Apollo Kotlin](https://github.com/apollographql/apollo-kotlin)
- [Apollo Federation](https://github.com/apollographql/federation)
- [Rover CLI](https://github.com/apollographql/rover)
- [Apollo Router](https://github.com/apollographql/router)

## Deploys and previews

- set up a new docset
- config
- add to sources
- content directory
- github workflows

## Authoring

- links
- code blocks
- what is mdx?
  - shared content blocks
  - components

## History

Previous to this system, we built our docs site by building each repo's docs individually using a [shared Gatsby theme](https://github.com/apollographql/gatsby-theme-apollo/). Each site would be deployed to Netlify and "stitched" together to make one continuous website using Netlify path rewrites like this:

```
/docs/ios/* https://apollo-ios-docs.netlify.app/:splat 200!
/docs/react/* https://apollo-client-docs.netlify.app/:splat 200!
```

> All of our path rewriting happens in the [website router](https://github.com/apollographql/webiste-router) repo.

### Benefits

The main benefit of this approach is that it let us colocate docs articles with the libraries that they're describing. The iOS docs live in the iOS client repo, and so on. This was an organization that everybody liked. 🤝

### Drawbacks

One drawback was that this would introduce extra configuration files and dependencies to each repo's `docs` directory. This meant that Dependabot PRs would be opened on every repo when one of the docs site dependencies had a security vulnerability.

We use [Renovate](https://github.com/renovatebot/renovate) to automatically keep our dependencies up-to-date when new versions are published. However, problems arose when library maintainers (rightly) wanted to use a newer version of `npm` but the docs were meant to be installed/built using an older version. The docs dependencies would be installed using the new tooling and build errors would crop up.

Another downside was the complicated flow for publishing changes to the docs infrastructure. Let's say we wanted to add a copy button to the code blocks. We would have to:

1. Make changes to code in the Gatsby theme repo
2. Publish a prerelease version of the theme to NPM
3. Checkout a new branch on the docs repo you want to test on
4. Install the prerelease version
5. Verify changes
6. Publish new version of the theme
7. Wait for Renovate to pick up the change and post a PR (~1h) or make your own PR upgrading the theme in every. single. repo. 💀

### The solution

This new infrastructure fixes these issues by centralizing the website code and dependencies in one place, and pulling in content from the library repos. Each library's `docs` directory now only needs to include Markdown/MDX files and images—no Gatsby configuration or dependencies.

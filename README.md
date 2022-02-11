# Apollo Docs

This repo contains the code responsible for building the Apollo Docs site. It also houses the content for the Apollo Basics and Studio **docsets**. We also export shared utilities and components from the [`@apollo/chakra-helpers`](./packages/chakra-helpers) package in the `packages` directory.

> We use the word **docset** to describe an individual docs website. For example, "I just updated the Android docset".

The central piece of this repo, the docs infrastructure, is a [Gatsby](https://www.gatsbyjs.com/) website that sources MDX and Markdown files from the [remote git repos](#remote) of Apollo's tools. It pulls in all of this data and outputs a single static site. To learn more about this approach and why we built this, check out [this section](#history).

- [Developing locally](#developing-locally)
  - [Developing a single docset](#developing-a-single-docset)
- [Meet the docsets](#meet-the-docsets)
  - [Local](#local)
  - [Remote](#remote)
- [Docset configuration](#docset-configuration)
  - [config.json](#configjson)
  - [Adding a local docset](#adding-a-local-docset)
  - [Configuring a remote docset](#configuring-a-remote-docset)
  - [Managing versions](#managing-versions)
- [Deploys and previews](#deploys-and-previews)
  - [publish.yml](#publishyml)
  - [preview.yml](#previewyml)
- [Authoring](#authoring)
  - [Frontmatter](#frontmatter)
  - [Linking](#linking)
  - [Code blocks](#code-blocks)
  - [Using MDX](#using-mdx)
- [History](#history)
  - [Benefits](#benefits)
  - [Drawbacks](#drawbacks)
  - [Solution](#solution)

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

### Developing a single docset

By default, running the local development environment will build a site with _everything_ included. If you're working on a content edit to a single docset and want to preview those changes within the context of the docs site, you can specify a `DOCS_PATH` environment variable pointing to the location of your local content directory. This will cause the site to source content _only_ from the provided local directory, and content changes will be hot-reloaded. 🔥

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

## Docset configuration

A docset is made up of mostly Markdown/MDX files and a `config.json` file that configures its settings.

### config.json

The `config.json` file lives at the root of its docset's content directory, and it allows authors to configure the docset's title, version name, and sidebar nav. Here's an example of one:

```json
{
  "title": "Apollo Server",
  "version": "v3",
  "sidebar": {
    "Introduction": "/",
    "Get started": "/getting-started",
    "New in v3": {
      "Migrating to Apollo Server 3": "/migration",
      "Changelog": "https://github.com/apollographql/apollo-server/blob/main/CHANGELOG.md"
    }
  }
}
```

| Name    | Required? | Description                                                                                                                                                                                                                                                                                                       |
| ------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title   | yes       | The title of the docset. It is used to construct page titles and shown in the header when the docset is selected.                                                                                                                                                                                                 |
| version | no        | A string representing the version of the software that is being documented, i.e. "v3". This value is shown in the version dropdown if multiple versions of a docset are configured.                                                                                                                               |
| sidebar | yes       | A JSON object mapping sidebar nav labels to their paths. Use paths beginning with a slash, relative to the root of the content directory for internal links. Full URLs are transformed into external links that open in a new tab. These objects can be nested to define categories and subcategories in the nav. |

### Adding a local docset

To create a local docset, add a new directory to the `src/content` directory of this repo, and drop in an `index.md` file and a `config.json` file. Next, head over to the `sources/local.yml` file and add a line mapping the URL path that you want the docset to live at to the location of its content.

```yml
studio: src/content/studio
```

Restart your local development environment and the new docset will be available to peruse and develop. 🚀

### Configuring a remote docset

Remote docsets live within the `docs/source` directory of the **public** repo for the library that is being documented. The `docs/source` directory must contain some Markdown/MDX files and a `config.json` file.

> Configured repos must be public so that we can pull down their files at build time without permission issues

To add a remote docset to the website, add a record in the `sources/remote.yml` file. This record should map the URL path you want the docset to live at to the repo URL, called `remote`, and the name of the `branch` that content should be sourced from.

```yml
react:
  remote: https://github.com/apollographql/apollo-client
  branch: main
```

### Managing versions

This website presents multiple versions of docs for the same subject as options within a version dropdown in the main nav. It automatically treats multiple docsets with the same git remote URL as different versions of the same docs. So to add a new version, add a second entry to the `sources/remote.yml` file with your desired path (appending "/v2" in this case) and updated branch name.

```yml
react:
  remote: https://github.com/apollographql/apollo-client
  branch: main
react/v2:
  remote: https://github.com/apollographql/apollo-client
  branch: version-2.6
```

Next, these two docsets must specify the label that they want to appear for that version in the version dropdown. This is done by adding a `version` field to each version's `config.json`.

```json
{
  "title": "Apollo Client",
  "version": "v2",
  "sidebar": {...}
}
```

## Deploys and previews

This website gets rebuilt and deployed to Netlify every time something is committed to its default branch. Deploy previews are automatically created for new PRs.

"But what about changes to remote docsets?", I hear you say. Netlify doesn't let us configure a site to listen for changes in more than one repo. To get around this, we use GitHub Actions to trigger a new production deploy every time docs-related changes are made. We also build deploy previews and publish them to Netlify for PRs that include docs changes on these repos.

<!-- TODO: update when we get org-wide workflow templates working -->

To set up these actions in any repo, copy the following two YAML files to the repo's `.github/workflows` directory.

### publish.yml

```yml
name: Deploy to production

on:
  push:
    branches:
      - main
    paths:
      - docs/**

jobs:
  publish:
    uses: apollographql/docs/.github/workflows/publish.yml@main
    secrets:
      NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

### preview.yml

```yml
name: Preview on Netlify

on:
  pull_request:
    branches:
      - main
    paths:
      - docs/**

jobs:
  preview:
    uses: apollographql/docs/.github/workflows/preview.yml@main
    secrets:
      NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

Both of these workflows are configured to respond to changes to files within the `docs` directory and assumes that your default branch is `main`—please change this if it should be something else. Additionally, any [version branches](#managing-versions) that you have configured must also be added to the `branches` field.

```yml
branches:
  - main
  - version-2.6
```

They both make use of secrets configured at the organization level, so those don't need to be set within each repo. They also reference shared workflows [from this repo](./.github/workflows/) to simplify the complicated parts of the deploy process.

## Authoring

Docs articles are authored in [Markdown syntax](https://www.markdownguide.org/cheat-sheet/). This allows us to express lists, tables, blockquotes, and other HTML elements in a simple format. The following are some conventions and techniques to keep in mind when writing articles.

### Frontmatter

Frontmatter is a block of YAML code surrounded by `---` at the top of a Markdown file. We use frontmatter to configure the page title and description of each article.

```md
---
title: Proxy configuration
description: Configuring proxy settings for outgoing requests
---
```

### Linking

Links between docs articles should be written as relative paths. For example, if you wanted to link from the `schema/custom-scalars` article in the Apollo Server docs to the `getting-started` page at the root of the content directory, you would write:

```md
[get started](../getting-started)
```

Writing links using absolute paths, i.e. `/getting-started` will result in that link taking the user to `/docs/getting-started` in production, instead of `/docs/apollo-server/getting-started` as intended.

### Code blocks

In addition to supporting [syntax highlighting](https://www.markdownguide.org/extended-syntax/#syntax-highlighting), our code blocks also allow you to specify the title of the file that is being represented, and highlight specific lines.

In the following example, a YAML code block is configured with a `title` of "config.yml" and the numbers in the curly braces represent the lines that are meant to be highlighted—lines 1, 3, 4, and 5 in this case.

````md
```yml title="config.yml" {1,3-5}
title: Apollo Client
version: v3
sidebar:
  Introduction: /
  Why Apollo Client: /why-apollo
```
````

### Using MDX

[MDX](https://mdxjs.com/) is just like Markdown except you can import and render React components within it. MDX files use the `.mdx` extension, and you may be familiar with them if you've worked in any of our docsets before.

> Gatsby does not currently support MDX v2 ([MDX v2 only uses ESM](https://mdxjs.com/migrating/v2/#esm), which [Gatsby does not yet support](https://github.com/gatsbyjs/gatsby/discussions/31599)), so make sure that the MDX syntax you are using when authoring in an `.mdx` file is compatible with MDX v1.

#### Shared content

MDX is also composable; it allows you to render other MDX files within as if it were a React component. One pattern we use when sharing MDX content is saving the shared bits in a folder outside the `docs/source` directory so that those files aren't rendered as pages in the docs site.

_shared/configure-project.mdx_

```mdx
1. Sign up for an Apollo account
2. Create a graph in Apollo Studio
3. Add environment variables to your project
```

_source/get-started.mdx_

```mdx
import ConfigureProject from "../shared/configure-project.mdx";

## Introduction

Here's how to configure a project:

<ConfigureProject />
```

#### Components

You can import modules within MDX files, but we also provide a variety of components to every MDX file—no import required.

##### Button

A general-purpose button exported from Chakra UI. Refer to the [Chakra docs](https://chakra-ui.com/docs/form/button) for more information about how to use this component.

```mdx
import { Link } from "gatsby";

<Button as={Link} to="/apollo-server/v2">
  View older version
</Button>
```

##### ExpansionPanel

Show and hide a section of content with a configurable message. Wrap this component around a block of Markdown, and **make sure to add empty lines** between the opening and closing tags and the content within them.

```mdx
<ExpansionPanel title="Show solution">

This content will be hidden by default, but can be expanded if the user clicks on the panel.

- Markdown
- works
- here

</ExpansionPanel>
```

##### MultiCodeBlock

Wrap TypeScript code blocks in a `MultiCodeBlock` component to automatically transpile them into JavaScript. A language dropdown will be rendered in the top right corner of the code block for the user to switch between the two options. This feature works on code blocks tagged with `ts` or `tsx`.

You can also manually add multiple code blocks with different languages to the `MultiCodeBlock` to have them behave the same way.

````mdx
<MultiCodeBlock>

```ts
const foo: number = 123;
```

</MultiCodeBlock>
````

##### CodeColumns

Render multiple code blocks side-by-side. It takes a `cols` prop that affects the number of columns rendered. By default, it renders **two columns**.

````mdx
<CodeColumns cols={3}>

```js
const foo = 123;
```

```css
.link {
  background-color: red;
}
```

```html
<a class="link" href="https://example.com">Click here</a>
```

</CodeColumns>
````

##### YouTube

A YouTube player exported from MDX Embed. Check out all of the different props and options [on their docs](https://www.mdx-embed.com/?path=/docs/components-youtube--usage).

```mdx
Check out this introduction to Apollo Studio:

<YouTube youTubeId="sarXMaz3OpY" />
```

##### TypeScriptApiBox

This component is currently only used in the Apollo Client docset. It takes a property name and renders auto-generated documentation created by running [TypeDoc](https://typedoc.org/) in the Apollo Client repo.

```mdx
## The `ApolloClient` constructor

<TypeScriptApiBox name="ApolloClient.constructor" />
```

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

### Solution

This new infrastructure fixes these issues by centralizing the website code and dependencies in one place, and pulling in content from the library repos. Each library's `docs` directory now only needs to include Markdown/MDX files and images—no Gatsby configuration or dependencies.

We also increase our pace of iteration on website changes and make it easier to issue bug fixes or address security vulnerabilities by cutting out the extra steps of publishing to NPM and installing new versions of a package on each docs repo. And by moving non-OSS-related docsets into the central docs repo, we're able to consolidate docs-only repos and make those docsets easier to update.

# Apollo Docs

This repo contains the code responsible for building the Apollo Docs site. It also houses the content for the Apollo Basics and GraphOS **docsets**.

> [!TIP]
> We use the word **docset** to describe an individual docs website. For example, "I just updated the Android docset".

The central piece of this repo, the docs infrastructure, is a [Gatsby](https://www.gatsbyjs.com/) website that sources MDX and Markdown files from the [remote git repos](#remote) of Apollo's tools. It pulls in all this data and outputs a single static site. To learn more about this approach and why we built this, check out [this section](#history).

- [Developing locally](#developing-locally)
  - [Developing a single docset](#developing-a-single-docset)
- [Faster startup](#faster-startup)
- [Meet the docsets](#meet-the-docsets)
  - [Local](#local)
  - [Remote](#remote)
- [Docset configuration](#docset-configuration)
  - [config.json](#configjson)
  - [Adding a local docset](#adding-a-local-docset)
  - [Configuring a remote docset](#configuring-a-remote-docset)
  - [Managing versions](#managing-versions)
  - [Internal-only docsets](#internal-only-docsets)
  - [Sidebar annotations](#sidebar-annotations)
  - [Default sidebar category state](#default-sidebar-category-state)
  - [Redirect rules](#redirect-rules)
- [Publish and preview](#publish-and-preview)
  - [Production deploys](#production-deploys)
  - [Deploy previews](#deploy-previews)
- [Authoring](#authoring)
  - [Frontmatter](#frontmatter)
    - [Configuring the table of contents](#configuring-the-table-of-contents)
    - [Showing a version indicator](#showing-a-version-indicator)
  - [Linking](#linking)
  - [Code blocks](#code-blocks)
  - [Using MDX](#using-mdx)
    - [Shared content](#shared-content)
    - [Components](#components)
      - [ButtonLink](#buttonlink)
      - [ExpansionPanel](#expansionpanel)
      - [MultiCodeBlock](#multicodeblock)
      - [CodeColumns](#codecolumns)
      - [YouTube](#youtube)
      - [TypeScriptApiBox](#typescriptapibox)
      - [MinVersion](#minversion)
      - [Release stage components](#release-stage-components)
      - [Plan components](#plan-components)
      - [Admonitions](#admonitions)
      - [Tabs](#tabs)
- [History](#history)
  - [Benefits](#benefits)
  - [Drawbacks](#drawbacks)
  - [Solution](#solution)
  - [Impact](#impact)
    - [Netlify build stats (Feb 1 - Feb 24, 2022)](#netlify-build-stats-feb-1---feb-24-2022)
- [Notable changes to authoring patterns](#notable-changes-to-authoring-patterns)
  - [No more component imports](#no-more-component-imports)
  - [Code block titles and line highlighting](#code-block-titles-and-line-highlighting)
  - [Internal links](#internal-links)

## Developing locally

[Volta](https://volta.sh) ensures we're all using the same Node and NPM versions when running the site. Either install Volta before proceeding, or install [direnv](https://direnv.net) to install Volta automatically when you `cd` into your local `docs` directory.

1. Install NPM dependencies:

   ```sh
   npm i
   ```

   If it's your first time running the docs site locally, you must link your local directory with Netlify. To do this, you must be logged in to the `netlify` CLI with an account that has access to our organization in Netlify. Apollo Staff can log into the account using the Netlify Single Sign-On (SSO) option and specifying the `apollo-main` identifier during the login process.

   ```sh
   npx netlify login
   ```

2. Link your local environment with its corresponding Netlify site. Follow the prompts that appear in your terminal and link the site based on its git repository:

   ```sh
   # If netlify-cli is installed globally or as a dependency in the remote docset repo:
   npx netlify link

   # Otherwise:
   npx -p netlify-cli netlify link
   ```

3. Start the local development environment:

   ```sh
   npm start
   ```

> [!NOTE]
> ⌚ The first run may take a long time as it has to source a lot of content, but subsequent runs will be shorter since most of that data will have been cached.

### Developing a single docset

By default, running the local development environment will build a site with everything included. If you're working on a content edit to a single docset and want to preview those changes within the context of the docs site, you can specify the path to another docs repo that you have checked out on your computer. This will cause the site to source content only from the provided local directory, and changes to content in those repos will be hot-reloaded. 🔥

```sh
# this will build the React at the root of your local development environment
npm start -- ../apollo-client
```

For your convenience, this repo also comes with special `start` NPM scripts for each docset, assuming you have this repo checked out in the same directory as the other OSS repos.

- `npm run start:client`
- `npm run start:server`
- `npm run start:ios`
- `npm run start:kotlin`
- `npm run start:federation`
- `npm run start:rover`
- `npm run start:router`

Check out the [`package.json`](./package.json) to see how these scripts work!

## Faster startup

The GraphOS and Apollo basics docs content lives in this repo. To spin up a development environment serving only these docsets, there's the `start:local` script. This will result in much faster startup time since we're not sourcing any remote data. Use this script if you're working on changes in either of those docsets or website UI changes.

```sh
npm run start:local
```

## Meet the docsets

The docs content is written and maintained in the following places. Many of them are other git repositories, but some of the content on this site is stored in this repo.

### Local

- [Apollo Basics](./src/content/basics)
- [Apollo GraphOS](./src/content/graphos)

### Remote

- [Apollo Client (React)](https://github.com/apollographql/apollo-client)
- [Apollo Server](https://github.com/apollographql/apollo-server)
- [Apollo iOS](https://github.com/apollographql/apollo-ios-dev)
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
  "versionBanner": {
    "link": {
      "to": "/v3-deprecation-page",
      "content": "Check out the deprecation page"
    },
    "message": "Apollo Server v3 is no longer maintained."
  },
  "algoliaFilters": ["docset:server", ["docset:react", "docset:federation"]],
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

| Name           | Required? | Description                                                                                                                                                                                                                                                                                                       |
| -------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title          | yes       | The title of the docset. It is used to construct page titles and shown in the header when the docset is selected.                                                                                                                                                                                                 |
| sidebar        | yes       | A JSON object mapping sidebar nav labels to their paths. Use paths beginning with a slash, relative to the root of the content directory for internal links. Full URLs are transformed into external links that open in a new tab. These objects can be nested to define categories and subcategories in the nav. |
| version        | no        | A string representing the version of the software that is being documented, that is "v3". This value is shown in the version dropdown if multiple versions of a docset are configured.                                                                                                                               |
| algoliaFilters | no        | An array of filters that affect the ranking of search results when a search is made within a particular docset. This is passed to Algolia as an `optionalFilters` parameter, which you can learn more about [here](https://www.algolia.com/doc/api-reference/api-parameters/optionalFilters/).                    |
| internal       | no        | Set to `true` if you want your docset to be [internal-only](#internal-only-docsets).                                                                                                                                                                                                                              |
| versionBanner  | no        | A JSON object used to customize the `VersionBanner` link url and text.                                                                                                                                                                                                                                            |

### Adding a local docset

To create a local docset, add a new directory to the `src/content` directory of this repo, and drop in an `index.md` file and a `config.json` file. Next, head over to the `sources/local.yml` file and add a line mapping the URL path that you want the docset to live at to the location of its content.

```yml
graphos: src/content/graphos
```

Restart your local development environment and the new docset will be available to peruse and develop. 🚀

### Configuring a remote docset

Remote docsets live within the `docs/source` directory of the **public** repo for the library that is being documented. The `docs/source` directory must contain some Markdown/MDX files and a `config.json` file.

> [!IMPORTANT]
> Configured repos must be public so that we can pull down their files at build time without permission issues

To add a remote docset to the website, add a record in the `sources/remote.js` file. This record should map the URL path you want the docset to live at to the repo URL, called `remote`, and the name of the `branch` that content should be sourced from.

```js
// sources/remote.js
module.exports = {
  // ...other sources
  react: {
    remote: "https://github.com/apollographql/apollo-client",
    branch: "main",
  },
};
```

### Managing versions

This website presents multiple versions of docs for the same subject as options within a version dropdown in the main nav. It automatically treats multiple docsets with the same git remote URL as different versions of the same docs. So to add a new version, add a second entry to the `sources/remote.js` file with your desired path (appending "/v2" in this case) and updated branch name.

```js
// sources/remote.js
module.exports = {
  // ...other sources
  react: {
    remote: "https://github.com/apollographql/apollo-client",
    branch: "main",
  },
  "react/v2": {
    remote: "https://github.com/apollographql/apollo-client",
    branch: "version-2.6",
  },
};
```

Next, these two docsets must specify the label that they want to appear for that version in the version dropdown. This is done by adding a `version` field to each version's `config.json`.

```json
{
  "title": "Apollo Client",
  "version": "v2",
  "sidebar": {...}
}
```

### Internal-only docsets

You can publish docsets that are viewable only by Apollo team members by setting the `internal` option to `true` in your [config.json](#configjson) file.

```json
{
  "internal": true
}
```

If a visitor to that page is logged in to GraphOS Studio **and** is a member of one of our internal orgs, the page content will be rendered normally. If neither of those conditions are true, a 404 page will be shown. Internal-only pages are excluded from the sitemap and won't be indexed by Google.

It's important to note that you must sign in to and out of your account using Studio or Odyssey, as the docs don't currently have their own sign in form. For local development, sign in to the staging Studio.

### Sidebar annotations

If you would like an icon with a tooltip for any use case across the sidebar navigation items (preview tag, experimental tag, etc.), you can use an array for the path, where the first item is the URL path, and the second item is an array of tags.

```json
{
  "Performance alerts": [
    "/notifications/performance-alerts", // nav item path
    ["experimental"] // array of tags
  ]
}
```

We currently support tags for `enterprise`, `preview` & `experimental`.

### Default sidebar category state

By default, all sidebar categories are shown as open on initial page load. You can affect the default open/closed state of any sidebar category by placing your category config within a tuple, similar to the technique above. The first element is the category configuration object, and the second element is a boolean. If the second element is `true`, that category will be collapsed by default.

```json
{
  "Release Policies": [
    {
      "Product launch stages": "/resources/product-launch-stages",
      "Elastic License v2 FAQ": "/resources/elastic-license-v2-faq"
    },
    true
  ]
}
```

### Redirect rules

Redirects can continue to be written in the `_redirects` file in the `docs/source` directory of each docset. These redirects can be written in the [Netlify redirects syntax](https://docs.netlify.com/routing/redirects/#syntax-for-the-redirects-file), but come with one catch. The `from` path must be relative to the root of the particular docset that the redirect pertains to, but the `to` path must be relative to the root of the `apollographql.com` domain. That means that the path you want to redirect the user to must include the `/docs` path prefix to redirect to a page in the docs.

```sh
# in the React docs _redirects file
/v2.4 /docs/react/v2/
```

All the redirects from each docset will be bundled together at build time, and deployed as one combined `_redirects` file deployed with the built docs site.

#### Redirecting with anchors

Netlify's `_redirects` file [doesn't handle redirecting URLs with `#`](https://answers.netlify.com/t/redirects-urls-containing-hashbangs/11157). Instead, we manually redirect URLs like this using custom logic in our `gatsby-config.js`. If you need to redirect from or to particular anchors tags, add the redirects to the `redirects` object in `gatsby-config.js`. For all other URLs, use the appropriate `_redirects` file.

## Publish and preview

This website gets rebuilt and deployed to Netlify every time something is committed to its default branch. Deploy previews are automatically created for new PRs.

"But what about changes to remote docsets?", I hear you say. Netlify doesn't let us configure a site to listen for changes in more than one repo.

### Production deploys

To work around this, we use GitHub Actions to trigger a new production deploy every time docs-related changes are made. To enable this behavior, add a publish workflow in your repo.

1. Go to the "Actions" tab in GitHub. If you already have workflows, click the "New workflow" button to get to the "Get started with GitHub Actions" page.
2. Scroll down to the "By Apollo GraphQL" section.
3. Find the "Docs Production Deploy Workflow" action and click the "Configure" button.

This will bring up a page where you can edit the workflow template. If your docset manages more than one version, add the version branches to the `branches` block in the workflow. Below is an example of a `docs-publish.yml` workflow:

```yaml
name: Deploy docs to production

on:
  push:
    branches:
      - main
      - version-2 # or whatever your version branch(es) are called
    paths:
      - docs/**

jobs:
  publish:
    uses: apollographql/docs/.github/workflows/publish.yml@main
    secrets:
      NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

This workflow references [a shared workflow hosted in this repo](./.github/workflows/publish.yml), so any changes that affect the way the action works will likely take place in that file, and you won't need to make any changes to the workflow in your own repo.

You will also need to configure the remote docset repo's access to the required organization secrets before you run the action. To do this, visit the "Action secrets" settings page in the Apollo GraphQL organization and update the `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` secrets to include the repo in the "Selected repositories" settings for each secret.

### Deploy previews

We also use Netlify to build and publish deploy previews for PRs that include docs changes. To set up deploy previews in any repo, add a `netlify.toml` file to the root of your repo, or update the one you have to look like this:

```toml
[build]
  ignore = "exit 0"

[build.environment]
  NODE_VERSION = "16"

[context.deploy-preview.build]
  base = "docs"
  ignore = "git diff --quiet $CACHED_COMMIT_REF $COMMIT_REF ."
  command = """\
  cd ../
  rm -rf monodocs
  git clone https://github.com/apollographql/docs --branch main --single-branch monodocs
  cd monodocs
  npm i
  cp -r ../docs local
  DOCS_LOCAL=true npm run build \
  """
  publish = "../monodocs/public"
```

This configures Netlify to:

- Ignore production builds (these are handled by Zapier).
- Set the Node.js version to 16 (and NPM v8)
- Ignore deploy previews without any docs changes
- Run a sequence of commands to build a deploy preview based on content from the OSS repo
- Set the publish directory to the built site

If your docset [manages multiple versions](#managing-versions), please make sure you've configured your version branches as [branch deploys](https://docs.netlify.com/site-deploys/overview/#branch-deploy-controls) in the Netlify UI. This will ensure that deploy previews get built for PRs based on either the default branch or a version branch.

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

#### Configuring the table of contents

We can configure which headings are shown in an individual page's table of contents by providing a `headingDepth` frontmatter property. By default, headings up to a depth of 3 (h1, h2, and h3) are shown.

```md
---
headingDepth: 4 # show headings up to h4
---
```

#### Showing a version indicator

Show a tag at the top of the article that indicates the version of the software that that article applies to by using the `minVersion` frontmatter.

```md
---
title: Fancy new feature
minVersion: 3.8.1
---
```

#### Prevent a page from being indexed by search engines

You can add the [`noindex`](https://developers.google.com/search/docs/crawling-indexing/block-indexing) tag to a page by using the `noIndex` frontmatter.

```md
---
title: Hidden preview feature
noIndex: true
---
```

### Linking

Links between docs articles should be written as relative paths. For example, if you wanted to link from the `schema/custom-scalars` article in the Apollo Server docs to the `getting-started` page at the root of the content directory, you would write:

```md
[get started](../getting-started)
```

Writing links using absolute paths, that is `/getting-started` will result in that link taking the user to `/docs/getting-started` in production, instead of `/docs/apollo-server/getting-started` as intended.

That being said, links between docsets can (and should) be made using absolute paths. Previously we had to link between other docsets using full URLs, that is `https://www.apollographql.com/docs/apollo-server`. Now those links can be written as `/apollo-server` and they'll benefit from the same snappy, instant, client-side routing behaviour that internal links get.

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

> [!NOTE]
> Gatsby does not currently support MDX v2 ([MDX v2 only uses ESM](https://mdxjs.com/migrating/v2/#esm), which [Gatsby does not yet support](https://github.com/gatsbyjs/gatsby/discussions/31599)), so make sure that the MDX syntax you are using when authoring in an `.mdx` file is compatible with MDX v1.

#### Shared content

MDX is also composable; it allows you to render other MDX files within as if it were a React component. One pattern we use when sharing MDX content is saving the shared bits in a folder outside the `docs/source` directory so that those files aren't rendered as pages in the docs site.

_shared/configure-project.mdx_

```mdx
1. Sign up for an Apollo account
2. Create a graph in GraphOS Studio
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

##### ButtonLink

A Chakra UI `Button` component that behaves as a link. These links follow the same [rules as writing Markdown links](#linking). Refer to the [Chakra docs](https://chakra-ui.com/docs/form/button) for more props that can affect the style and behavior of the button.

```mdx
<ButtonLink variant="outline" href="/apollo-server/v2">
  View older version
</ButtonLink>

<ButtonLink colorScheme="navy" href="./get-started">
  Get started
</ButtonLink>
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

Wrap TypeScript code blocks in a `MultiCodeBlock` component to automatically transpile them into JavaScript. A languages will be rendered as tabs above the code block for the user to switch between the two options. This feature works on code blocks tagged with `ts` or `tsx`.

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

A YouTube player exported from MDX Embed. Check out all the different props and options [on their docs](https://www.mdx-embed.com/?path=/docs/components-youtube--usage).

```mdx
Check out this introduction to GraphOS Studio:

<YouTube youTubeId="sarXMaz3OpY" />
```

##### TypeScriptApiBox

This component is currently only used in the Apollo Client docset. It takes a property name and renders auto-generated documentation created by running [TypeDoc](https://typedoc.org/) in the Apollo Client repo.

```mdx
## The `ApolloClient` constructor

<TypeScriptApiBox name="ApolloClient.constructor" />
```

##### MinVersion

Use this component to add a tag beside page headings indicating the version of the software that they apply to. This is meant to be used with headings, and using it in ways other than the method shown below will result in nothing happening.

```mdx
<MinVersion version="3.8.0">

### Dark mode

</MinVersion>
```

##### Release stage components

You should use the `<PreviewFeature />` and `<ExperimentalFeature />` components to call out features or products that are in [preview](https://www.apollographql.com/docs/resources/product-launch-stages/#preview) or are [experimental](https://www.apollographql.com/docs/resources/product-launch-stages/#experimental-features). Use these components at the top of the page or relevant section.

Both components take an optional `discordLink` prop through which you can provide the link to a relevant Discord channel. If there's isn't a relevant channel, you can omit the prop and it defaults to a generic link to Apollo Discord.

```mdx
# This Discord link brings folks to the channel about the @authorization directives.

<PreviewFeature discordLink="https://discord.com/channels/1022972389463687228/1148623262104965120" />
```

The components also take an optional `appendText` prop that adds text to the default text.

```mdx
<PreviewFeature appendText="This is some additional text appended to the end of the default text." />
```

If necessary, you can nest markdown within the component to completely replace the text.

```mdx
<ExperimentalFeature>

This completely replaces the text within the component.

</ExperimentalFeature>
```

##### Plan components

Currently, the only plan component is `<EnterpriseFeature />`.
Like the release stage components, this component should be put at the top of the relevant page or section.
If a feature has both a release stage component and the `<EnterpriseFeature />`, the `<EnterpriseFeature />` should come first.

Custom text for `<EnterpriseFeature />` can be provided by nesting Markdown within the component.

By default, without any children, `<EnterpriseFeature />` renders this text:

> **This feature is only available with a [**GraphOS Enterprise plan\*\*](http://apollographql.com/graphos/enterprise/). If your organization doesn't currently have an Enterprise plan, you can test this functionality by signing up for a free [Enterprise trial](https://studio.apollographql.com/signup?type=enterprise-trial&referrer=docs-content).

If you include custom text, it completely replaces this text. Please make sure to include links to the Enterprise plan docs and Enterprise trial accordingly.

```mdx
<EnterpriseFeature>

This is some custom markdown text that still includes a link to the [GraphOS Enterprise plan\*\*](http://apollographql.com/graphos/enterprise/) and [Enterprise trial](https://studio.apollographql.com/signup?type=enterprise-trial&referrer=docs-content) docs.

</EnterpriseFeature>
```

##### Admonitions

Admonitions are designed to catch readers' attention and break the flow of the text. They're helpful to make a piece of information stand out, but should be used wisely and sparingly. Use them only for information that shouldn't be missed.

We support the following admonition components:

- `<Caution>`
- `<Note>`
- `<Tip>`

You can use `<Caution>`, `<Note>`, and `<Tip>` components directly in `.mdx` pages like so:

```mdx
<Caution>

`<Caution>` admonitions generate anxiety. Never use them for anything other than highly important information which may cause serious issues if not acknowledged. Most of the time, prefer `<Note>`s.

</Caution>

<Note>

`<Note>` admonitions are the most common. You can generally use them whenever you find yourself starting a sentence with "_Note_,..." or "_Keep in mind_...".

Avoid using `<Note>`s directly one after another—condense notes if it makes sense.

</Note>

<Tip>

Use `<Tip>` admonitions for any particularly helpful advice or suggestions.

</Tip>
```

The above code block renders like so:

![Rendered admonitions](src/content/graphos/img/admonitions.jpg)

> [!TIP]
> Be sure to include two newlines between the admonition components and content and as shown in the examples above. MDX parsing for MDX v1 requires this extra separation between JSX and Markdown.

##### Tabs

Tabs enable context-specific content to be user-selectable and dynamically updatable within a page.

You can use tabs to present multiple options within a single step or section. A reader selects the option they're interested in, and the content is presented within the flow of the page. With prudent use of tabs, a reader can avoid scrolling over irrelevant content or navigating external links. For example, a guide that has unique prerequisites for different operating systems can have a single prerequisite section with a tab for each OS.

Using the `<Tabs>` component requires:

- Setting the `labels` array argument with the labels of all contained tabs.
- Nesting a `<Tab>` component for each contained tab, with its `label` argument set to match one of the `labels` of the parent `<Tabs>`.

For example:

```mdx
<Tabs labels={['one','two']}>

<Tab label="one">
Body of tab labeled one.
</Tab>

<Tab label="two">
Body of tab labeled two.
</Tab>

</Tabs>
```

## Content linting

The docs repository automatically lints pull requests via a [GitHub action](.github/workflows/content-lint.yml) that uses [Vale](https://vale.sh/), an open-source content linter. Vale checks `.md` and `.mdx` files against [style rules](https://vale.sh/docs/topics/styles/) imported from Google, Microsoft, and other developer documentation style guides. It also includes custom Apollo style rules. All styles are in the [`styles` directory](styles). Most rules are self-explanatory or include links to resources to help understand what to fix.

#### Running Vale locally

You can run Vale locally to catch and fix issues during local development.

To install:

```bash
brew install vale
```

To lint:

```bash
vale <path/to/file-or-directory>
```

### Style rule evolution

As we refine and evolve our style guidelines, you may see the need to add, update, or delete style rules. See Vale's [styles documentation](https://vale.sh/docs/topics/styles/) for guidance and feel free to submit a PR.

The most common adjustments will be for spell and case checking. You can add terms to recognize in the [`accept.txt`](styles/config/vocabularies/Docs/accept.txt) file and terms with suggested substitutions in [`/styles/Apollo/Wordlist.yml`](styles/Apollo/WordList.yml).

### Locally disabling rules

In some cases, you may need to intentionally ignore a rule. For example, you may need to turn off the [`Apollo.Headings`](styles/Apollo/Headings.yml) rule that checks that headings use sentence case to exceptionally capitalize a word.

In these cases, you can locally disable the rule for a portion of text by surrounding it with comments like this:

```
<!-- vale Apollo.Headings = NO -->

### This header needs an Uppercase word

<!-- vale Apollo.Headings = YES -->

```

Replace `Apollo.Headings` with the name of the rule you need to turn off.

## History

Previous to this system, we built our docs site by building each repo's docs individually using a [shared Gatsby theme](https://github.com/apollographql/gatsby-theme-apollo/). Each site would be deployed to Netlify and "stitched" together to make one continuous website using Netlify path rewrites like this:

```
/docs/ios/* https://apollo-ios-docs.netlify.app/:splat 200!
/docs/react/* https://apollo-client-docs.netlify.app/:splat 200!
```

> [!NOTE]
> All our path rewriting happens in the [website router](https://github.com/apollographql/website-router) repo.

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

### Impact

Using the old infrastructure, we were spending a lot of time building our docs. Because each library repo was tied to its own Netlify site, that site would redeploy any time any commit was pushed to its default branch. In other words, changes that didn't affect the docs were still triggering builds. This resulted in much more building than necessary.

#### Netlify build stats (Feb 1 - Feb 24, 2022)

| Site                          | Builds | Average time | Total time |
| ----------------------------- | ------ | ------------ | ---------- |
| apollo-federation-docs        | 424    | 4m 55s       | 2,084m     |
| apollo-client-docs            | 237    | 8m 21s       | 1,979m     |
| apollo-router-docs            | 437    | 2m 21s       | 1,027m     |
| apollo-ios-docs               | 213    | 3m 41s       | 784m       |
| **New docs infra :sparkles:** | _94_   | _7m 30s_     | _705m_     |
| apollo-server-docs            | 140    | 4m 34s       | 638m       |
| apollo-android-docs           | 111    | 4m 30s       | 499m       |
| apollo-cli-docs               | 87     | 2m 6s        | 182m       |
| studio-docs                   | 44     | 3m 11s       | 139m       |
| apollo-docs-index             | 38     | 3m 4s        | 116m       |
| **Total**                     | 1,825  | N/A          | 8,153m     |

During this period, the new docs took less time to build the entirety of our docs than the Apollo Client docs took to build just itself. It built 94 times, and each build was directly related to a change in the docs UI or content. We can't say the same for the other 1,731 combined builds that happened across other docsets.

I believe this represents an opportunity to cut down the amount of Netlify build time we spend on the docs, and as a result save us some cost in that area.

## Notable changes to authoring patterns

Most of the ways that content authoring works in our docs stays the same with this change, with a few exceptions:

### No more component imports

Previously, we would import components like `ExpansionPanel` and `CodeColumns` from `gatsby-theme-apollo-docs` in our MDX files. Now, [all components](#components) are automatically available without importing.

```diff
- import {ExpansionPanel} from 'gatsby-theme-apollo-docs';

<ExpansionPanel>

Hidden content in here

</ExpansionPanel>
```

In addition, we used to use the `Button` component from `@apollo/space-kit` in some places. Now a [`Button` component](#button) is available in all MDX pages. Here's an example comparing the old way of using buttons to the new way:

```diff
- import {Button} from '@apollo/space-kit';
- import {colors} from 'gatsby-theme-apollo-core';
import {Link} from 'gatsby';

<Button
-  color={colors.primary}
-  as={<Link to="./get-started" />}
+  colorScheme="navy"
+  as={Link}
+  to="./get-started"
>
  Click me
</Button>
```

### Code block titles and line highlighting

Line highlighting (`{x-y}`) and title attributes used to be supplied in one continuous string attached to the language tag on a code block. Now they must be added with space between each property. The title must be wrapped in quotes, and the colon before `title` can be removed.

````diff
- ```js{3-5}:title=index.js
+ ```js {3-5} title="index.js"
const num = 123;
```
````

More info about code blocks [here](#code-blocks).

### Internal links

Previously, links within a docset could be written as absolute paths, that is `/get-started`. Now, all internal links should be written as relative paths, that is `./get-started` or `../get-started`, depending on where the destination page lives relative to the page it's being linked from.

More information about linking [here](#linking).

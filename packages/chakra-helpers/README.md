# Apollo Chakra UI helpers

This package contains Chakra UI theme options that are shared between DX properties. This makes it easy to set up a theme with consistent color palettes, fonts, and component styles.

- [Installation](#installation)
- [Usage](#usage)
  - [Color palettes](#color-palettes)
  - [Footer configuration](#footer-configuration)
  - [EmbeddableExplorer](#embeddableexplorer)

## Installation

This package has peer dependencies on `@apollo/space-kit` and `@chakra-ui/react`. Make sure those packages are already installed in your project, and then install this package.

```bash
npm i @apollo/chakra-helpers
```

## Usage

The easiest way to set up Chakra UI in a Gatsby website is by using the `@chakra-ui/gatsby-plugin` package.

```js
// gatsby-config.js
module.exports = {
  plugins: ["@chakra-ui/gatsby-plugin"],
};
```

Next, use Gatsby component shadowing to shadow the default `theme.js` file in the plugin. Use the `extendTheme` function to override default Chakra theme values and export your new theme.

```js
// src/@chakra-ui/gatsby-plugin/theme.js
import { fonts, components } from "@apollo/chakra-helpers";
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts,
  components,
});

export default theme;
```

### Color palettes

This package also provides two functions for creating Chakra UI color palettes from Space Kit ones.

[Space Kit's color palettes](https://github.com/apollographql/space-kit/blob/main/src/colors/colors.ts#L1-L12) use names ranging from `lightest` to `darkest` and contain five colors for monochrome palettes and seven colors for all other colors. Chakra UI, on the other hand, features [palettes with 10 numerical variants](https://github.com/chakra-ui/chakra-ui/blob/main/packages/theme/src/theme.types.ts#L31-L42) ranging from `50` to `900`.

To account for these differences, we need to mix Space Kit colors to fill in the gaps between different numerical keys in their corresponding Chakra palettes.

```js
import { colors } from "@apollo/space-kit/colors";
import { createGrayPalette, createColorPalette } from "@apollo/chakra-helpers";

const { silver, grey, midnight, indigo } = colors;

const theme = extendTheme({
  colors: {
    gray: createGrayPalette(silver, grey, midnight),
    indigo: createColorPalette(indigo),
  },
});
```

### Footer configuration

This package exports an object that helps configure footers on all Apollo properties. Each category contains a title field and an array of link objects with their own titles and URLs.

```js
// Footer.js
import {footerConfig} from '@apollo/chakra-helpers';

export default function Footer() {
  return (
    <nav>
      {footerConfig.map(({links, title}, index) => (
        <ul key={index}>
          {links.map((link, index) => (
            <li key={index}>
              <a href={link.href}>{link.text}</a>
            </li>
          )}
        </ul>
      )}
    </nav>
  )
}
```

This package also exports the individual parts that make up the default `footerConfig`. These can be composed together to create your own custom footers.

```js
import {
  communityCategory,
  companyCategory,
  helpCategory,
  productCategory,
  whyApolloCategory
} from '@apollo/chakra-helpers/lib/footer';

const customFooterConfig = [
  communityCategory,
  helpCategory,
  whyApolloCategory
];
```

For your convenince, there are also exported `Category` and `Link` interfaces for type safety and intellisense in TypeScript projects.

```ts
import {Category, Link} from '@apollo/chakra-helpers/lib/footer';

const customLink: Link = {
  title: "A Custom Link",
  href: "https://www.acustomlink.com"
};

const customCategory: Category = {
  title: "My Custom Category",
  links: [customLink]
}
```

### EmbeddableExplorer

You can embed Apollo Studio Explorer in your Chakra sites using this component. It respects the selected color mode in your app.

```js
import {EmbeddableExplorer} from '@apollo/chakra-helpers';

<EmbeddableExplorer />
```

The component can be configured using the following props. No props are required to use this component, and it default to serving up the Apollo fullstack demo API with an example query.

| Name        | Type   | Description                                                                           | Default value                                       |
| ----------- | ------ | ------------------------------------------------------------------------------------- | --------------------------------------------------- |
| graphRef    | string | The graph ref for the **public** variant you want to use the embedded Explorer with   | Apollo-Fullstack-Demo-o3tsz8@current                |
| endpointUrl | string | The endpoint URL of the **public** variant you want to use the embedded Explorer with | https://apollo-fullstack-tutorial.herokuapp.com/    |
| document    | string | A URI-encoded operation to populate in the Explorer's editor on load.                 | See [the source code](./src/EmbeddableExplorer.tsx) |

## Publishing changes

We use [Changesets](https://github.com/changesets/changesets) to automate the publishing of new versions of this package to the NPM registry.

To publish a new version, first add a changeset to your PR using `npx changeset add`. Follow the prompts in your terminal to select the version bump for this release, and add a message describing what is being changed.

After this PR gets merged to main, a new PR will be opened automatically that increments the package version. When this PR is merged, [a GitHub action](../../.github/workflows/release-pr.yml) will be run that publishes the package to NPM.

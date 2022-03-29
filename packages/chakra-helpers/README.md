# Apollo Chakra UI helpers

This package contains Chakra UI theme options that are shared between DX properties. This makes it easy to set up a theme with consistent color palettes, fonts, and component styles.

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

### Global Nav Links

This package exports these objects to create a single source of truth for the links in the footers of all Apollo properties. Each contain a category title field, and an array of link objects with their own titles and hrefs.

```
communityCategory,
companyCategory,
helpCategory,
productCategory,
whyApolloCategory,
defaultConfig
```

Example usage:

```js
// Footer.js
import PropTypes from 'prop-types';
import React from 'react';
import {ReactComponent as ApolloLogo} from '@apollo/space-kit/logos/logo.svg';
import {
  Box,
  Flex,
  Heading,
  Link,
  List,
  ListItem,
  SimpleGrid,
  Text
} from '@chakra-ui/react';
import {defaultConfig} from '@apollo/chakra-helpers';

export default function Footer({navConfig = defaultConfig}) {
  return (
    <SimpleGrid
      as="footer"
      columns={[1, 2, 3, 4]}
      spacing={{base: 6, md: 8}}
      borderTopWidth="1px"
      px="10"
      py="12"
    >
      <div>
        <Flex mb="2">
          <a href="https://www.apollographql.com">
            <Box as={ApolloLogo} fill="current" h="8" />
          </a>
        </Flex>
        <Text>&copy; Apollo Graph Inc.</Text>
      </div>
      {navConfig.map(({links, title}, index) => (
        <div key={index}>
          <Heading mb="2" size="md">
            {title}
          </Heading>
          <List spacing="1">
            {links.map(({href, text}, index) => (
              <ListItem key={index}>
                <Link href={href}>{text}</Link>
              </ListItem>
            ))}
          </List>
        </div>
      ))}
    </SimpleGrid>
  );
}

Footer.propTypes = {
  navConfig: PropTypes.object
};
```

For your convenince, there are also exported `Category` and `Link` interfaces for type safety and intellisense. 

example config:

```ts
// customConfig.ts
const customCategory: Category = {
  title: "My Custom Category",
  links: [
    {
      title: "A Custom Link",
      href: "https://www.acustomlink.com"
    }
  ]
}
```

or:

```ts
// customConfig.js
const customCategory = {
  title: "My Custom Category",
  links: [
    {
      title: "A Custom Link",
      href: "https://www.acustomlink.com"
    }
  ]
}
```
import React from 'react';
import {ReactComponent as ApolloLogo} from '@apollo/icons/logos/LogoType.svg';
import {
  Box,
  Flex,
  Stack,
  Heading,
  Link,
  List,
  ListItem,
  SimpleGrid,
  Text
} from '@chakra-ui/react';

const companyCategory = {
  title: 'Company',
  links: [
    {
      text: 'About Apollo',
      href: 'https://www.apollographql.com/about-us'
    },
    {
      text: 'Careers',
      href: 'https://www.apollographql.com/careers'
    },
    {
      text: 'Partners',
      href: 'https://www.apollographql.com/partners'
    }
  ]
};
const resourceCategory = {
    title: 'Resources',
    links: [
      {
        text: 'Blog',
        href: 'https://blog.apollographql.com'
      },
      {
        text: 'Tutorials',
        href: 'https://www.apollographql.com/tutorials'
      },
      {
        text: 'Content Library',
        href: 'https://www.apollographql.com/resources'
      }
    ]
};
const helpCategory = {
  title: 'Get in touch',
  links: [
    {
      text: 'Contact Sales',
      href: 'https://www.apollographql.com/contact-sales'
    },
    {
      text: 'Contact Support',
      href: 'https://www.apollographql.com/support'
    }
  ]
};

const footerConfig = [
  companyCategory,
  resourceCategory,
  helpCategory,
]

export default function Footer() {
  return (
    <SimpleGrid
      as="footer"
      minChildWidth="100px"
      spacing={{base: 6, md: 8}}
      borderTopWidth="1px"
      px="12"
      py="12"
    >
      <Stack>
          <Link target="_blank" href="https://www.apollographql.com">
            <Box
              as={ApolloLogo}
              aria-label="apollo-logo"
              fill="current"
              h="8"
            />
          </Link>
        <Text >&copy; {new Date().getFullYear()} Apollo Graph Inc.</Text>
        <Link target="_blank" href="https://www.apollographql.com/privacy-policy">Privacy Policy</Link>
      </Stack>
      <Stack
        direction={{
          base: "column",
          md: "row",
        }}
        align="flex-start"
        spacing={[6, 8, 10, 12]}
        ml="auto"
      >
      {footerConfig.map(({links, title}, index) => (
        <Box key={index} minWidth="130px">
          <Heading mb="2" size="md">
            {title}
          </Heading>
          <List spacing="1" fontSize="lg">
            {links.map(({href, text}, index) => (
              <ListItem key={index}>
                <Link href={href} target="_blank">{text}</Link>
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
      </Stack>
    </SimpleGrid>
  );
}

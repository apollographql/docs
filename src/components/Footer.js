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
import {footerConfig} from '@apollo/chakra-helpers';

export default function Footer() {
  return (
    <SimpleGrid
      as="footer"
      minChildWidth="150px"
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
      {footerConfig.map(({links, title}, index) => (
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

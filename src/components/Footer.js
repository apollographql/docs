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
import {
  communityCategory,
  companyCategory,
  helpCategory,
  productCategory
} from '@apollo/chakra-helpers';

export default function Footer({
  navConfig = [
    communityCategory,
    companyCategory,
    helpCategory,
    productCategory
  ]
}) {
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
            {links.map(({href, text, internal}, index) => (
              <ListItem key={index}>
                <Link href={href} isExternal={!internal}>
                  {text}
                </Link>
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

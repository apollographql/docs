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

// const Resources = {
//   'GraphQL Tutorials': 'https://odyssey.apollographql.com',
//   Docs: 'https://www.apollographql.com/docs',
//   Blog: 'https://www.apollographql.com/blog',
//   'Developer Hub': 'https://www.apollographql.com/developers',
//   Community: 'https://community.apollographql.com'
// };

// const Company = {
//   'About Apollo': 'https://www.apollographql.com',
//   Careers: 'https://www.apollographql.com/careers',
//   Team: 'https://www.apollographql.com/team',
//   Studio: 'https://studio.apollographql.com',
//   Twitter: 'https://twitter.com/apollographql'
// };

// const Help = {
//   'Contact an Expert': 'https://www.apollographql.com/contact-sales',
//   'Get Support': 'https://www.apollographql.com/support',
//   'Website Terms of Service':
//     'https://www.apollographql.com/Apollo-Website-Terms-of-Service.pdf',
//   'Product Terms of Service':
//     'https://www.apollographql.com/Apollo-Terms-of-Service.pdf',
//   'Privacy Policy': 'https://www.apollographql.com/privacy-policy'
// };

const categories = [
  helpCategory,
  communityCategory,
  companyCategory,
  productCategory
];

export default function Footer({navConfig = {Resources, Company, Help}}) {
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
      {/* {Object.entries(navConfig).map(([label, items], index) => (
        <div key={index}>
          <Heading mb="2" size="md">
            {label}
          </Heading>
          <List spacing="1">
          {Object.entries(items).map(([label, url], index) => (
            <ListItem key={index}>
            <Link href={url}>{label}</Link>
            </ListItem>
            ))}
            </List>
            </div>
          ))} */}
      {categories.map(({links, title}, index) => (
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

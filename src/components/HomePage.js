import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  Flex,
  Grid,
  HStack,
  Heading,
  IconButton,
  Link,
  SimpleGrid,
  Text,
  useToken
} from '@chakra-ui/react';
import {FiArrowRight} from 'react-icons/fi';
import {Link as GatsbyLink} from 'gatsby';
import {PrimaryLink} from './RelativeLink';

export function Odyssey() {
  const lightGradient = useToken('colors', ['blue.100', 'indigo.300']);
  const darkGradient = useToken('colors', ['indigo.400', 'indigo.500']);
  return (
    <Grid
      gap={{base: 6, lg: 10}}
      templateColumns={{lg: '1fr auto'}}
      alignItems="center"
      rounded="lg"
      p="6"
      bgImage={`linear-gradient(${['to right', ...lightGradient]})`}
      _dark={{
        bgImage: `linear-gradient(${['to right', ...darkGradient]})`
      }}
    >
      <div>
        <Text fontSize="lg">
          <strong>Welcome!</strong> 👋 Our learning platform, Odyssey, provides{' '}
          <strong>interactive tutorials</strong> with videos and code challenges
          to help you launch your journey with GraphQL and Apollo.
        </Text>
      </div>
      <div>
        <Button
          as="a"
          href="https://www.apollographql.com/tutorials"
          colorScheme="indigo"
          rightIcon={<FiArrowRight />}
        >
          Explore Tutorials
        </Button>
      </div>
    </Grid>
  );
}

export const DocsetGrid = props => (
  <SimpleGrid spacing="4" minChildWidth="250px" {...props} />
);

export const CTA_LEARN = 'Learn about %s';

export function Docset({
  title,
  children,
  description,
  path,
  icon,
  cta = 'Explore %s docs'
}) {
  return (
    <Flex align="flex-start" p="6" rounded="md" borderWidth="1px">
      <Flex align="flex-start" direction="column" h="full">
        <Heading as="h3" size="lg" mb="4">
          <HStack spacing="3">
            {icon}
            <span>{title}</span>
          </HStack>
        </Heading>
        {description && <Text mb="4">{description}</Text>}
        <PrimaryLink mt="auto" fontWeight="semibold" as={GatsbyLink} to={path}>
          {cta.replace('%s', title)}
        </PrimaryLink>
      </Flex>
      {children}
    </Flex>
  );
}

Docset.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  path: PropTypes.string.isRequired,
  cta: PropTypes.string,
  icon: PropTypes.element,
  children: PropTypes.node
};

export const CommunityButton = props => (
  <IconButton as={Link} fontSize="larger" isExternal {...props} />
);

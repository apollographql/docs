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
  useColorModeValue,
  useToken
} from '@chakra-ui/react';
import {FiArrowRight} from 'react-icons/fi';
import {Link as GatsbyLink} from 'gatsby';
import {PrimaryLink} from './RelativeLink';

export function Odyssey() {
  const shade = useColorModeValue(50, 600);
  const gradient = useToken('colors', [`blue.${shade}`, `indigo.${shade}`]);
  return (
    <Grid
      gap={{base: 6, lg: 10}}
      templateColumns={{lg: '1fr auto'}}
      alignItems="center"
      rounded="lg"
      p="6"
      bgImage={`linear-gradient(${['to right', ...gradient]})`}
    >
      <div>
        <Heading as="h3" size="md" mb="2">
          Looking for a guided, interactive experience?
        </Heading>
        <Text fontSize="md">
          Our learning platform, <strong>Odyssey</strong>, is the perfect place
          to start your journey and learn GraphQL with videos and interactive
          code challenges.
        </Text>
      </div>
      <div>
        <Button
          as="a"
          href="https://www.apollographql.com/tutorials"
          colorScheme="indigo"
          rightIcon={<FiArrowRight />}
        >
          Try Apollo Odyssey
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

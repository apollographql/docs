import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  Flex,
  Grid,
  Heading,
  IconButton,
  Link,
  SimpleGrid,
  Text,
  useColorModeValue,
  useToken
} from '@chakra-ui/react';
import {ColorLink} from './RelativeLink';
import {FiArrowRight} from 'react-icons/fi';
import {Link as GatsbyLink} from 'gatsby';

export function Odyssey() {
  const shade = useColorModeValue(50, 700);
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
          Our learning platform, Odyssey, is the perfect place to start your
          journey and learn GraphQL with videos and interactive code challenges.
        </Text>
      </div>
      <div>
        <Button
          as="a"
          href="https://odyssey.apollographql.com"
          target="_blank"
          rel="noopener noreferrer"
          colorScheme="indigo"
          rightIcon={<FiArrowRight />}
        >
          Try Apollo Odyssey
        </Button>
      </div>
    </Grid>
  );
}

export function DocsetGrid(props) {
  return <SimpleGrid spacing="4" minChildWidth="250px" {...props} />;
}

export const CTA_LEARN = 'Learn about %s';

export function Docset({
  title,
  children,
  description,
  path,
  cta = 'Explore %s docs'
}) {
  return (
    <Flex align="flex-start" p="6" rounded="md" borderWidth="1px">
      <Flex direction="column" h="full">
        <Heading as="h3" size="lg" mb="4">
          {title}
        </Heading>
        <Text mb="4">{description}</Text>
        <ColorLink mt="auto" fontWeight="semibold" as={GatsbyLink} to={path}>
          {cta.replace('%s', title)}
        </ColorLink>
      </Flex>
      {children}
    </Flex>
  );
}

Docset.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  cta: PropTypes.string,
  children: PropTypes.node
};

export function CommunityButton(props) {
  return <IconButton as={Link} fontSize="larger" isExternal {...props} />;
}

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
import {FiArrowRight, FiExternalLink} from 'react-icons/fi';
import {PrimaryLink as Link} from './RelativeLink';

export function GradientCard ({icon, title, description, path, cta}) {
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
      <Heading as="h3" size="lg" mb="4">
          <HStack spacing="3">
            {icon}
            <span>{title}</span>
          </HStack>
        </Heading>
        <Text fontSize="lg">
          {description}
        </Text>
      </div>
      <div>
        <Button
          as="a"
          href={path}
          colorScheme="indigo"
          leftIcon={/^https:\/\//.test(path) ? ( <FiExternalLink /> ) : ( <FiArrowRight />)}
        >
          {cta}
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
  const linkIcon = /^https:\/\//.test(path) ? (
    <FiExternalLink />
  ) : (
    <FiArrowRight />
  );
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
        <Button
          variant="link"
          _dark={{
            color: 'indigo.100'
          }}
          mt="auto"
          fontWeight="semibold"
          fontSize="lg"
          as={Link}
          to={path}
          leftIcon={linkIcon}
        >
          {cta.replace('%s', title)}
        </Button>
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

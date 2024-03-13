import PropTypes from 'prop-types';
import React from 'react';
import {ArrowRightIcon} from './Icons';
import {ButtonLink} from './RelativeLink';
import {
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

export function GradientCard({icon, title, description, path, cta}) {
  const lightGradient = useToken('colors', ['blue.100', 'navy.300']);
  const darkGradient = useToken('colors', ['navy.400', 'navy.500']);
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
        <Text fontSize="lg">{description}</Text>
      </div>
      <div>
        <ButtonLink
          href={path}
          colorScheme="navy"
          fontSize="lg"
          leftIcon={<ArrowRightIcon />}
        >
          {cta}
        </ButtonLink>
      </div>
    </Grid>
  );
}

export const DocsetGrid = props => (
  <SimpleGrid spacing="4" minChildWidth="250px" {...props} />
);

export function Docset({
  title,
  children,
  description,
  path,
  icon,
  cta = 'Explore %s docs'
}) {
  return (
    <Flex
      align="flex-start"
      p="6"
      rounded="md"
      borderWidth="1px"
      overflow="auto"
    >
      <Flex align="flex-start" direction="column" h="full" maxWidth="100%">
        <Heading as="h3" size="lg" mb="4">
          <HStack spacing="3">
            {icon}
            <span>{title}</span>
          </HStack>
        </Heading>
        {description && <Text mb="4">{description}</Text>}
        <ButtonLink
          variant="link"
          color="tertiary"
          textDecor="underline"
          fontWeight="normal"
          fontSize="inherit"
          _hover={{color: 'link'}}
          mt="auto"
          href={path}
          whiteSpace="normal"
          leftIcon={<ArrowRightIcon />}
        >
          {cta.replace('%s', title)}
        </ButtonLink>
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

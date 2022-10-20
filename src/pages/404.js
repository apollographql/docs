import Footer from '../components/Footer';
import Header from '../components/Header';
import React from 'react';
import {Button, Flex, Heading, Text, chakra} from '@chakra-ui/react';
import {FiChevronLeft} from 'react-icons/fi';
import {Link as GatsbyLink} from 'gatsby';
import {GatsbySeo} from 'gatsby-plugin-next-seo';

export default function NotFound() {
  return (
    <>
      <GatsbySeo title="Not found" />
      <Header />
      <Flex
        textAlign="center"
        maxW="container.sm"
        mx="auto"
        align="center"
        direction="column"
        px="10"
        pt="12"
        pb="16"
      >
        <chakra.h1
          fontWeight="semibold"
          lineHeight="normal"
          fontSize={{base: '8xl', md: '9xl'}}
        >
          404
        </chakra.h1>
        <Heading mb="2">Houston, something went wrong on our end</Heading>
        <Text mb="6">
          Don&apos;t worry! This is completely on us. Let&apos;s get you back on
          your journey.
        </Text>
        <Button
          as={GatsbyLink}
          to="/"
          colorScheme="indigo"
          leftIcon={<FiChevronLeft />}
        >
          Back to home
        </Button>
      </Flex>
      <Footer />
    </>
  );
}

import React from "react";
import { Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { Link as GatsbyLink } from "gatsby";
import { PrimaryLink } from "../RelativeLink";

export const Grid = (props) => <SimpleGrid spacing="4" minChildWidth="250px" {...props} />;

export function GridItem({ title, children, path, cta = "Learn More: %s" }) {
  return (
    <Flex align="flex-start" p="6" rounded="md" borderWidth="1px">
      <Flex align="flex-start" direction="column" h="full">
        <Heading as="h3" size="md" mb="4">
          <span>{title}</span>
        </Heading>
        <Text mb="4">{children}</Text>
        <PrimaryLink mt="auto" fontWeight="semibold" as={GatsbyLink} to={path}>
          {cta.replace("%s", title)}
        </PrimaryLink>
      </Flex>
    </Flex>
  );
}

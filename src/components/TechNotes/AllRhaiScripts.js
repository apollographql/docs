import React, { useState, useMemo } from "react";
import { Link as GatsbyLink } from "gatsby";
import {
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputLeftAddon,
  Stack,
  Flex,
  Box,
  Heading,
  Text,
  Tag,
  HStack,
} from "@chakra-ui/react";
import { CodeBlock } from "@apollo/chakra-helpers";
import { PrimaryLink } from "../RelativeLink";
import ExpansionPanel from "../ExpansionPanel";
import { v4 } from "uuid";
import rhaiScriptsIndex from "../../content/technotes/rhai_scripts_index.yml";

// Assign a unique id to each script for use as a key in the map
const rhaiScriptsWithIds = rhaiScriptsIndex.rhai_scripts.map((script) => ({ ...script, id: v4() }));
// Get a list of unique tags and the number of scripts in that tag
const allTags = rhaiScriptsWithIds.reduce((obj, script) => {
  const newObj = { ...obj };
  script.tags.forEach((tag) => {
    if (newObj[tag]) {
      newObj[tag] = newObj[tag] + 1;
    } else {
      newObj[tag] = 1;
    }
  });
  return newObj;
}, {});

const AllRhaiScripts = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredScripts = useMemo(
    () =>
      rhaiScriptsWithIds.filter(
        (script) =>
          script.name?.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1 ||
          script.description?.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1 ||
          script.more?.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1 ||
          script.code_file_name?.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1 ||
          script.content?.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1 ||
          script.tags?.some((tag) => `#${tag}` === searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  return (
    <>
      <FormControl>
        <Flex w="100%">
          <Box flex="1">
            <InputGroup size="sm">
              <InputLeftAddon>
                <FormLabel m="0">Search</FormLabel>
              </InputLeftAddon>
              <Input placeholder="Query..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </InputGroup>
          </Box>
        </Flex>
      </FormControl>
      <HStack>
        {Object.keys(allTags)?.map((tagName) => (
          <Tag key={tagName} size="sm" cursor={"pointer"} onClick={() => setSearchQuery(`#${tagName}`)}>
            {tagName} ({allTags[tagName]})
          </Tag>
        ))}
      </HStack>
      {filteredScripts.map((script) => (
        <Flex key={script.id} align="flex-start" p="6" rounded="md" borderWidth="1px">
          <Stack w={"100%"}>
            <Flex align="center" justify={"space-between"}>
              <Heading as="h3" size="md">
                <span>{script.name}</span>
              </Heading>
              <HStack>
                {script.tags?.map((tag, index) => (
                  <Tag key={index} size="sm" cursor={"pointer"} onClick={() => setSearchQuery(`#${tag}`)}>
                    {tag}
                  </Tag>
                ))}
              </HStack>
            </Flex>

            <Text mb="4">{script.description}</Text>
            <Text>
              <PrimaryLink mt="auto" fontWeight="semibold" as={GatsbyLink} to={script.more}>
                More Info
              </PrimaryLink>{" "}
            </Text>
            <ExpansionPanel title="Click to view code">
              <CodeBlock
                title={script.code_file_name}
                code={script.content}
                showLineNumbers="true"
                language="rhai"
              ></CodeBlock>
            </ExpansionPanel>
          </Stack>
        </Flex>
      ))}
    </>
  );
};

export default AllRhaiScripts;

import PropTypes from "prop-types";
import React from "react";
import { PrimaryLink } from "../RelativeLink";
import moment from "moment";
import { Stack, Flex, Text, Tag, HStack } from "@chakra-ui/react";
import { Link as GatsbyLink } from "gatsby";

const getBrowserCompatibleDate = (note) => {
  // The date string here look like "2022-11-01 16:39:41 -0400"
  // This is not valid in Safari, so we are just splitting and selecting the date part
  // since the time and timezone offset are not needed
  const gitLogDate = note.fields?.gitLogLatestDate ?? "";
  const simpleDate = gitLogDate.split(" ")[0] ?? Date.now();
  return moment(simpleDate).format("YYYY-MM-DD");
};

export function NotesList({ notes, setCurrentTag, skinnyMode }) {
  return (
    <>
      {notes.map((note) => (
        <Flex key={note.childMdx.id} align="flex-start" p="6" rounded="md" borderWidth="1px" mb="12px !important">
          <Stack w={"100%"}>
            <Flex
              align={skinnyMode ? "left" : "center"}
              justify={"space-between"}
              flexDirection={skinnyMode ? "column" : "row"}
            >
              <PrimaryLink as={GatsbyLink} to={note.childMdx.fields.slug}>
                {note.childMdx.frontmatter.title}
              </PrimaryLink>

              <HStack>
                {note.childMdx.frontmatter.tags?.map((tag, index) => (
                  <Tag
                    key={index}
                    size="sm"
                    cursor={setCurrentTag ? "pointer" : "inherit"}
                    whiteSpace={"nowrap"}
                    onClick={() => setCurrentTag && setCurrentTag(tag)}
                  >
                    {tag}
                  </Tag>
                ))}
              </HStack>
            </Flex>

            <Text mb="4" fontSize="md" noOfLines={skinnyMode ? 2 : 3}>
              {note.childMdx.frontmatter.summary}
            </Text>
            <Text fontSize="sm">
              {note.childMdx.timeToRead} minute(s) read &bull; Published{" "}
              {moment(note.childMdx.frontmatter.published).format("YYYY-MM-DD")} &bull; Last updated{" "}
              {getBrowserCompatibleDate(note)}
            </Text>
          </Stack>
        </Flex>
      ))}
    </>
  );
}

NotesList.propTypes = {
  notes: PropTypes.array.isRequired,
};

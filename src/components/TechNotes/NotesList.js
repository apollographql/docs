import PropTypes from "prop-types";
import React from "react";
import { PrimaryLink } from "../RelativeLink";
import moment from "moment";
import { Stack, Flex, Text, Tag, HStack, Box, Table, Thead, Tbody, Th, Tr, Td, Link } from "@chakra-ui/react";
import { Link as GatsbyLink } from "gatsby";
import { SORT_OPTIONS } from "./AllNotes";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const getBrowserCompatibleDate = (note) => {
  // The date string here look like "2022-11-01 16:39:41 -0400"
  // This is not valid in Safari, so we are just splitting and selecting the date part
  // since the time and timezone offset are not needed
  const gitLogDate = note.fields?.gitLogLatestDate ?? "";
  const simpleDate = gitLogDate.split(" ")[0] ?? Date.now();
  return moment(simpleDate).format("YYYY-MM-DD");
};

export function NotesList({ notes, setCurrentTag, sort, setSort }) {
  return (
    <Box width={"100%"} overflowX={"auto"}>
      <Table className="notesList">
        <Thead>
          <Th>
            {sort === SORT_OPTIONS.ALPHABETICAL_ASC && (
              <PrimaryLink as={Link} onClick={() => setSort(SORT_OPTIONS.ALPHABETICAL_DESC)}>
                <Flex alignItems={"center"} gap={1}>
                  Note <FaArrowUp />
                </Flex>
              </PrimaryLink>
            )}
            {sort === SORT_OPTIONS.ALPHABETICAL_DESC && (
              <PrimaryLink as={Link} onClick={() => setSort(SORT_OPTIONS.ALPHABETICAL_ASC)}>
                <Flex alignItems={"center"} gap={1}>
                  Note <FaArrowDown />
                </Flex>
              </PrimaryLink>
            )}
            {sort !== SORT_OPTIONS.ALPHABETICAL_ASC && sort !== SORT_OPTIONS.ALPHABETICAL_DESC && (
              <PrimaryLink as={Link} onClick={() => setSort(SORT_OPTIONS.ALPHABETICAL_ASC)}>
                Note
              </PrimaryLink>
            )}
          </Th>
          <Th>
            {sort === SORT_OPTIONS.PUBLISHED_ASC && (
              <PrimaryLink as={Link} onClick={() => setSort(SORT_OPTIONS.PUBLISHED_DESC)}>
                <Flex alignItems={"center"} gap={1}>
                  Published <FaArrowUp />
                </Flex>
              </PrimaryLink>
            )}
            {sort === SORT_OPTIONS.PUBLISHED_DESC && (
              <PrimaryLink as={Link} onClick={() => setSort(SORT_OPTIONS.PUBLISHED_ASC)}>
                <Flex alignItems={"center"} gap={1}>
                  Published <FaArrowDown />
                </Flex>
              </PrimaryLink>
            )}
            {sort !== SORT_OPTIONS.PUBLISHED_ASC && sort !== SORT_OPTIONS.PUBLISHED_DESC && (
              <PrimaryLink as={Link} onClick={() => setSort(SORT_OPTIONS.PUBLISHED_ASC)}>
                Published
              </PrimaryLink>
            )}
          </Th>
          <Th>
            {sort === SORT_OPTIONS.UPDATED_ASC && (
              <PrimaryLink as={Link} onClick={() => setSort(SORT_OPTIONS.UPDATED_DESC)}>
                <Flex alignItems={"center"} gap={1}>
                  Updated <FaArrowUp />
                </Flex>
              </PrimaryLink>
            )}
            {sort === SORT_OPTIONS.UPDATED_DESC && (
              <PrimaryLink as={Link} onClick={() => setSort(SORT_OPTIONS.UPDATED_ASC)}>
                <Flex alignItems={"center"} gap={1}>
                  Updated <FaArrowDown />
                </Flex>
              </PrimaryLink>
            )}
            {sort !== SORT_OPTIONS.UPDATED_ASC && sort !== SORT_OPTIONS.UPDATED_DESC && (
              <PrimaryLink as={Link} onClick={() => setSort(SORT_OPTIONS.UPDATED_ASC)}>
                Updated
              </PrimaryLink>
            )}
          </Th>
        </Thead>
        <Tbody>
          {notes.map((note) => (
            <>
              <Tr>
                <Td>
                  <PrimaryLink as={GatsbyLink} to={note.childMdx.fields.slug}>
                    {note.childMdx.frontmatter.title}
                  </PrimaryLink>
                  <Flex fontSize="sm" gap={4} mt={4}>
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

                  <Text mb="4" fontSize="md" noOfLines={3}>
                    {note.childMdx.frontmatter.description}
                  </Text>
                  <Box color={'primary'} fontSize="xs" textTransform="uppercase">{note.childMdx.timeToRead} min read</Box>
                </Td>
                <Td fontSize={"sm"} whiteSpace={"nowrap"}>
                  {moment(note.childMdx.frontmatter.published).format("YYYY-MM-DD")}
                </Td>
                <Td fontSize={"sm"} whiteSpace={"nowrap"}>
                  {getBrowserCompatibleDate(note)}
                </Td>
              </Tr>
            </>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

NotesList.propTypes = {
  notes: PropTypes.array.isRequired,
};

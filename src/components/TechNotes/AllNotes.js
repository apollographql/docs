import React, { useMemo, useState } from "react";
import { NotesList } from "./NotesList";
import { TagList } from "./TagList";
import { graphql, useStaticQuery } from "gatsby";
import { FormControl, FormLabel, InputGroup, Input, InputLeftAddon, Flex, Box, Heading } from "@chakra-ui/react";

export function AllNotes() {
  const data = useStaticQuery(
    graphql`
      query AllTechNotesAlphabetical {
        notes: allFile(
          filter: {childMdx: {slug: {regex: "/^TN\\d{4}/"}}}
          sort: {fields: childMdx___frontmatter___title, order: ASC}
          limit: 2000
        ) {
          nodes {
            fields {
              gitLogLatestDate
            }
            childMdx {
              id
              fields {
                slug
              }
              frontmatter {
                title
                summary
                published
                tags
              }
              rawBody
              timeToRead
            }
          }
        }
      }
    `
  );

  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = useMemo(
    () =>
      data.notes.nodes === ""
        ? data.notes.nodes
        : data.notes.nodes.filter(
            (note) =>
              note.childMdx.frontmatter.title?.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1 ||
              note.childMdx.frontmatter.summary?.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1 ||
              note.childMdx.rawBody?.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1 ||
              note.childMdx.frontmatter?.tags?.some((tag) => `#${tag}` === searchQuery.toLowerCase())
          ),
    [data.notes.nodes, searchQuery]
  );

  return (
    <>
      <Heading>All notes</Heading>
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
      <TagList onClick={(tag) => setSearchQuery(`#${tag}`)} />
      <NotesList notes={filteredNotes} setSearchQuery={setSearchQuery} />
    </>
  );
}

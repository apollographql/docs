import InlineCode from "../InlineCode";
import PropTypes from "prop-types";
import React from "react";
import { InterfaceDetails, PropertySignatureTable, useApiDocContext } from ".";
import { Table, Tbody, Td, Th, Thead, Tr, chakra } from "@chakra-ui/react";
import { mdToReact } from "./mdToReact";

export function ParameterTable({ canonicalReference }) {
  const item = useApiDocContext(canonicalReference);

  return (
    <>
      <div>
        <chakra.h6
          mb="4"
          fontWeight="bold"
          textTransform="uppercase"
          fontSize="sm"
          letterSpacing="wider"
        >
          Parameters
        </chakra.h6>
        <Table w="auto">
          <Thead>
            <Tr>
              <Th>
                Name /<br />
                Type
              </Th>
              <Th>Description</Th>
            </Tr>
          </Thead>
          <Tbody>
            {item.parameters.map((parameter) => {
              const baseType = parameter.type.split("<")[0];
              const interfaceReference = item.references?.find(
                (r) =>
                  r.text === baseType &&
                  r.target &&
                  r.target.kind === "Interface"
              );
              return (
                <React.Fragment key={parameter.id}>
                  <Tr fontSize="md">
                    <Td
                      sx={{ code: { bg: "none", p: 0 } }}
                      borderBottom={interfaceReference ? "none" : undefined}
                    >
                      <chakra.h6 fontSize="lg" mb="1">
                        <InlineCode>{parameter.name}</InlineCode>
                        {parameter.optional ? <em> (optional)</em> : null}
                      </chakra.h6>
                      <InlineCode color="tertiary">{parameter.type}</InlineCode>
                    </Td>
                    <Td
                      lineHeight="base"
                      borderBottom={interfaceReference ? "none" : undefined}
                    >
                      {mdToReact(parameter.comment)}
                    </Td>
                  </Tr>
                  {interfaceReference && (
                    <Tr fontSize="md">
                      <Td colSpan={2} paddingTop={0}>
                        <details>
                          <summary>
                            More on {interfaceReference.text}...
                          </summary>
                          <PropertySignatureTable
                            canonicalReference={
                              interfaceReference.canonicalReference
                            }
                          />
                        </details>
                      </Td>
                    </Tr>
                  )}
                </React.Fragment>
              );
            })}
          </Tbody>
        </Table>
      </div>
    </>
  );
}

ParameterTable.propTypes = {
  canonicalReference: PropTypes.string.isRequired,
};

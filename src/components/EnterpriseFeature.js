import Markdown from 'react-markdown';
import PropTypes from 'prop-types';
import React from 'react';
import RelativeLink from './RelativeLink';
import {
  Box,
  Center,
  Flex,
  Link,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
  chakra
} from '@chakra-ui/react';
import {HighlightKeyTerms} from '@apollo/pedia';
import {MarkdownCodeBlock} from '@apollo/chakra-helpers';
import {TbComponents} from 'react-icons/tb';

const LIST_SPACING = 1;

const NESTED_LIST_STYLES = {
  [['ul', 'ol']]: {
    mt: 3,
    fontSize: 'md',
    lineHeight: 'normal'
  }
};

export const EnterpriseFeature = ({text = ''}) => {
  return (
    <Box
      pl="2"
      py="1"
      borderLeftWidth="2px"
      borderColor="primary"
      fontSize="md"
      sx={{
        '>': {
          ':not(:last-child)': {
            mb: 2
          }
        }
      }}
    >
      <Flex as="span">
        <chakra.span pl="10px" pr="10px">
          <Center h="100%">
            <TbComponents />
          </Center>
        </chakra.span>
        {text.length === 0 ? (
          <Text pl="1">
            <b>
              This feature is only available with a{' '}
              <Link color={'primary'} href="/graphos/enterprise/">
                GraphOS Enterprise plan
              </Link>
              .
            </b>{' '}
            If your organization doesn&apos;t currently have an Enterprise plan,
            you can test this functionality by signing up for a free{' '}
            <Link
              color={'primary'}
              href="/graphos/org/plans/#enterprise-trials"
            >
              Enterprise trial
            </Link>
            .
          </Text>
        ) : (
          <Text>
            <Markdown
              components={{
                ul: props => (
                  <UnorderedList
                    spacing={LIST_SPACING}
                    sx={{
                      ...NESTED_LIST_STYLES,
                      marginStart: '2em',
                      ul: {
                        listStyleType: 'circle'
                      }
                    }}
                    {...props}
                  />
                ),
                ol: props => (
                  <OrderedList
                    spacing={LIST_SPACING}
                    sx={NESTED_LIST_STYLES}
                    {...props}
                  />
                ),
                li: ({children, ...props}) => (
                  <ListItem
                    sx={{
                      '>': {
                        ':not(:last-child)': {
                          mb: 3
                        }
                      }
                    }}
                    {...props}
                  >
                    <HighlightKeyTerms>{children}</HighlightKeyTerms>
                  </ListItem>
                ),
                p: ({children}) => {
                  return (
                    <Text>
                      <HighlightKeyTerms>{children}</HighlightKeyTerms>
                    </Text>
                  );
                },
                a: RelativeLink,
                pre: MarkdownCodeBlock
              }}
            >
              {text}
            </Markdown>
          </Text>
        )}
      </Flex>
    </Box>
  );
};

EnterpriseFeature.propTypes = {
  text: PropTypes.string
};

// Use children instead of text prop

// export const EnterpriseFeature = ({children}) => {
//   return (
//     <Box
//       pl="2"
//       py="1"
//       borderLeftWidth="2px"
//       borderColor="primary"
//       fontSize="md"
//       sx={{
//         '>': {
//           ':not(:last-child)': {
//             mb: 2
//           }
//         }
//       }}
//     >
//       <Flex as="span">
//         <chakra.span pl="10px" pr="10px">
//           <Center h="100%">
//             <TbComponents />
//           </Center>
//         </chakra.span>

//         {children ? (
//           <Text pl="1">{children}</Text>
//         ) : (
//           <Text pl="1">
//             <strong>
//               This feature is only available with a{' '}
//               <Link color={'primary'} href="/graphos/enterprise/">
//                 GraphOS Enterprise plan
//               </Link>
//               .{' '}
//             </strong>
//             If your organization doesn&apos;t currently have an Enterprise plan,
//             you can test this functionality by signing up for a free{' '}
//             <Link
//               color={'primary'}
//               href="/graphos/org/plans/#enterprise-trials"
//             >
//               Enterprise trial
//             </Link>
//             .
//           </Text>
//         )}
//       </Flex>
//     </Box>
//   );
// };

// EnterpriseFeature.propTypes = {
//   children: PropTypes.node
// };

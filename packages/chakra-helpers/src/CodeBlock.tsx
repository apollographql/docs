import Highlight, {Language} from 'prism-react-renderer';
import Prism from 'prismjs';
import React, {ReactNode, createContext, useContext, useState} from 'react';
import fenceparser from 'fenceparser';
import rangeParser from 'parse-numeric-range';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  chakra,
  useClipboard,
  useColorModeValue
} from '@chakra-ui/react';
import {FiCheck} from '@react-icons/all-files/fi/FiCheck';
import {FiClipboard} from '@react-icons/all-files/fi/FiClipboard';
import {FiEyeOff} from '@react-icons/all-files/fi/FiEyeOff';
import {colors} from '@apollo/space-kit/colors';
import {usePrismTheme} from './prism';

const CODE_BLOCK_SPACING = 4;
export const GA_EVENT_CATEGORY_CODE_BLOCK = 'Code Block';

export const CodeBlockContext = createContext(null);
export const LineNumbersContext = createContext(true);

const isHighlightComment = (token, comment = '// highlight-line') =>
  token.types.includes('comment') && token.content === comment;

const isHighlightStart = (line, comment = '// highlight-start') =>
  line.some(token => isHighlightComment(token, comment));

const isHighlightEnd = line => isHighlightStart(line, '// highlight-end');

type MarkdownCodeBlockProps = {
  children: ReactNode;
};

export const MarkdownCodeBlock = ({
  children
}: MarkdownCodeBlockProps): JSX.Element => {
  const defaultShowLineNumbers = useContext(LineNumbersContext);
  const [child] = Array.isArray(children) ? children : [children];
  const {
    className = 'language-text',
    children: innerChildren,
    metastring,
    'data-meta': dataMeta,
    hidden = false
  } = child.props;

  const meta = metastring || dataMeta;
  const {
    title = null,
    highlight = null,
    showLineNumbers = defaultShowLineNumbers,
    disableCopy = false
  } = meta ? fenceparser(meta) : {};
  const linesToHighlight = highlight
    ? rangeParser(Object.keys(highlight).toString())
    : [];

  const [code] = Array.isArray(innerChildren) ? innerChildren : [innerChildren];

  return (
    <CodeBlock
      code={code.trim()}
      language={className.replace(/^language-/, '')}
      title={title?.toString()}
      hidden={hidden}
      disableCopy={disableCopy === true}
      showLineNumbers={showLineNumbers === true}
      linesToHighlight={linesToHighlight}
    />
  );
};

type CodeBlockProps = {
  language?: Language;
  title?: string;
  linesToHighlight?: number[];
  disableCopy?: boolean;
  showLineNumbers?: boolean;
  hidden?: boolean;
  code: string;
};

export const CodeBlock = ({
  code,
  language,
  title,
  showLineNumbers,
  linesToHighlight = [],
  hidden: defaultHidden = false,
  disableCopy = false
}: CodeBlockProps): JSX.Element => {
  const {onCopy, hasCopied} = useClipboard(code);
  const [hidden, setHidden] = useState(defaultHidden);

  const theme = usePrismTheme();
  const languageMenu = useContext(CodeBlockContext);
  const highlightColor = useColorModeValue('gray.100', 'gray.700');
  const lineNumberColor = useColorModeValue(
    'gray.500',
    colors.midnight.lighter
  );

  return (
    <Highlight
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Prism={Prism}
      theme={theme}
      code={code}
      language={language}
    >
      {({className, style, tokens, getLineProps, getTokenProps}) => {
        // length of longest line number
        // ex. if there are 28 lines in the code block, lineNumberOffset = 2ch
        const lineNumberOffset = tokens.length.toString().length + 'ch';

        // create an array of lines highlighted by "highlight-start" and
        // "highlight-end" comments
        const highlightRange = [];
        for (let i = 0; i < tokens.length; i++) {
          const line = tokens[i];
          if (isHighlightEnd(line)) {
            highlightRange.pop();
            break;
          }

          if (highlightRange.length || isHighlightStart(line)) {
            highlightRange.push(i + 1);
          }
        }

        return (
          <Box
            rounded="md"
            style={style}
            pos="relative"
            borderWidth="1px"
            lineHeight="base"
          >
            <Box fontSize="md" fontFamily="mono">
              {title && (
                <Box
                  px={CODE_BLOCK_SPACING}
                  py="2"
                  borderBottomWidth="1px"
                  borderTopRadius="md"
                >
                  {title}
                </Box>
              )}
              <Flex
                overflow="auto"
                transition="filter 200ms"
                css={
                  hidden && {
                    filter: 'blur(8px)',
                    pointerEvents: 'none',
                    userSelect: 'none'
                  }
                }
              >
                <chakra.pre
                  d="inline-block"
                  minW="full"
                  className={className}
                  py={CODE_BLOCK_SPACING}
                  fontFamily="inherit"
                >
                  {tokens
                    .filter(
                      line => !isHighlightStart(line) && !isHighlightEnd(line)
                    )
                    .map((line, i) => {
                      const shouldHighlight =
                        // if the line number exists in the metastring or highlight comment ranges
                        linesToHighlight
                          .concat(highlightRange)
                          .includes(i + 1) ||
                        // or if the line has a "highlight-line" comment in it
                        line.some(token => isHighlightComment(token));
                      return (
                        <Flex
                          key={i}
                          px={CODE_BLOCK_SPACING}
                          // for line highlighting to go all the way across code block
                          minW="full"
                          w="fit-content"
                          bg={shouldHighlight && highlightColor}
                        >
                          {showLineNumbers && (
                            <Box
                              aria-hidden="true"
                              userSelect="none"
                              // line number alignment used in VS Code
                              textAlign="right"
                              w={lineNumberOffset}
                              mr={CODE_BLOCK_SPACING}
                              color={lineNumberColor}
                            >
                              {i + 1}
                            </Box>
                          )}
                          <Box
                            {...getLineProps({
                              line,
                              key: i
                            })}
                          >
                            <Box>
                              {line
                                // filter out "highlight-line" comments
                                .filter(token => !isHighlightComment(token))
                                .map((token, key) => (
                                  <span
                                    key={key}
                                    {...getTokenProps({token, key})}
                                  />
                                ))}
                            </Box>
                          </Box>
                        </Flex>
                      );
                    })}
                </chakra.pre>
              </Flex>
            </Box>
            <ButtonGroup
              size="xs"
              pos="absolute"
              top="2"
              right="2"
              transition="opacity 200ms linear 200ms"
              css={
                hidden && {
                  opacity: 0,
                  transition: 'none'
                }
              }
            >
              {defaultHidden && (
                <IconButton
                  aria-label="Hide code"
                  icon={<FiEyeOff />}
                  onClick={() => setHidden(true)}
                />
              )}
              {!disableCopy && (
                <Button
                  leftIcon={hasCopied ? <FiCheck /> : <FiClipboard />}
                  onClick={() => {
                    onCopy();
                    window.gtag?.('event', 'Copy', {
                      event_category: GA_EVENT_CATEGORY_CODE_BLOCK
                    });
                  }}
                >
                  {hasCopied ? 'Copied!' : 'Copy'}
                </Button>
              )}
              {languageMenu}
            </ButtonGroup>
            {hidden && (
              <Button
                pos="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                onClick={() => setHidden(false)}
                rounded="full"
                colorScheme="indigo"
              >
                Show code
              </Button>
            )}
          </Box>
        );
      }}
    </Highlight>
  );
};

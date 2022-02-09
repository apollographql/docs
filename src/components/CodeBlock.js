import Highlight from 'prism-react-renderer';
import Prism from 'prismjs';
import PropTypes from 'prop-types';
import React, {createContext, useContext} from 'react';
import fenceparser from 'fenceparser';
import rangeParser from 'parse-numeric-range';
import {
  Box,
  Button,
  ButtonGroup,
  chakra,
  useClipboard,
  useColorModeValue
} from '@chakra-ui/react';
import {FiClipboard} from 'react-icons/fi';
import {theme as darkTheme} from '../prism-themes/dark';
import {theme as lightTheme} from '../prism-themes/light';

// these must be imported after Prism
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';

export const CodeBlockContext = createContext();
const SPACING = 4;
export default function CodeBlock({children}) {
  const [child] = Array.isArray(children) ? children : [children];
  const {
    className = 'language-text',
    children: innerChildren,
    metastring,
    'data-meta': dataMeta,
    showLineNumbers = true
  } = child.props;

  const meta = metastring || dataMeta;
  const {title, highlight} = meta ? fenceparser(meta) : {};
  const linesToHighlight = highlight
    ? rangeParser(Object.keys(highlight).toString())
    : [];

  const [code] = Array.isArray(innerChildren) ? innerChildren : [innerChildren];

  const {onCopy, hasCopied} = useClipboard(code);
  const theme = useColorModeValue(lightTheme, darkTheme);
  const highlightColor = useColorModeValue('gray.100', 'blackAlpha.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const titleBgColor = useColorModeValue('white', 'inherit');
  const lineNumberColor = useColorModeValue('gray.300', '#798fbb');
  const languageMenu = useContext(CodeBlockContext);

  return (
    <Highlight
      Prism={Prism}
      theme={theme}
      code={code.trim()}
      language={className.replace(/^language-/, '')}
    >
      {({className, style, tokens, getLineProps, getTokenProps}) => {
        // length of longest line number
        // ex. if there are 28 lines in the code block, lineNumberOffset = 2ch
        const lineNumberOffset = tokens.length.toString().length + 'ch';
        return (
          <Box
            rounded="md"
            style={style}
            pos="relative"
            shadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Box fontSize="md" fontFamily="mono">
              {title && (
                <Box
                  px={SPACING}
                  py="2"
                  borderBottomWidth="1px"
                  bgColor={titleBgColor}
                  borderTopRadius="md"
                >
                  {title}
                </Box>
              )}
              <chakra.pre
                className={className}
                py={SPACING}
                px={showLineNumbers && SPACING}
                fontFamily="inherit"
                overflow="auto"
              >
                {tokens.map((line, i) => (
                  <Box
                    {...getLineProps({
                      line,
                      key: i
                    })}
                    key={i}
                    pl={(SPACING / 2) * (showLineNumbers ? 2 : 1)}
                    bg={linesToHighlight.includes(i + 1) && highlightColor}
                  >
                    <Box ml={showLineNumbers && lineNumberOffset}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({token, key})} />
                      ))}
                    </Box>
                  </Box>
                ))}
              </chakra.pre>
              {/* put below all code and then position so that if user selects text, line numbers will be excluded */}
              {showLineNumbers && (
                <chakra.pre
                  aria-hidden="true" // hide from screen reader
                  pos="absolute"
                  top={title ? '57px' : SPACING} // 57px = SPACING (16px) + height of title box (41px)
                  left={SPACING}
                  textAlign="right"
                  bgColor={theme.plain.backgroundColor} // for horizontal scrolling of code text
                >
                  {tokens.map((_, index) => (
                    <Box
                      key={index}
                      w={lineNumberOffset}
                      mr={SPACING}
                      color={lineNumberColor}
                    >
                      {index + 1}
                    </Box>
                  ))}
                </chakra.pre>
              )}
            </Box>
            <ButtonGroup size="xs" pos="absolute" top="2" right="2">
              <Button leftIcon={<FiClipboard />} onClick={onCopy}>
                {hasCopied ? 'Copied!' : 'Copy'}
              </Button>
              {languageMenu}
            </ButtonGroup>
          </Box>
        );
      }}
    </Highlight>
  );
}

CodeBlock.propTypes = {
  children: PropTypes.node.isRequired
};

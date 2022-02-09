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

const CODE_BLOCK_PADDING = 4;
export const CodeBlockContext = createContext();

export default function CodeBlock({children}) {
  const [child] = Array.isArray(children) ? children : [children];
  const {
    className = 'language-text',
    children: innerChildren,
    metastring,
    'data-meta': dataMeta
  } = child.props;

  const meta = metastring || dataMeta;
  const {
    title,
    showLineNumbers = true,
    highlight
  } = meta ? fenceparser(meta) : {};

  const linesToHighlight = highlight
    ? rangeParser(Object.keys(highlight).toString())
    : [];

  const [code] = Array.isArray(innerChildren) ? innerChildren : [innerChildren];

  const {onCopy, hasCopied} = useClipboard(code);
  const theme = useColorModeValue(lightTheme, darkTheme);
  const highlightColor = useColorModeValue('gray.100', 'blackAlpha.400');
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
          <Box rounded="md" style={style} pos="relative" borderWidth="1px">
            <Box fontSize="md" fontFamily="mono">
              {title && (
                <Box
                  px={CODE_BLOCK_PADDING}
                  py="2"
                  borderBottomWidth="1px"
                  borderTopRadius="md"
                >
                  {title}
                </Box>
              )}
              <chakra.pre
                className={className}
                py={CODE_BLOCK_PADDING}
                fontFamily="inherit"
                overflow="auto"
                pos="relative"
              >
                {tokens.map((line, i) => (
                  <Box
                    {...getLineProps({
                      line,
                      key: i
                    })}
                    key={i}
                    pl={CODE_BLOCK_PADDING * (showLineNumbers ? 2 : 1)}
                    bg={linesToHighlight.includes(i + 1) && highlightColor}
                  >
                    <Box ml={showLineNumbers && lineNumberOffset}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({token, key})} />
                      ))}
                    </Box>
                  </Box>
                ))}
                {showLineNumbers && (
                  <chakra.pre
                    aria-hidden="true" // hide from screen reader
                    pos="absolute"
                    fontFamily="inherit"
                    top={CODE_BLOCK_PADDING}
                    left={CODE_BLOCK_PADDING}
                    textAlign="right"
                    userSelect="none"
                  >
                    {tokens.map((_, index) => (
                      <Box
                        key={index}
                        w={lineNumberOffset}
                        color={lineNumberColor}
                      >
                        {index + 1}
                      </Box>
                    ))}
                  </chakra.pre>
                )}
              </chakra.pre>
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

import Highlight, {Prism} from 'prism-react-renderer';
import PropTypes from 'prop-types';
import React from 'react';
import fenceparser from 'fenceparser';
import nightOwl from 'prism-react-renderer/themes/nightOwl';
import nightOwlLight from 'prism-react-renderer/themes/nightOwlLight';
import rangeParser from 'parse-numeric-range';
import {
  Box,
  Button,
  DarkMode,
  chakra,
  useColorModeValue
} from '@chakra-ui/react';

export default function CodeBlock({children}) {
  const theme = useColorModeValue(nightOwlLight, nightOwl);
  const [child] = Array.isArray(children) ? children : [children];
  const {
    className = 'language-text',
    children: innerChildren,
    metastring,
    'data-meta': dataMeta
  } = child.props;

  const meta = metastring || dataMeta;
  const {title, highlight} = meta ? fenceparser(meta) : {};
  const linesToHighlight = highlight
    ? rangeParser(Object.keys(highlight).toString())
    : [];

  const [code] = Array.isArray(innerChildren) ? innerChildren : [innerChildren];

  return (
    <Highlight
      Prism={Prism}
      theme={theme}
      code={code.trim()}
      language={className.replace(/language-/, '')}
    >
      {({className, style, tokens, getLineProps, getTokenProps}) => (
        <Box rounded="md" style={style} pos="relative" shadow="md">
          <Box fontSize="md" fontFamily="mono">
            {title && (
              <Box px="4" py="2" borderBottomWidth="1px">
                {title}
              </Box>
            )}
            <chakra.pre className={className} p="4" fontFamily="inherit">
              {tokens.map((line, i) => (
                <div
                  key={i}
                  {...getLineProps({
                    line,
                    key: i,
                    style: {
                      background: linesToHighlight.includes(i + 1) && 'tomato'
                    }
                  })}
                >
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({token, key})} />
                  ))}
                </div>
              ))}
            </chakra.pre>
          </Box>
          <DarkMode>
            <Button size="xs" pos="absolute" top="2" right="2">
              Copy
            </Button>
          </DarkMode>
        </Box>
      )}
    </Highlight>
  );
}

CodeBlock.propTypes = {
  children: PropTypes.node.isRequired
};

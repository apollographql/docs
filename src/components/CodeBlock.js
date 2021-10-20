import Highlight, {defaultProps} from 'prism-react-renderer';
import PropTypes from 'prop-types';
import React from 'react';
import fenceparser from 'fenceparser';
import rangeParser from 'parse-numeric-range';

export default function CodeBlock({children}) {
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
    <div>
      {title && <div>{title}</div>}
      <Highlight
        {...defaultProps}
        code={code.trim()}
        language={className.replace(/language-/, '')}
      >
        {({className, style, tokens, getLineProps, getTokenProps}) => (
          <pre className={className} style={{...style}}>
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
          </pre>
        )}
      </Highlight>
    </div>
  );
}

CodeBlock.propTypes = {
  children: PropTypes.node.isRequired
};

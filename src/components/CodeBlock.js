import Highlight, {defaultProps} from 'prism-react-renderer';
import PropTypes from 'prop-types';
import React from 'react';
import fenceparser from 'fenceparser';

export default function CodeBlock({
  className,
  children,
  metastring,
  'data-meta': dataMeta
}) {
  const code = Array.isArray(children) ? children[0] : children;
  const language = className?.replace(/language-/, '');
  const meta = metastring || dataMeta || '';
  const {title, highlight} = fenceparser(meta);
  return (
    <div>
      {title && <div>{title}</div>}
      <Highlight
        {...defaultProps}
        code={code.trim()}
        language={language || 'text'}
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
                    background: highlight?.[i + 1] && 'tomato'
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
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
  metastring: PropTypes.string,
  'data-meta': PropTypes.string
};

import Highlight, {defaultProps} from 'prism-react-renderer';
import PropTypes from 'prop-types';
import React, {Children} from 'react';
import fenceparser from 'fenceparser';

export default function CodeBlock({children}) {
  const [child] = Children.toArray(children);
  const {
    className = 'language-text',
    children: innerChildren,
    metastring,
    'data-meta': dataMeta
  } = child.props;

  const [code] = Children.toArray(innerChildren);
  const language = className.replace(/language-/, '');
  const meta = metastring || dataMeta;
  const {title, highlight} = meta ? fenceparser(meta) : {};
  return (
    <div>
      {title && <div>{title}</div>}
      <Highlight {...defaultProps} code={code.trim()} language={language}>
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
  children: PropTypes.node.isRequired
};

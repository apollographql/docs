import PropTypes from 'prop-types';
import React from 'react';
import {Stack} from '@chakra-ui/react';
import {mdToReact} from './mdToReact';
import {useApiDocContext} from '.';

export function DocBlock({
  canonicalReference,
  summary = true,
  remark = false,
  example = false,
  remarkCollapsible = true,
  since = true,
  deprecated = true
}) {
  return (
    <Stack spacing="4">
      {/** TODO: @since, @deprecated etc. */}
      {deprecated && (
        <DocPiece deprecated canonicalReference={canonicalReference} />
      )}
      {since && <DocPiece since canonicalReference={canonicalReference} />}
      {summary && <DocPiece summary canonicalReference={canonicalReference} />}
      {remark && (
        <DocPiece
          remark
          collapsible={remarkCollapsible}
          canonicalReference={canonicalReference}
        />
      )}
      {example && <DocPiece example canonicalReference={canonicalReference} />}
    </Stack>
  );
}

DocBlock.propTypes = {
  canonicalReference: PropTypes.string.isRequired,
  summary: PropTypes.bool,
  remark: PropTypes.bool,
  example: PropTypes.bool,
  remarkCollapsible: PropTypes.bool,
  since: PropTypes.bool,
  deprecated: PropTypes.bool
};

export function DocPiece({
  canonicalReference,
  summary = false,
  remark = false,
  example = false,
  since = false,
  deprecated = false,
  collapsible = false
}) {
  const getItem = useApiDocContext();
  const item = getItem(canonicalReference);
  let jsx = null;
  if (example === true) example = 0;

  switch (true) {
    case deprecated:
      jsx = item.comment?.deprecated ? (
        <b>{mdToReact(item.comment?.deprecated)}</b>
      ) : null;
      break;
    case since:
      jsx = item.comment?.since /* TODO schema */ ? (
        <i>Added to Apollo Client in version {item.comment?.since}</i>
      ) : null;
      break;
    case summary:
      jsx = item.comment?.summary ? mdToReact(item.comment?.summary) : null;
      break;
    case remark:
      jsx = item.comment?.remark ? mdToReact(item.comment?.remark) : null;
      break;
    case example !== false:
      jsx = item.comment?.examples[example] ? (
        <>{mdToReact(item.comment?.examples[example])}</>
      ) : null;
      break;
    default:
      throw new Error(
        'You need to call `DocPiece` with  one of the following props:' +
          '`summary`, `remark`, `example`, `since`, `deprecated`'
      );
  }
  return collapsible ? (
    jsx ? (
      <details>
        <summary>
          <p>Read more...</p>
        </summary>
        {jsx}
      </details>
    ) : null
  ) : (
    jsx
  );
}
DocPiece.propTypes = {
  canonicalReference: PropTypes.string.isRequired,
  collapsible: PropTypes.bool,
  summary: PropTypes.bool,
  remark: PropTypes.bool,
  example: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  since: PropTypes.bool,
  deprecated: PropTypes.bool
};

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
  const item = useApiDocContext(canonicalReference);
  return (
    <>
      <Stack spacing="4">
        {/** TODO: @since, @deprecated etc. */}
        {deprecated && item.comment?.deprecated ? (
          <b>{mdToReact(item.comment?.deprecated)}</b>
        ) : undefined}
        {since && item.comment?.since /* TODO schema */ ? (
          <i>Added to Apollo Client in version {item.comment?.since}</i>
        ) : undefined}
        {summary && item.comment?.summary
          ? mdToReact(item.comment?.summary)
          : undefined}
        {remark && item.comment?.remark ? (
          remarkCollapsible ? (
            <>
              <details>
                <summary>
                  <p>Read more...</p>
                </summary>
                {mdToReact(item.comment?.remark)}
              </details>
            </>
          ) : (
            mdToReact(item.comment?.remark)
          )
        ) : undefined}
        {example && item.comment?.example
          ? mdToReact(item.comment?.example)
          : undefined}
      </Stack>
    </>
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

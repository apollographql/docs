import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {CustomHeading} from './CustomHeading';
import {Link, Td, Tr} from '@chakra-ui/react';
import {MarkdownInAdmonitions} from './MarkdownInAdmonitions';
import {PropertyListContext} from './PropertyList';

export function ErrorCode({
  code,
  level,
  detail,
  type,
  origin,
  trace,
  debug_uri,
  actions,
  attributes,
  children
}) {
  return (
    <Tr>
      <Td>
        <span>
          <CustomHeading as="h5" size="sm" id={code}>
            <Link href={`#${code}`}>
              <code>{code}</code>
            </Link>
          </CustomHeading>
        </span>
      </Td>
      <Td>
        {detail && (
          <span>
            {detail}
            <br />
            <br />
          </span>
        )}
        {children && (
          <span>
            {children}
            <br />
          </span>
        )}
        {level && (
          <span>
            <strong>Level: </strong>
            {level}
            <br />
          </span>
        )}
        {origin && (
          <span>
            <strong>Origin: </strong>
            {origin}
            <br />
          </span>
        )}
        {type && (
          <span>
            <strong>Type: </strong>
            {type}
            <br />
          </span>
        )}
      </Td>
    </Tr>
  );
}

ErrorCode.propTypes = {
  code: PropTypes.string.isRequired,
  detail: PropTypes.string,
  level: PropTypes.string,
  origin: PropTypes.string,
  type: PropTypes.string,
  children: PropTypes.node
};

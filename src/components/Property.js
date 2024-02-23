import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {CustomHeading} from './CustomHeading';
import {Link, Td, Tr} from '@chakra-ui/react';
import {MarkdownInAdmonitions} from './MarkdownInAdmonitions';
import {PropertyListContext} from './PropertyList';

export function Property({name, short, long, type, children}) {
  const kind = useContext(PropertyListContext);

  if (kind === 'fieldTable') {
    return (
      <Tr>
        <Td>
          <span>
            <CustomHeading as="h5" size="sm" id={name}>
              <Link href={`#${name}`}>
                <code>{name}</code>
              </Link>
            </CustomHeading>
            {type && (
              <p>
                <code>{type}</code>
              </p>
            )}
          </span>
        </Td>
        <Td>
          {short && (
            <span>
              <strong>{short}</strong>
              <br />
              <br />
            </span>
          )}
          {long && (
            <span>
              <MarkdownInAdmonitions>{long}</MarkdownInAdmonitions>
              <br />
            </span>
          )}
          {children}
        </Td>
      </Tr>
    );
  }
  if (kind === 'errCodes') {
    return (
      <Tr>
        <Td>
          <span>
            <CustomHeading as="h5" size="sm" id={name}>
              <Link href={`#${name}`}>
                <code>{name}</code>
              </Link>
            </CustomHeading>
            {type && (
              <p>
                <strong>{short}</strong>
              </p>
            )}
          </span>
        </Td>
        <Td>
          {short && (
            <span>
              <strong>{short}</strong>
              <br />
              <br />
            </span>
          )}
          {long && (
            <span>
              <MarkdownInAdmonitions>{long}</MarkdownInAdmonitions>
              <br />
            </span>
          )}
          {children}
        </Td>
      </Tr>
    );
  }
}

Property.propTypes = {
  name: PropTypes.string.isRequired,
  short: PropTypes.string,
  long: PropTypes.string,
  type: PropTypes.string,
  children: PropTypes.node
};

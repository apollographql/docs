import PropTypes from 'prop-types';
import React from 'react';
import {Link, ListItem, OrderedList} from '@chakra-ui/react';

export const SSOShareDetails = ({type}) => {
  return (
    <>
      <OrderedList spacing="4">
        <ListItem>
          Go to{' '}
          <Link
            href="https://studio.apollographql.com?referrer=docs-content"
            isExternal
          >
            GraphOS Studio
          </Link>
          . Open the <strong>Settings</strong> page from the top navigation.
          Open the <strong>Org management</strong> tab from the left sidebar and
          click <strong>Enable SSO</strong> or <strong>Reconfigure SSO</strong>{' '}
          if you are migrating from the legacy setup. A setup wizard appears.
        </ListItem>
        <ListItem>
          Enter the <strong>Email domain</strong>(s) you are setting SSO up for.
          Click <strong>Continue</strong>.
        </ListItem>
        <ListItem>
          Select <strong>{type}</strong> as the setup type. Click{' '}
          <strong>Continue</strong>.
        </ListItem>
      </OrderedList>
    </>
  );
};

SSOShareDetails.propTypes = {
  type: PropTypes.string.isRequired
};

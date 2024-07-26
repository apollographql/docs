import PropTypes from 'prop-types';
import React from 'react';
import {ListItem, OrderedList} from '@chakra-ui/react';
import {PrimaryLink} from '../../components/RelativeLink';

export const SSOShareDetails = ({type}) => {
  return (
    <>
      <OrderedList spacing="4">
        <ListItem>
          Go to{' '}
          <PrimaryLink
            href="https://studio.apollographql.com?referrer=docs-content"
            isExternal
          >
            GraphOS Studio
          </PrimaryLink>
          . Open the <strong>Settings</strong> page from the top navigation.
          Open the <strong>Security</strong> tab from the left sidebar and
          click <strong>Migrate SSO</strong>. A setup wizard appears.
        </ListItem>
        <ListItem>
          Enter the <strong>Email domain</strong>(s) you are setting SSO up for.
          Click <strong>Continue</strong>.
        </ListItem>
        <ListItem>
          Select <strong>{type}</strong> as the SSO type. Click{' '}
          <strong>Continue</strong>.
        </ListItem>
      </OrderedList>
    </>
  );
};

SSOShareDetails.propTypes = {
  type: PropTypes.string.isRequired
};

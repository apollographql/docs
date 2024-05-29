import PropTypes from 'prop-types';
import React from 'react';
import {ListItem, OrderedList, Text} from '@chakra-ui/react';

export const SAMLSetupSteps = ({idp}) => {
  return (
    <>
      <Text>SAML-based SSO setup has these steps:</Text>
      <OrderedList spacing="4">
        <ListItem>
          Share your SSO details with Apollo in GraphOS Studio.
        </ListItem>
        <ListItem>
          Create a custom {idp} for Apollo GraphOS
          {idp === 'application' ? ' in your IdP' : ''}.
        </ListItem>
        <ListItem>Share your {idp}&apos;s SAML metadata with Apollo.</ListItem>
        <ListItem>Verify your {idp} details in GraphOS Studio.</ListItem>
        <ListItem>Enable SSO.</ListItem>
      </OrderedList>
      <Text>
        The SSO setup wizard in GraphOS Studio guides you through these steps.
        Once you enable SSO, you must assign users to your {idp} to give them
        access to GraphOS Studio.
      </Text>
    </>
  );
};

SAMLSetupSteps.propTypes = {
  idp: PropTypes.string.isRequired
};

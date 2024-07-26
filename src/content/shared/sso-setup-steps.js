import PropTypes from 'prop-types';
import React from 'react';
import {ListItem, OrderedList, Text} from '@chakra-ui/react';

export const SSOSetupSteps = ({type, idp}) => {
  return (
    <>
      <Text>{type}-based SSO setup has these steps:</Text>
      <OrderedList spacing="4">
        <ListItem>Enter your SSO details in GraphOS Studio.</ListItem>
        <ListItem>
          Create a custom {idp} for GraphOS
          {idp === 'application' ? ' in your IdP' : ''}.
        </ListItem>
        <ListItem>
          Share your {idp}&apos;s {type} metadata in GraphOS Studio.
        </ListItem>
        <ListItem>Verify your {idp} details.</ListItem>
        <ListItem>Enable SSO in GraphOS Studio.</ListItem>
      </OrderedList>
      <Text>
        The SSO setup wizard in GraphOS Studio guides you through these steps.
      </Text>
    </>
  );
};

SSOSetupSteps.propTypes = {
  idp: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

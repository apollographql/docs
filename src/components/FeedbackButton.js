import PropTypes from 'prop-types';
import React from 'react';
import {PopupButton} from '@typeform/embed-react';
import {StarIcon} from './Icons';
import {Text} from '@chakra-ui/react';
import {useUser} from '../utils';

export const FeedbackButton = ({title}) => {
  const {user} = useUser();
  const organizations = user?.memberships.map(
    membership => membership.account.name
  );
  const billingTiers = user?.memberships.map(
    membership => membership.account.currentPlan.tier
  );

  return (
    <PopupButton
      id="miEpZmDw/"
      as="a"
      style={{
        background: 'none',
        border: 'none',
        color: 'inherit',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        padding: 0
      }}
      className="chakra-button css-8luegd"
      hidden={{
        path: window.location.pathname,
        title,
        user_email: user?.name,
        user_organizations: organizations,
        user_tiers: billingTiers
      }}
      size={60}
    >
      <span className="chakra-button__icon css-1wh2kri">
        <StarIcon />
      </span>

      <Text as="span" display={{base: 'none', lg: 'inline'}}>
        Rate article
      </Text>
      <Text as="span" display={{base: 'inline', lg: 'none'}}>
        Rate
      </Text>
    </PopupButton>
  );
};

FeedbackButton.propTypes = {
  title: PropTypes.string.isRequired
};

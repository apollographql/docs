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
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        padding: 0
      }}
      className="chakra-button"
      hidden={{
        path: window.location.pathname,
        title,
        user_email: user?.name,
        user_organizations: organizations,
        user_tiers: billingTiers
      }}
      size="60"
    >
      {' '}
      <StarIcon color={'gray.500'} _dark={{color: 'gray.200'}} />{' '}
      <Text
        as="span"
        fontSize="lg"
        fontWeight="semibold"
        color={'gray.500'}
        _dark={{color: 'gray.200'}}
        ml="0.5rem"
        display={{base: 'none', lg: 'inline'}}
        _hover={{textDecoration: 'underline'}}
      >
        {' '}
        Rate article{' '}
      </Text>{' '}
      <Text
        as="span"
        color={'gray.500'}
        ml="0.2rem"
        _dark={{color: 'gray.200'}}
        display={{base: 'inline', lg: 'none'}}
        _hover={{textDecoration: 'underline'}}
      >
        {' '}
        Rate{' '}
      </Text>{' '}
    </PopupButton>
  );
};

FeedbackButton.propTypes = {
  title: PropTypes.string.isRequired
};

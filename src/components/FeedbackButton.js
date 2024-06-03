import PropTypes from 'prop-types';
import React from 'react';
import {PopupButton} from '@typeform/embed-react';
import {StarIcon} from './Icons';
import {Text} from '@chakra-ui/react';

export const FeedbackButton = () => {
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

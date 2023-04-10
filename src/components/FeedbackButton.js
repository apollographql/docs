import PropTypes from 'prop-types';
import React from 'react';
import {Button, useBreakpointValue} from '@chakra-ui/react';
import {FiStar} from 'react-icons/fi';
import {useUser} from '../utils';

export const FeedbackButton = ({title}) => {
  const {user} = useUser();
  const text = useBreakpointValue({
    base: 'Rate',
    lg: 'Rate article'
  });
  return (
    <Button
      onClick={() => {
        window.freddyWidget?.show({
          custom_fields: {
            title,
            user_id: user?.id,
            email: user?.email
          }
        });
      }}
      variant="link"
      size="lg"
      leftIcon={<FiStar />}
    >
      {text}
    </Button>
  );
};

FeedbackButton.propTypes = {
  title: PropTypes.string.isRequired
};

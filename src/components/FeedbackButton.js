import PropTypes from 'prop-types';
import React from 'react';
import {Button} from '@chakra-ui/react';
import {FiStar} from 'react-icons/fi';
import {useUser} from '../utils';

export const FeedbackButton = ({title}) => {
  const {user} = useUser();
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
      Rate article
    </Button>
  );
};

FeedbackButton.propTypes = {
  title: PropTypes.string.isRequired
};

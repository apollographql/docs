import React from 'react';
import {Button} from '@chakra-ui/react';
import {FiStar} from 'react-icons/fi';
import {useUser} from '../utils';

export const FeedbackButton = () => {
  const {user} = useUser();
  return (
    <Button
      onClick={() => {
        window.freddyWidget?.show({
          custom_fields: {
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

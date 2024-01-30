import PropTypes from 'prop-types';
import React from 'react';
import {Button, Text} from '@chakra-ui/react';
import {StarIcon} from './Icons';
import {useUser} from '../utils';

export const FeedbackButton = ({title}) => {
  const {user} = useUser();
  return (
    <Button
      aria-label="rate this article"
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
      _dark={{
        color: 'gray.200'
      }}
      size="lg"
      leftIcon={<StarIcon />}
    >
      <Text as="span" display={{base: 'none', lg: 'inline'}}>
        Rate article
      </Text>
      <Text as="span" display={{base: 'inline', lg: 'none'}}>
        Rate
      </Text>
    </Button>
  );
};

FeedbackButton.propTypes = {
  title: PropTypes.string.isRequired
};

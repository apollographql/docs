import PropTypes from 'prop-types';
import React from 'react';
import {Button} from '@chakra-ui/react';

const TrackableButton = ({href, eventName, children, ...props}) => {
  return (
    <Button
      href={href}
      onClick={() => window?.gtag?.('event', `docs_${eventName}`)}
      {...props}
    >
      {children}
    </Button>
  );
};

export default TrackableButton;

TrackableButton.propTypes = {
  href: PropTypes.string.isRequired,
  eventName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

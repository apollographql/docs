import PropTypes from 'prop-types';
import React from 'react';
import RelativeLink from './RelativeLink';

const TrackableLink = ({href, eventName, children, ...props}) => {
  return (
    <RelativeLink
      href={href}
      onClick={() => window?.gtag?.('event', `docs_${eventName}`)}
      {...props}
    >
      {children}
    </RelativeLink>
  );
};

export default TrackableLink;

TrackableLink.propTypes = {
  href: PropTypes.string.isRequired,
  eventName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

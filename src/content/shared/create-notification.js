import PropTypes from 'prop-types';
import React from 'react';
import RelativeLink from '../../components/RelativeLink';
import {ListItem, OrderedList} from '@chakra-ui/react';

export const CreateNotification = ({notificationType}) => {
  return (
    <OrderedList spacing="4">
      <ListItem>
        Go to your graph&apos;s <strong>Settings</strong> page in{' '}
        <RelativeLink href="https://studio.apollographql.com/?referrer=docs-content">
          GraphOS Studio
        </RelativeLink>
        .
      </ListItem>
      <ListItem>
        Open the <strong>Reporting</strong> tab.
      </ListItem>
      <ListItem>
        Click <strong>Add notification</strong> in the upper right.
      </ListItem>
      <ListItem>
        Select <strong>{notificationType}</strong> and click{' '}
        <strong>Next</strong>.
      </ListItem>
      <ListItem>
        In the dropdown, select which graph variant you want to receive
        notifications for.
      </ListItem>
      <ListItem>
        Select an existing channel to send notifications to, or select which
        type of new channel you want to configure. Click <strong>Next</strong>.
      </ListItem>
      <ListItem>
        If you&apos;re configuring a new channel, complete the steps in the next
        section.
      </ListItem>
      {notificationType === 'Daily report' && (
        <ListItem>
          Select a time zone. GraphOS sends the report daily at 9 AM in the
          selected time zone.
        </ListItem>
      )}
    </OrderedList>
  );
};

CreateNotification.propTypes = {
  notificationType: PropTypes.string.required
};

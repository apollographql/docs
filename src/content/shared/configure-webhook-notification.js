import React from 'react';
import {ListItem, OrderedList, Text} from '@chakra-ui/react';

export const ConfigureWebhookNotification = () => {
  return (
    <>
      <Text>
        Custom webhooks require you to set up an HTTPS endpoint accessible via
        the public internet. GraphOS sends webhook notifications to this
        endpoint as `POST` requests. Notification details are provided as JSON
        in the request body, as described in the next section.
      </Text>
      <OrderedList spacing="4">
        <ListItem>
          Specify a name for this notification channel in the{' '}
          <strong>Channel Name</strong> field. This name must be unique among
          all your graph&apos;s notification channels, including Slack channels.
        </ListItem>
        <ListItem>
          In the <strong>Webhook URL</strong> input, provide the URL of your
          HTTP(S) endpoint.
        </ListItem>
        <ListItem>
          Click <strong>Next</strong> and complete any remaining steps in the
          dialog.
        </ListItem>
      </OrderedList>
    </>
  );
};

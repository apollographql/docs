import PropTypes from 'prop-types';
import React from 'react';
import {Box, Button, Stack, StackDivider} from '@chakra-ui/react';

export const TabContext = React.createContext();

export function Tabs({labels, children}) {
  const [currentTab, setCurrentTab] = React.useState(labels[0]);

  return (
    <TabContext.Provider value={currentTab}>
      <Stack direction="row" spacing="0.5em">
        {labels.map(label => (
          <Box
            key={label}
            color={currentTab === label ? 'text' : 'gray.300'}
            fontweight={currentTab === label ? 'extrabold' : 'light'}
          >
            <Button
              variant="outline"
              borderColor={currentTab === label ? 'primary' : 'transparent'}
              onClick={() => setCurrentTab(label)}
            >
              {label}
            </Button>
          </Box>
        ))}
      </Stack>
      {children}
    </TabContext.Provider>
  );
}

Tabs.propTypes = {
  labels: PropTypes.array,
  children: PropTypes.node
};

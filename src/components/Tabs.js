import PropTypes from 'prop-types';
import React from 'react';
import {Box, Button, Divider, Stack} from '@chakra-ui/react';

export const TabContext = React.createContext();

export function Tabs({labels, children}) {
  const [currentTab, setCurrentTab] = React.useState(labels[0]);

  return (
    <TabContext.Provider value={currentTab}>
      <Stack direction="row" spacing="0.5em">
        {labels.map(label => (
          <Box key={label}>
            <Button
              color={currentTab === label ? 'navy.300' : 'gray.500'}
              fontweight={currentTab === label ? 'extrabold' : 'light'}
              bg="transparent"
              onClick={() => setCurrentTab(label)}
              _focus={{boxShadow: 'none'}}
              _active={{outline: 'none', color: 'inherit'}}
              _hover={{textDecoration: 'none'}}
              _dark={{
                color: currentTab === label ? 'gray.100' : 'gray.400'
              }}
            >
              {label}
            </Button>
            <Divider
              borderColor={currentTab === label ? 'navy.300' : 'transparent'}
              borderWidth={currentTab === label ? '2px' : '0'}
              _dark={{
                borderColor: currentTab === label ? 'gray.100' : 'gray.400'
              }}
            />
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

import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {
  Box,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  IconButton,
  useDisclosure
} from '@chakra-ui/react';
import {DocsetContext, LeftSidebarNav} from './Sidebar';
import {FiMenu} from 'react-icons/fi';

export default function MobileNav({children, configs}) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [activeDocset, setActiveDocset] = useState(null);
  return (
    <>
      <IconButton
        ml="-2"
        d={{base: 'flex', md: 'none'}}
        variant="ghost"
        fontSize="2xl"
        icon={<FiMenu />}
        onClick={onOpen}
      />
      <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton zIndex="1" top="3" />
          <Box overflow="auto" pos="relative" zIndex="0">
            {activeDocset ? (
              children
            ) : (
              <DocsetContext.Provider
                value={{
                  configs,
                  activeDocset,
                  setActiveDocset,
                  sidebarOpen: true,
                  clickToSelect: true
                }}
              >
                <LeftSidebarNav />
              </DocsetContext.Provider>
            )}
          </Box>
        </DrawerContent>
      </Drawer>
    </>
  );
}

MobileNav.propTypes = {
  children: PropTypes.node.isRequired,
  configs: PropTypes.object.isRequired
};

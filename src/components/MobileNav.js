import PropTypes from 'prop-types';
import React from 'react';
import {
  Box,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  IconButton,
  useDisclosure
} from '@chakra-ui/react';
import {FiMenu} from 'react-icons/fi';

export default function MobileNav({children}) {
  const {isOpen, onOpen, onClose} = useDisclosure();
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
            {children}
          </Box>
        </DrawerContent>
      </Drawer>
    </>
  );
}

MobileNav.propTypes = {
  children: PropTypes.node.isRequired
};

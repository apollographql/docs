import PropTypes from 'prop-types';
import React, {useContext, useState} from 'react';
import {
  Box,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  IconButton,
  useDisclosure
} from '@chakra-ui/react';
import {DocsetContext, LeftSidebarNav, SidebarNav} from './Sidebar';
import {FiMenu} from 'react-icons/fi';
import {PathContext} from '../utils';

function MobileNavContent({configs}) {
  const {basePath, ...pathContext} = useContext(PathContext);
  const [activeDocset, setActiveDocset] = useState(basePath);
  return (
    <>
      {!activeDocset && <DrawerCloseButton zIndex="1" top="3" color="white" />}
      <Box overflow="auto" pos="relative" zIndex="0">
        <DocsetContext.Provider
          value={{
            configs,
            activeDocset,
            setActiveDocset,
            sidebarOpen: true,
            clickToSelect: true
          }}
        >
          {activeDocset ? (
            <PathContext.Provider
              value={{
                ...pathContext,
                basePath: `/${activeDocset}`
              }}
            >
              <SidebarNav
                key={activeDocset}
                currentVersion={configs[activeDocset].currentVersion}
                versions={configs[activeDocset].versions}
                docset={configs[activeDocset].docset}
                navItems={configs[activeDocset].navItems}
                onGoBack={() => setActiveDocset(null)}
                onVersionChange={version => {
                  setActiveDocset(version.slug);
                }}
              />
            </PathContext.Provider>
          ) : (
            <LeftSidebarNav />
          )}
        </DocsetContext.Provider>
      </Box>
    </>
  );
}

MobileNavContent.propTypes = {
  configs: PropTypes.object.isRequired
};

export default function MobileNav({configs}) {
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
          <MobileNavContent configs={configs} />
        </DrawerContent>
      </Drawer>
    </>
  );
}

MobileNav.propTypes = {
  configs: PropTypes.object.isRequired
};

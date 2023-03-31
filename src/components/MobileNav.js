import PropTypes from 'prop-types';
import React, {useContext, useState} from 'react';
import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  IconButton,
  useDisclosure
} from '@chakra-ui/react';
import {DocsetContext, LeftSidebarNav, SidebarNav} from './Sidebar';
import {FiMenu} from 'react-icons/fi';
import {PathContext} from '../utils';

export default function MobileNav({configs}) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {basePath, ...pathContext} = useContext(PathContext);
  const [activeDocset, setActiveDocset] = useState(basePath);

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
        </DrawerContent>
      </Drawer>
    </>
  );
}

MobileNav.propTypes = {
  configs: PropTypes.object.isRequired
};

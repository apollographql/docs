import AuthCheck from './AuthCheck';
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
import {useConfigs} from '../utils/config';

function MobileNavContent({defaultActiveDocset}) {
  const configs = useConfigs();
  const {basePath, ...pathContext} = useContext(PathContext);
  const [activeDocset, setActiveDocset] = useState(
    defaultActiveDocset || basePath
  );
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
  defaultActiveDocset: PropTypes.string
};

export default function MobileNav({isInternal}) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const pathContext = useContext(PathContext);
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
          {isInternal ? (
            <AuthCheck
              fallback={
                <PathContext.Provider
                  value={{
                    ...pathContext,
                    basePath: '/'
                  }}
                >
                  <MobileNavContent />
                </PathContext.Provider>
              }
            >
              <MobileNavContent />
            </AuthCheck>
          ) : (
            <MobileNavContent />
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}

MobileNav.propTypes = {
  isInternal: PropTypes.bool
};

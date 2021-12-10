import PropTypes from 'prop-types';
import React, {createContext, useContext} from 'react';
import {
  Button,
  Collapse,
  Stack,
  chakra,
  useColorMode,
  useTheme
} from '@chakra-ui/react';
import {FiChevronDown, FiChevronRight} from 'react-icons/fi';
import {Link as GatsbyLink} from 'gatsby';
import {join, relative} from 'path';

export const NavContext = createContext();

const isPathActive = (path, uri) => !relative(path, uri);
export const isGroupActive = (items, basePath, uri) =>
  getItemPaths(items, basePath).some(path => isPathActive(path, uri));

const getFullPath = (path, basePath) => join('/', basePath, path);
const getItemPaths = (items, basePath) =>
  items.flatMap(({children}) =>
    Array.isArray(children)
      ? getItemPaths(children, basePath)
      : getFullPath(children, basePath)
  );

function NavButton({isActive, depth, children, ...props}) {
  return (
    <Button
      variant="ghost"
      roundedLeft="0"
      colorScheme={isActive ? 'indigo' : 'gray'}
      {...props}
    >
      <chakra.span pl={depth * 2}>{children}</chakra.span>
    </Button>
  );
}

NavButton.propTypes = {
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool.isRequired,
  depth: PropTypes.number.isRequired
};

function NavGroup({group, depth}) {
  const {basePath, uri, nav, setNav} = useContext(NavContext);
  const isActive = isGroupActive(group.children, basePath, uri);
  const isOpen = nav[group.id];
  return (
    <Stack>
      <NavButton
        isActive={isActive}
        justifyContent="space-between"
        rightIcon={isOpen ? <FiChevronDown /> : <FiChevronRight />}
        onClick={() =>
          setNav({
            ...nav,
            [group.id]: !isOpen
          })
        }
        depth={depth}
      >
        {group.title}
      </NavButton>
      <Collapse in={isOpen}>
        <NavItems
          uri={uri}
          items={group.children}
          basePath={basePath}
          depth={depth + 1}
        />
      </Collapse>
    </Stack>
  );
}

NavGroup.propTypes = {
  group: PropTypes.object.isRequired,
  depth: PropTypes.number.isRequired
};

export default function NavItems({items, depth = 0}) {
  const theme = useTheme();
  const {basePath, uri} = useContext(NavContext);
  const {colorMode} = useColorMode();
  const {
    _hover: {bg: activeBg}
  } = theme.components.Button.variants.ghost({
    theme,
    colorMode,
    colorScheme: 'indigo'
  });
  return (
    <Stack>
      {items.map((item, index) => {
        if (Array.isArray(item.children)) {
          return <NavGroup key={index} group={item} depth={depth} />;
        }

        const path = getFullPath(item.children, basePath);
        const isActive = isPathActive(path, uri);
        return (
          <NavButton
            key={index}
            isActive={isActive}
            as={GatsbyLink}
            to={path}
            justifyContent="flex-start"
            depth={depth}
            bg={isActive && activeBg}
          >
            {item.title}
          </NavButton>
        );
      })}
    </Stack>
  );
}

NavItems.propTypes = {
  items: PropTypes.array.isRequired,
  depth: PropTypes.number
};

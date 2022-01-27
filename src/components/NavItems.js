import PropTypes from 'prop-types';
import React, {useContext} from 'react';
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
import {NavContext, PathContext} from '../utils';
import {join, relative} from 'path';

const isPathActive = (path, uri) => !relative(path, uri);
export const isGroupActive = (items, basePath, uri) =>
  getItemPaths(items, basePath).some(path => isPathActive(path, uri));

const getFullPath = (path, basePath) => join('/', basePath, path);
const getItemPaths = (items, basePath) =>
  items.flatMap(({path, children}) =>
    children ? getItemPaths(children, basePath) : getFullPath(path, basePath)
  );

function NavButton({isActive, depth, children, ...props}) {
  return (
    <Button
      variant="ghost"
      roundedLeft="none"
      roundedRight="full"
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
  const {nav, setNav} = useContext(NavContext);
  const {basePath, uri} = useContext(PathContext);
  const isActive = isGroupActive(group.children, basePath, uri);
  const isOpen = nav[group.id];
  return (
    <Stack align="flex-start">
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
  const {basePath, uri} = useContext(PathContext);
  const {colorMode} = useColorMode();
  const {
    _hover: {bg: activeBg}
  } = theme.components.Button.variants.ghost({
    theme,
    colorMode,
    colorScheme: 'indigo'
  });
  return (
    <Stack align="flex-start">
      {items.map((item, index) => {
        if (item.children) {
          return <NavGroup key={index} group={item} depth={depth} />;
        }

        const path = getFullPath(item.path, basePath);
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

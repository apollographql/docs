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
import {FiChevronDown, FiChevronRight, FiExternalLink} from 'react-icons/fi';
import {Link as GatsbyLink} from 'gatsby';
import {NavContext, PathContext, isUrl} from '../utils';
import {join, relative} from 'path';

const isPathActive = (path, uri) => !relative(path, uri);
export const isGroupActive = (items, basePath, uri) =>
  getItemPaths(items, basePath).some(path => isPathActive(path, uri));

const getFullPath = (path, basePath) => join('/', basePath, path);
const getItemPaths = (items, basePath) =>
  items.flatMap(({path, children}) =>
    children ? getItemPaths(children, basePath) : getFullPath(path, basePath)
  );

const NavStack = props => <Stack spacing="1" align="flex-start" {...props} />;

function NavButton({isActive, depth, children, ...props}) {
  return (
    <Button
      h="auto"
      py="2.5"
      whiteSpace="normal"
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
    <NavStack>
      <NavButton
        isActive={isActive}
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
    </NavStack>
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
    <NavStack>
      {items.map((item, index) => {
        if (item.children) {
          return <NavGroup key={index} group={item} depth={depth} />;
        }

        if (isUrl(item.path)) {
          return (
            <NavButton
              key={index}
              as="a"
              href={item.path}
              target="_blank"
              rel="noreferrer noopener"
              rightIcon={<FiExternalLink />}
            >
              {item.title}
            </NavButton>
          );
        }

        const path = getFullPath(item.path, basePath);
        const isActive = isPathActive(path, uri);
        return (
          <NavButton
            key={index}
            isActive={isActive}
            depth={depth}
            bg={isActive && activeBg}
            as={GatsbyLink}
            to={path}
          >
            {item.title}
          </NavButton>
        );
      })}
    </NavStack>
  );
}

NavItems.propTypes = {
  items: PropTypes.array.isRequired,
  depth: PropTypes.number
};

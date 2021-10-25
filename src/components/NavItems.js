import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  Collapse,
  Stack,
  chakra,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useTheme
} from '@chakra-ui/react';
import {FiChevronDown, FiChevronRight} from 'react-icons/fi';
import {Link as GatsbyLink} from 'gatsby';
import {join, relative} from 'path-browserify';

const isPathActive = (path, uri) => !relative(path, uri);
const getFullPath = (path, basePath) => join('/', basePath, path);
const getItemPaths = (items, basePath) =>
  Object.values(items).flatMap(path =>
    typeof path === 'string'
      ? getFullPath(path, basePath)
      : getItemPaths(path, basePath)
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

function NavGroup({label, uri, items, basePath, depth}) {
  const itemPaths = getItemPaths(items, basePath);
  const isActive = itemPaths.some(path => isPathActive(path, uri));
  const {isOpen, onToggle} = useDisclosure({
    defaultIsOpen: isActive
  });
  return (
    <Stack>
      <NavButton
        isActive={isActive}
        justifyContent="space-between"
        rightIcon={isOpen ? <FiChevronDown /> : <FiChevronRight />}
        onClick={onToggle}
        depth={depth}
      >
        {label}
      </NavButton>
      <Collapse in={isOpen}>
        <NavItems
          uri={uri}
          items={items}
          basePath={basePath}
          depth={depth + 1}
        />
      </Collapse>
    </Stack>
  );
}

NavGroup.propTypes = {
  uri: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  items: PropTypes.object.isRequired,
  basePath: PropTypes.string.isRequired,
  depth: PropTypes.number.isRequired
};

export default function NavItems({items, uri, basePath, depth = 0}) {
  const theme = useTheme();
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
      {Object.entries(items).map(([key, value], index) => {
        if (typeof value === 'string') {
          const path = getFullPath(value, basePath);
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
              {key}
            </NavButton>
          );
        }
        return (
          <NavGroup
            uri={uri}
            key={index}
            label={key}
            items={value}
            basePath={basePath}
            depth={depth}
          />
        );
      })}
    </Stack>
  );
}

NavItems.propTypes = {
  uri: PropTypes.string.isRequired,
  items: PropTypes.object.isRequired,
  basePath: PropTypes.string.isRequired,
  depth: PropTypes.number
};

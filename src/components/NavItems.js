import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  Collapse,
  Link,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import {Link as GatsbyLink} from 'gatsby';
import {join, relative} from 'path-browserify';

function NavGroup({label, uri, items, basePath}) {
  const {isOpen, onToggle} = useDisclosure();
  return (
    <div>
      <Button onClick={onToggle}>{label}</Button>
      <Collapse in={isOpen}>
        <NavItems uri={uri} items={items} basePath={basePath} />
      </Collapse>
    </div>
  );
}

NavGroup.propTypes = {
  uri: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  items: PropTypes.object.isRequired,
  basePath: PropTypes.string.isRequired
};

export default function NavItems({items, uri, basePath}) {
  const activeColor = useColorModeValue('indigo.500', 'indigo.200');
  return Object.entries(items).map(([key, value], index) => {
    if (typeof value === 'string') {
      const path = join('/', basePath, value);
      const isActive = !relative(path, uri);
      return (
        <div key={index}>
          <Link as={GatsbyLink} to={path} color={isActive && activeColor}>
            {key}
          </Link>
        </div>
      );
    }
    return (
      <NavGroup
        uri={uri}
        key={index}
        label={key}
        items={value}
        basePath={basePath}
      />
    );
  });
}

NavItems.propTypes = {
  uri: PropTypes.string.isRequired,
  items: PropTypes.object.isRequired,
  basePath: PropTypes.string.isRequired
};

import PropTypes from 'prop-types';
import React, {createContext, useContext} from 'react';
import {Link as GatsbyLink} from 'gatsby';
import {Link, useColorModeValue} from '@chakra-ui/react';
import {isAbsolute, resolve} from 'path-browserify';

export const PathContext = createContext();

export default function RelativeLink({href, ...props}) {
  const path = useContext(PathContext);
  const linkColor = useColorModeValue('indigo.500', 'indigo.200');
  try {
    const url = new URL(href);
    return <Link color={linkColor} href={url.toString()} {...props} />;
  } catch (error) {
    return (
      <Link
        color={linkColor}
        as={GatsbyLink}
        to={isAbsolute(href) ? href : resolve(path, href)}
        {...props}
      />
    );
  }
}

RelativeLink.propTypes = {
  href: PropTypes.string.isRequired
};

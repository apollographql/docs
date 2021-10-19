import PropTypes from 'prop-types';
import React, {createContext, useContext} from 'react';
import {Link} from 'gatsby';
import {isAbsolute, resolve} from 'path-browserify';

export const PathContext = createContext();

export default function RelativeLink({href, ...props}) {
  const path = useContext(PathContext);
  try {
    const url = new URL(href);
    return <a href={url.toString()} {...props} />;
  } catch (error) {
    return (
      <Link to={isAbsolute(href) ? href : resolve(path, href)} {...props} />
    );
  }
}

RelativeLink.propTypes = {
  href: PropTypes.string.isRequired
};

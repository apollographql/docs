import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {Button, Link} from '@chakra-ui/react';
import {Link as GatsbyLink, graphql, useStaticQuery} from 'gatsby';
import {PathContext, isUrl} from '../utils';
import {isAbsolute, resolve} from 'path';

export const PrimaryLink = props => (
  <Link
    color="primary"
    sx={{
      code: {
        color: 'inherit'
      }
    }}
    {...props}
  />
);

function useLinkProps(href) {
  const {path} = useContext(PathContext);
  const {site} = useStaticQuery(
    graphql`
      {
        site {
          pathPrefix
        }
      }
    `
  );

  if (!href) {
    return null;
  }

  const isExternal = isUrl(href);
  if (isExternal || href.startsWith('#')) {
    return {
      href,
      target: isExternal ? '_blank' : null
    };
  }

  const to = isAbsolute(href) ? href : resolve(path, href);
  return {
    as: GatsbyLink,
    to: to.replace(new RegExp(`^${site.pathPrefix}`), '')
  };
}

export default function RelativeLink({href, ...props}) {
  const linkProps = useLinkProps(href);
  return linkProps ? (
    <PrimaryLink {...linkProps} {...props} />
  ) : (
    <a {...props} />
  );
}

RelativeLink.propTypes = {
  href: PropTypes.string.isRequired
};

export function ButtonLink({href, ...props}) {
  const linkProps = useLinkProps(href);
  return <Button as="a" {...linkProps} {...props} />;
}

ButtonLink.propTypes = {
  href: PropTypes.string.isRequired
};

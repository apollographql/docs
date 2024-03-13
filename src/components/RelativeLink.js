import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {Button, Link} from '@chakra-ui/react';
import {Link as GatsbyLink, graphql, useStaticQuery} from 'gatsby';
import {OutlinkSmallIcon} from './Icons';
import {PathContext, isUrl} from '../utils';
import {isAbsolute, resolve} from 'path';

export const PrimaryLink = props => {
  return props?.target === '_blank' ? (
    <ButtonLink
      variant="link"
      color="tertiary"
      textDecor="underline"
      fontWeight="normal"
      fontSize="inherit"
      _hover={{color: 'link'}}
      iconSpacing="5px"
      marginRight="5px"
      sx={{
        code: {
          color: 'inherit'
        }
      }}
      {...props}
    />
  ) : (
    <Link
      color="tertiary"
      textDecor="underline"
      fontWeight="normal"
      _hover={{color: 'link'}}
      sx={{
        code: {
          color: 'inherit'
        }
      }}
      {...props}
    />
  );
};

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

  if (process.env.CONTEXT !== 'production') {
    // fix up absolute urls pointing to the docs
    // for netlify previews and localhost
    href = href.replace(
      'https://www.apollographql.com/docs',
      process.env.DEPLOY_URL
    );
  }

  try {
    // convert full urls for the current domain into absolute domain-relative urls
    const url = new URL(href);
    if (
      url.host === window.location.host &&
      href.startsWith('https://www.apollographql.com/docs/') &&
      !href.includes('/ios/docc/')
    ) {
      href = url.pathname;
    }
  } catch {
    // it's okay if this fails, then it probably wasn't a full url
  }

  const isExternal = isUrl(href);
  const isHash = href.startsWith('#');
  const isFile = /\.[a-z]+$/.test(href);
  if (isExternal || isHash || isFile) {
    return {
      href,
      target: isExternal || (isFile && !isHash) ? '_blank' : null
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
  const isExternal = isUrl(href);
  return (
    <Button
      as="a"
      {...linkProps}
      {...props}
      rightIcon={isExternal && <OutlinkSmallIcon />}
    />
  );
}

ButtonLink.propTypes = {
  href: PropTypes.string.isRequired
};

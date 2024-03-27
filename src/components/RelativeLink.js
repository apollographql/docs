import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {Box, Button, Link} from '@chakra-ui/react';
import {Link as GatsbyLink, graphql, useStaticQuery} from 'gatsby';
import {OutlinkSmallIcon} from './Icons';
import {PathContext, isUrl} from '../utils';
import {isAbsolute, resolve} from 'path';

export const PrimaryLink = props => {
  const opensNewTab = props?.target === '_blank';
  return (
    <Link
      color="tertiary"
      fontWeight="medium"
      fontSize="inherit"
      _hover={{color: 'link'}}
      display="inline-flex"
      alignItems="center"
      whiteSpace="initial"
      wordBreak="break-word"
      sx={{
        code: {
          color: 'inherit'
        }
      }}
      {...props}
    >
      <Box whiteSpace="initial" wordBreak="break-word">
        {props.children}
      </Box>
      {opensNewTab && (
        <Box marginLeft="5px">
          <OutlinkSmallIcon />
        </Box>
      )}
    </Link>
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
  if (
    isExternal &&
    href.startsWith('https://www.apollographql.com/') &&
    !href.includes('referrer')
  ) {
    href += href.includes('?')
      ? '&referrer=docs-content'
      : '?referrer=docs-content';
  }
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

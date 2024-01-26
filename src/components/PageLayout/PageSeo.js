import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import getShareImage from '@jlengstorf/get-share-image';
import {GatsbySeo} from 'gatsby-plugin-next-seo';
import {PathContext} from '../../utils';
import {graphql, useStaticQuery} from 'gatsby';

export function PageSeo({docset, title, description, noindex}) {
  const {uri} = useContext(PathContext);

  const {
    site: {
      siteMetadata: {siteUrl}
    }
  } = useStaticQuery(
    graphql`
      query GetSiteUrl {
        site {
          siteMetadata {
            siteUrl
          }
        }
      }
    `
  );

  const titleFont = encodeURIComponent('Aeonik, sans-serif');

  return (
    <GatsbySeo
      noindex={noindex}
      title={title}
      description={description}
      canonical={siteUrl + uri}
      openGraph={{
        title,
        description,
        images: [
          {
            url: getShareImage({
              title,
              tagline: docset,
              titleFont,
              titleFontSize: 80,
              titleExtraConfig: '_bold',
              taglineFont: titleFont,
              textColor: 'FFEADB',
              textLeftOffset: 80,
              textAreaWidth: 1120,
              cloudName: 'apollographql',
              imagePublicID: 'docs-thumbnail_zjdqzj'
            })
          }
        ]
      }}
    />
  );
}

PageSeo.propTypes = {
  title: PropTypes.string.isRequired,
  docset: PropTypes.string.isRequired,
  description: PropTypes.string,
  noindex: PropTypes.bool
};

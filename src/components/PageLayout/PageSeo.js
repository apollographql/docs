import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import getShareImage from '@jlengstorf/get-share-image';
import {GatsbySeo} from 'gatsby-plugin-next-seo';
import {PathContext} from '../../utils';
import {graphql, useStaticQuery} from 'gatsby';

export function PageSeo({docset, title, description}) {
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

  const titleFont = encodeURIComponent('Source Sans Pro');

  return (
    <GatsbySeo
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
              textColor: 'FFFFFF',
              textLeftOffset: 80,
              textAreaWidth: 1120,
              cloudName: 'apollographql',
              imagePublicID: 'apollo-docs-template2_dohzxt'
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
  description: PropTypes.string
};

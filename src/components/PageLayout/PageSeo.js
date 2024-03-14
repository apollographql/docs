import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import getShareImage from '@jlengstorf/get-share-image';
import {GatsbySeo} from 'gatsby-plugin-next-seo';
import {PathContext} from '../../utils';
import {graphql, useStaticQuery} from 'gatsby';
import {truncate} from 'lodash';

export function PageSeo({title, description, noindex}) {
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

  return (
    <GatsbySeo
      noindex={noindex}
      title={title}
      description={description}
      canonical={siteUrl + uri.replace(/\/$/, '')}
      openGraph={{
        title,
        description,
        images: [
          {
            url: getShareImage({
              title,
              tagline: truncate(description, {length: 148, separator: /,? +/}),
              taglineFont: 'odyssey:fonts:InterRegular.ttf',
              taglineColor: 'B4C0BF',
              titleFont: 'odyssey:fonts:AeonikBold.otf',
              textColor: 'CFD7D6',
              titleFontSize: 80,
              textLeftOffset: 90,
              textAreaWidth: 1120,
              cloudName: 'apollographql',
              imagePublicID: 'docs-thumbnail_z8ifvw'
            })
          }
        ]
      }}
    />
  );
}

PageSeo.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  noindex: PropTypes.bool
};

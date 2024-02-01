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
      canonical={siteUrl + uri}
      openGraph={{
        title,
        description,
        images: [
          {
            url: getShareImage({
              title,
              tagline: truncate(description, {length: 100, separator: /,? +/}),
              titleFont: 'odyssey:fonts:AeonikBold.otf',
              titleFontSize: 80,
              taglineFont: 'odyssey:fonts:InterRegular.ttf',
              textColor: 'C6CFCE',
              textLeftOffset: 150,
              textAreaWidth: 1120,
              cloudName: 'apollographql',
              imagePublicID: 'docs-thumbnail_xdb1xi'
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

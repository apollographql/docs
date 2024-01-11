import PropTypes from 'prop-types';
import React from 'react';
import {AspectRatio} from '@chakra-ui/react';
import {Script} from 'gatsby';

export const WistiaEmbed = ({videoId}) => (
  <div>
    <Script src="https://fast.wistia.net/assets/external/E-v1.js" />
    <AspectRatio ratio={16 / 9}>
      <iframe
        title={videoId}
        src={`//fast.wistia.net/embed/iframe/${videoId}?seo=true`}
        allowFullScreen
        className="wistia_embed"
        name="wistia_embed"
        width="100%"
        height="100%"
      />
    </AspectRatio>
  </div>
);

WistiaEmbed.propTypes = {
  videoId: PropTypes.string.isRequired
};

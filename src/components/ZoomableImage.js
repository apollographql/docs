import 'react-medium-image-zoom/dist/styles.css';
import PropTypes from 'prop-types';
import React from 'react';
import Zoom from 'react-medium-image-zoom';

export const ZoomableImage = ({src, alt, className, width = '500'}) => {
  return width > 500 ? (
    <Zoom>
      <img alt={alt} src={src} className={className} width={width} />
    </Zoom>
  ) : (
    <img alt={alt} src={src} className={className} width={width} />
  );
};

ZoomableImage.propTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.string,
  className: PropTypes.string,
  alt: PropTypes.string
};

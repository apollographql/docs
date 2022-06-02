import PropTypes from 'prop-types';
import React from 'react';
import YouTubePlayer from 'react-player/youtube';

export const YouTube = ({youTubeId}) => (
  <YouTubePlayer url={`https://www.youtube.com/watch?v=${youTubeId}`} />
);

YouTube.propTypes = {
  youTubeId: PropTypes.string.isRequired
};

import PropTypes from 'prop-types';
import React from 'react';
import YouTubePlayer from 'react-player/youtube';
import {AspectRatio} from '@chakra-ui/react';

export const YouTube = ({youTubeId}) => (
  <AspectRatio ratio={16 / 9}>
    <YouTubePlayer
      url={`https://www.youtube.com/watch?v=${youTubeId}`}
      height="100%"
      width="100%"
      controls="1"
    />
  </AspectRatio>
);

YouTube.propTypes = {
  youTubeId: PropTypes.string.isRequired
};

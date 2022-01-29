import PropTypes from 'prop-types';
import React from 'react';
import {HStack, Heading, Tag, Text} from '@chakra-ui/react';

export default function Preview({preview}) {
  const {title, excerpt, categories} = preview;
  return (
    <div>
      <Heading size="lg">{title}</Heading>
      <Text>{excerpt}</Text>
      <HStack>
        {categories.map((category, index) => (
          <Tag variant="outline" colorScheme="indigo" key={index}>
            {category}
          </Tag>
        ))}
      </HStack>
    </div>
  );
}

Preview.propTypes = {
  preview: PropTypes.object.isRequired
};

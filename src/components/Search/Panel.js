import Preview from './Preview';
import PropTypes from 'prop-types';
import React from 'react';
import Results from './Results';
import {SimpleGrid, useColorModeValue} from '@chakra-ui/react';

export default function Panel({autocomplete, autocompleteState}) {
  const markColor = useColorModeValue('indigo.600', 'inherit');
  return (
    <SimpleGrid
      columns="2"
      sx={{
        mark: {
          bg: 'none',
          color: markColor,
          fontWeight: 'semibold',
          textDecoration: 'underline'
        }
      }}
      {...autocomplete.getPanelProps({})}
    >
      <Results
        autocomplete={autocomplete}
        collections={autocompleteState.collections}
      />
      {autocompleteState.context.preview && (
        <Preview preview={autocompleteState.context.preview} />
      )}
    </SimpleGrid>
  );
}

Panel.propTypes = {
  autocomplete: PropTypes.object.isRequired,
  autocompleteState: PropTypes.object.isRequired
};

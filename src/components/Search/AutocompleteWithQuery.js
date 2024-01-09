import Autocomplete from './Autocomplete';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';

const AutocompleteWithQuery = ({onClose, optionalFilters}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Read the URL parameters and set isOpen based on the search query
    const initialQuery = new URL(window.location).searchParams.get('search');
    setIsOpen(Boolean(initialQuery));
  }, []);

  return (
    <Autocomplete
      isOpen={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={onClose}
      optionalFilters={optionalFilters}
    />
  );
};

AutocompleteWithQuery.propTypes = {
  onClose: PropTypes.func.isRequired,
  optionalFilters: PropTypes.array
};

export default AutocompleteWithQuery;

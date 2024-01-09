import Autocomplete from './Autocomplete';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';

const AutocompleteWithQuery = ({onClose, optionalFilters}) => {
  // Read the URL parameters and set isOpen based on the search query
  const initialQuery = new URL(window.location).searchParams.get('search');
  const [isOpen, setIsOpen] = useState(Boolean(initialQuery));

  useEffect(() => {
    const handleUrlChange = () => {
      const newQuery = new URL(window.location).searchParams.get('search');
      setIsOpen(Boolean(newQuery));
    };

    // Attach event listener for URL changes
    window.addEventListener('popstate', handleUrlChange);

    // Cleanup function
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []); // Run this effect only once during component mount

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

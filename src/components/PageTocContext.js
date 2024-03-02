import PropTypes from 'prop-types';
import React, {createContext, useCallback, useContext, useState} from 'react';

const PageTocContext = createContext(null);

export const usePageTocContext = () => {
  const value = useContext(PageTocContext);

  if (!value) {
    return {
      setShowPageToc: () => {},
      togglePageToc: () => {},
      showPageToc: true
    };
  }
  return value;
};

export const PageTocProvider = ({children}) => {
  const [showPageToc, setShowPageToc] = useState(true);

  const togglePageToc = useCallback(() => {
    setShowPageToc(!showPageToc);
  }, [showPageToc]);

  return (
    <PageTocContext.Provider
      value={{
        setShowPageToc,
        togglePageToc,
        showPageToc
      }}
    >
      {children}
    </PageTocContext.Provider>
  );
};

PageTocProvider.propTypes = {
  children: PropTypes.node
};

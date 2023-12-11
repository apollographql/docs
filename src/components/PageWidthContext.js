import PropTypes from 'prop-types';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import useLocalStorage from 'react-use/lib/useLocalStorage';

const PageWidthContext = createContext(null);

/**
 * Accesses the current context value
 * @returns {{
 *  pageWidthPx: number,
 *  pageWidth: 'normal' | 'jumbo',
 *  setPageWidth: (width: 'normal' | 'jumbo') => void,
 *  togglePageWidth: () => void,
 *  pageRefCallback: (elem: HTMLElement) => void,
 *  showExpandButton: boolean,
 * }} context value
 */
export const usePageWidthContext = () => {
  const value = useContext(PageWidthContext);

  if (!value) {
    // Default values and stubs in case the PageWidthProvider is not in the tree
    return {
      pageWidthPx: 0,
      pageWidth: 'normal',
      setPageWidth: () => {},
      togglePageWidth: () => {},
      pageRefCallback: () => {},
      showExpandButton: false
    };
  }
  return value;
};

export const PAGE_NORMAL_WIDTH = 1120;
export const PAGE_JUMBO_WIDTH = 1800;
export const DOCS_PAGE_WIDTH_VAR = '--docs-page-width';

/**
 * PageWidthProvider that must be used
 * @param {{children: React.ReactNode}} props
 */
export const PageWidthProvider = ({children}) => {
  const [pageWidth, setPageWidth] = useLocalStorage('page-width', 'normal');
  const [showExpandButton, setShowExpandButton] = useState(false);
  /**
   * Create a ref for the ResizeObserver
   * @type {React.MutableRefObject<ResizeObserver>}
   */
  const resizeObserverRef = useRef();

  const calculateExpandButtonVisibility = useCallback(
    /**
     * Given an element, determines the visibility of the expand button
     * @param {HTMLElement} elem page element
     * @returns {boolean} if the expand button should be visible
     */
    elem => {
      return elem.getBoundingClientRect().width / PAGE_NORMAL_WIDTH >= 1;
    },
    []
  );

  // Create ref callback to pass to the page element
  const pageRefCallback = useCallback(
    /**
     * Ref callback to be used on the page element
     * @param {HTMLElement} elem page element
     */
    elem => {
      // If there is already an observer, disconnect it and create a new
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }

      // When the element doesn't exist, do nothing
      if (elem === null) {
        return;
      }

      // Create a resize observer to watch the page element for bounding box changes
      resizeObserverRef.current = new ResizeObserver(entries => {
        // Iterate entries to find element and pass to
        for (const entry of entries) {
          if (entry.target === elem) {
            setShowExpandButton(calculateExpandButtonVisibility(elem));
          }
        }
      });

      // Begin observation of element, and
      resizeObserverRef.current.observe(elem);

      // Calculate button state
      setShowExpandButton(calculateExpandButtonVisibility(elem));
    },
    [calculateExpandButtonVisibility]
  );

  const togglePageWidth = useCallback(() => {
    setPageWidth(pageWidth === 'normal' ? 'jumbo' : 'normal');
  }, [pageWidth, setPageWidth]);

  // Calculate the page width in pixels from the current state
  const pageWidthPx =
    pageWidth === 'normal' ? PAGE_NORMAL_WIDTH : PAGE_JUMBO_WIDTH;

  useEffect(() => {
    const root = document.querySelector(':root');
    root.style.setProperty(DOCS_PAGE_WIDTH_VAR, pageWidthPx + 'px');
  }, [pageWidthPx]);

  // Create a context provider with values
  return (
    <PageWidthContext.Provider
      value={{
        pageWidthPx,
        pageWidth,
        setPageWidth,
        togglePageWidth,
        pageRefCallback,
        showExpandButton
      }}
    >
      {children}
    </PageWidthContext.Provider>
  );
};

PageWidthProvider.propTypes = {
  children: PropTypes.node
};

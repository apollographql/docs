import PaginationButton from './PaginationButton';
import PropTypes from 'prop-types';
import React, {useContext, useMemo} from 'react';
import {FiChevronLeft, FiChevronRight} from 'react-icons/fi';
import {Flex} from '@chakra-ui/react';
import {
  PathContext,
  flattenNavItems,
  getFullPath,
  isPathActive
} from '../../utils';

export function Pagination({navItems}) {
  const {uri, basePath} = useContext(PathContext);

  const [prevItem, nextItem] = useMemo(() => {
    const navLinks = flattenNavItems(navItems).filter(
      navItem =>
        // only include link items
        !navItem.children &&
        // and just local pages
        navItem.path.startsWith('/')
    );
    const currentIndex = navLinks.findIndex(navItem => {
      const fullPath = getFullPath(navItem.path, basePath);
      return isPathActive(fullPath, uri);
    });

    return [navLinks[currentIndex - 1], navLinks[currentIndex + 1]];
  }, [navItems, basePath, uri]);

  return (
    <Flex mt="10">
      {prevItem && (
        <PaginationButton
          key="prev"
          label="Previous"
          item={prevItem}
          leftIcon={<FiChevronLeft />}
          pl="3"
        />
      )}
      {nextItem && (
        <PaginationButton
          key="next"
          ml="auto"
          textAlign="right"
          label="Next"
          rightIcon={<FiChevronRight />}
          item={nextItem}
          pr="3"
        />
      )}
    </Flex>
  );
}

Pagination.propTypes = {
  navItems: PropTypes.array.isRequired
};

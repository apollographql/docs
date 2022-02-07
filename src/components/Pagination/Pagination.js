import PaginationButton from './PaginationButton';
import PropTypes from 'prop-types';
import React, {useContext, useMemo} from 'react';
import {FiChevronLeft, FiChevronRight} from 'react-icons/fi';
import {Flex} from '@chakra-ui/react';
import {PathContext} from '../../utils';
import {getFullPath, isPathActive} from '../NavItems';

const flattenNavItems = navItems =>
  navItems.flatMap(navItem =>
    navItem.children ? flattenNavItems(navItem.children) : navItem
  );

export function Pagination({navItems}) {
  const {uri, basePath} = useContext(PathContext);

  const [prevItem, nextItem] = useMemo(() => {
    const flatNavItems = flattenNavItems(navItems).filter(navItem =>
      // only include local pages
      navItem.path.startsWith('/')
    );
    const currentIndex = flatNavItems.findIndex(navItem => {
      const fullPath = getFullPath(navItem.path, basePath);
      return isPathActive(fullPath, uri);
    });

    return [flatNavItems[currentIndex - 1], flatNavItems[currentIndex + 1]];
  }, [navItems, basePath, uri]);

  return (
    <Flex mt="10">
      {prevItem && (
        <PaginationButton
          label="Previous"
          item={prevItem}
          leftIcon={<FiChevronLeft />}
          pl="3"
        />
      )}
      {nextItem && (
        <PaginationButton
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

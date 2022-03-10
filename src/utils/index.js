import {createContext} from 'react';
import {join, relative} from 'path';
import {useColorModeValue} from '@chakra-ui/react';

export const NavContext = createContext();
export const PathContext = createContext();

export const isUrl = string => /^https?:\/\//.test(string);

export const isPathActive = (path, uri) => !relative(path, uri);
export const getFullPath = (path, basePath) => join('/', basePath, path);

export const flattenNavItems = items =>
  items.flatMap(item =>
    item.children ? [item, ...flattenNavItems(item.children)] : item
  );

export function useTagColors() {
  const bg = useColorModeValue('indigo.50', 'indigo.400');
  const textColor = useColorModeValue('indigo.500', 'inherit');
  return [bg, textColor];
}

export function useFieldTableStyles() {
  const teal = useColorModeValue('teal.600', 'teal.300');
  return {
    td: {
      ':not(:last-child)': {
        h6: {
          mb: 1,
          fontSize: 'lg',
          fontWeight: 'normal'
        },
        p: {
          code: {
            p: 0,
            bg: 'none',
            fontSize: 'sm',
            color: teal
          }
        }
      },
      ':last-child': {
        lineHeight: 'base',
        fontSize: 'md',
        p: {
          ':not(:last-child)': {
            mb: 2
          }
        }
      }
    }
  };
}

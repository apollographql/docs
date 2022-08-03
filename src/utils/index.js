import {createContext} from 'react';
import {join, relative} from 'path';
import {useColorModeValue} from '@chakra-ui/react';
import {withPrefix} from 'gatsby';

export const NavContext = createContext();
export const PathContext = createContext();

export const isUrl = string => /^https?:\/\//.test(string);

export const isPathActive = (path, uri) =>
  !relative(
    // we need to prepend the path prefix to make this work properly in prod
    withPrefix(path),
    uri
  );
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
  const requiredBg = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  return {
    'tr.required': {
      bg: requiredBg
    },
    td: {
      ':first-child': {
        [['h5', 'h6']]: {
          mb: 1,
          fontSize: 'md',
          fontWeight: 'normal'
        },
        p: {
          fontSize: 'sm',
          code: {
            p: 0,
            bg: 'none',
            color: teal
          }
        },
        code: {
          fontSize: 'inherit'
        }
      },
      ':not(:first-child)': {
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

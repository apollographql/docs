import {createContext} from 'react';
import {useColorModeValue} from '@chakra-ui/react';

export * from './mermaid';

export const NavContext = createContext();
export const PathContext = createContext();

export const isUrl = string => /^https?:\/\//.test(string);

export function useTagColors() {
  const bg = useColorModeValue('indigo.50', 'indigo.400');
  const textColor = useColorModeValue('indigo.500', 'inherit');
  return [bg, textColor];
}

export const useAccentColor = () =>
  useColorModeValue('indigo.500', 'indigo.200');

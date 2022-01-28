import {createContext} from 'react';

export const NavContext = createContext();
export const PathContext = createContext();

export const isUrl = string => /^https?:\/\//.test(string);

import { createContext, useContext } from 'react';

export const ApiDocContext = createContext();
export function useApiDocContext() {
    const value = useContext(ApiDocContext);
    if (!value) throw new Error('`useApiDocContext` can only be used wrapped in `ApiDocContext.Prodiver`!')
    return value
}
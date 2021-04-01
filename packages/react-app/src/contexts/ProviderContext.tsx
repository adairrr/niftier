import { JsonRpcProvider } from '@ethersproject/providers';
import React, { createContext, useContext } from 'react';

export interface ProviderContextProps {
  userProvider: any;
  localProvider: JsonRpcProvider;
  mainnetProvider: JsonRpcProvider;
};

export const ProviderContext = createContext<ProviderContextProps>({
    userProvider: undefined, 
    localProvider: undefined,
    mainnetProvider: undefined
});

export const useProviderContext = () => useContext(ProviderContext);

export default useProviderContext;

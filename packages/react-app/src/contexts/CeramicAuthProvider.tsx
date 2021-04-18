import React, { createContext, ReactNode, useContext } from 'react';
import { CeramicAuthStore } from '../store';
import { CeramicAuthInstance } from '../store/CeramicAuthStore';

export const CeramicAuthContext = createContext<CeramicAuthStore>(undefined);

export const useCeramicContext = () => useContext(CeramicAuthContext);

interface CeramicAuthProviderProps {
  children: ReactNode;
}

const CeramicAuthProvider = ({ children }: CeramicAuthProviderProps) => (
  <CeramicAuthContext.Provider value={CeramicAuthInstance}>{children}</CeramicAuthContext.Provider>
);

export default CeramicAuthProvider;

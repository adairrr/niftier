import React, { createContext, useContext } from 'react';

export interface ContractIOContextProps {
  tx: any,
  reader: any,
  writer: any
};

export const ContractIOContext = createContext<ContractIOContextProps>({
  tx: undefined, 
  reader: undefined, 
  writer: undefined
});

export const useContractIOContext = () => useContext(ContractIOContext);

export default useContractIOContext;

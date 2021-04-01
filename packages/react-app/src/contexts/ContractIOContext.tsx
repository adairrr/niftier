import React, { createContext, useContext } from 'react';

interface ContractIO {
  tx: any,
  reader: any,
  writer: any
};

export const ContractIOContext = createContext<ContractIO>({tx: undefined, reader: undefined, writer: undefined});

export const useContractIOContext = () => useContext(ContractIOContext);

export default useContractIOContext;

import React from 'react';
import { AddressContext, ContractIOContext, ProviderContext, BlockExplorerContext } from '.';
import { ContractIOContextProps } from './ContractIOContext';
import { ProviderContextProps } from './ProviderContext';

// a combined provider that can provide things used in globalContext

interface EthContextProviderProps {
  currentAddress: string;
  contractsIo: ContractIOContextProps;
  providers: ProviderContextProps;
  blockExplorer: string;
  children: any
}

const EthContextProvider = ({ currentAddress, contractsIo, providers, blockExplorer, children }: EthContextProviderProps) => (
  <AddressContext.Provider value={currentAddress}>
    <ContractIOContext.Provider value={contractsIo}>
      <ProviderContext.Provider value={providers}>
        <BlockExplorerContext.Provider value={blockExplorer}>
          {children}
        </BlockExplorerContext.Provider>
      </ProviderContext.Provider>
    </ContractIOContext.Provider>
  </AddressContext.Provider>
);

export default EthContextProvider;

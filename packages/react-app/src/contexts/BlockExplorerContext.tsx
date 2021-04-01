import React, { createContext, useContext } from 'react';

export const BlockExplorerContext = createContext<string>(undefined);

export const useBlockExplorerContext = () => useContext(BlockExplorerContext);

export default useBlockExplorerContext;

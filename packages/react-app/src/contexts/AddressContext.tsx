import React, { createContext, useContext } from 'react';

export const AddressContext = createContext<string>('');

export const useAddressContext = () => useContext(AddressContext);

export default useAddressContext;

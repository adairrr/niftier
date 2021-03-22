import { createContext, useCallback, useState } from 'react';

// export interface AddressContext {
//   address: string;
//   setCurrentAddress: (currentAddress: string) => void;
// }

// const DEFAULT_VALUE: AddressContext = {
//   address: undefined,
//   setCurrentAddress: () => {},
// };

// export const addressContext = createContext<AddressContext>(DEFAULT_VALUE);

// export const useAddress = (): AddressContext => {
//   const [ address, setAddress ] = useState(undefined);

//   const setCurrentAddress = useCallback((currentAddress: string): void => {
//     setAddress(currentAddress);
//   }, []);

//   return {
//     address,
//     setCurrentAddress,
//   }
// }

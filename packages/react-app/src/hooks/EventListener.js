import { useState, useEffect } from "react";

/*
  ~ What it does? ~

  Enables you to keep track of events 

  ~ How can I use? ~

  const setPurposeEvents = useEventListener(readContracts, "YourContract", "SetPurpose", localProvider, 1);

  ~ Features ~

  - Provide readContracts by loading contracts (see more on ContractLoader.js)
  - Specify the name of the contract, in this case it is "YourContract"
  - Specify the name of the event in the contract, in this case we keep track of "SetPurpose" event
  - Specify the provider 
*/

export default function useEventListener(contracts, contractName, eventName, provider, startBlock, args) {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    // let mounted = true;
    if (typeof provider !== "undefined" && typeof startBlock !== "undefined") {
      // if you want to read _all_ events from your contracts, set this to the block number it is deployed
      provider.resetEventsBlock(startBlock);
    }
    if (contracts && contractName && contracts[contractName]) {
      try {
        contracts[contractName].on(eventName, (...args) => {
          let blockNumber = args[args.length - 1].blockNumber
          setUpdates(messages => [Object.assign({blockNumber},args.pop().args), ...messages]);
        });
        return () => {
          contracts[contractName].removeListener(eventName);
        };
      } catch (e) {
        console.log(e);
      }
    }
    // return () => mounted = false;
  }, [provider, startBlock, contracts, contractName, eventName]);

  return updates;
}

/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState, useEffect, useRef } from "react";
import { Button, List, Card } from "antd";
import { Address, AddressInput, TokenId } from "../components";
import { useQuery, gql } from '@apollo/client';
import { BigNumber, utils } from 'ethers';
import { JsonRpcProvider } from "@ethersproject/providers";
import { PINATA_IPFS_PREFIX } from "../constants";
import { ACCOUNT_BALANCE_QUERY } from '../apollo/queries'
import { getFromIPFS } from "../hooks";

type UserTokensProps = {
  address: string, 
  mainnetProvider: JsonRpcProvider, 
  blockExplorer: string,
  tx, 
  readContracts, 
  writeContracts
}

const UserTokens = ({
  address, 
  mainnetProvider, 
  blockExplorer,
  tx, 
  readContracts, 
  writeContracts 
}: UserTokensProps) => {

  const componentIsMounted = useRef(true);

  const [ userTokens, setUserTokens ] = useState([]);
  const [ userTokenImages, setUserTokenImages ] = useState({})
  const [ transferToAddresses, setTransferToAddresses ] = useState([])
  const [ fetching, setFetching ] = useState(false);
  
  const { loading, error, data } = useQuery(ACCOUNT_BALANCE_QUERY, {
    variables: { accountId: address.toLowerCase() },
    pollInterval: 2000 // poll every 2 seconds
  });

  useEffect(() => {
    // each useEffect can return a cleanup function
    return () => {
      componentIsMounted.current = false;
    };
  }, []); // no extra deps => the cleanup function runs this on component unmount

  useEffect(() => {
    const fetchUserTokens = async () => {
      setFetching(true);
      console.log(data);
      if (!userTokens || data.account.balances.length !== userTokens.length) {
        let queriedTokens = [];
        data.account.balances.forEach(async (balance) => {
          if (balance.value === '0') return; // TODO should update mapping to remove balance?
          const token = balance.token;
          
          try {
            const tokenUri = token.uri.replace(PINATA_IPFS_PREFIX, '');
            
            console.log(`Fetching ipfs data for ${token.id} with uri: ${tokenUri}`);
            if (tokenUri != null) {
              const jsonManifestBuffer = await getFromIPFS(tokenUri);

              try {
                const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
                console.log("jsonManifest", jsonManifest);
                queriedTokens.push({ id:token.id, uri:tokenUri, owner: address, ...jsonManifest });
              } catch(e) {console.log(e)}
            }
          } catch (err) {
            console.log(err);
          }
        }
        );
        if (componentIsMounted.current) {
          setUserTokens(queriedTokens);
        }
      }
      setFetching(false);
    }
    if (!loading && data && data.account) {
      fetchUserTokens();
    }
  }, [data]);

  if (loading) return (<span>'Loading...'</span>);
  if (error) return (<span>`Error! ${error.message}`</span>);
  if (data.account == null) return (<span>`Account: ${address.toLowerCase()} does not exist in the database.`</span>)
  if (!userTokens) return (<span>WAIT</span>);
  // if (userTokens.length == 0) return 'Waiting';
  // if (data.account == null) return `No balance found for ${address}`;
  
  return (
    <div>
      <div style={{ width:640, margin: "auto", marginTop:32, paddingBottom:32 }}>
        <List
          bordered
          loading={fetching}
          dataSource={userTokens}
          renderItem={(token) => {
            const tokenId = token.id;
            return (
              <List.Item key={`${tokenId}_${token.uri}_${token.owner}`}>
                <Card title={(
                  <div>
                    <span style={{fontSize:16, marginRight:8}}>
                      <TokenId 
                        id={tokenId}
                        fontSize={16}
                      />
                    </span> {token.name}
                  </div>
                  )} loading={fetching}>
                  <div><img src={token.image} style={{maxWidth:150}} /></div>
                  <div>{token.description}</div>
                </Card>

                <div>
                  owner: <Address
                      address={token.owner}
                      ensProvider={mainnetProvider}
                      blockExplorer={blockExplorer}
                      fontSize={16}
                  />
                  <AddressInput
                    ensProvider={mainnetProvider}
                    placeholder="transfer to address"
                    value={transferToAddresses[tokenId]}
                    onChange={(newValue: string)=>{
                      let update = {};
                      update[tokenId] = newValue;
                      setTransferToAddresses({ ...transferToAddresses, ...update});
                    }}
                  />
                  <Button onClick={()=>{
                    console.log("writeContracts", writeContracts);
                    tx( writeContracts.TypedERC1155Composable.safeTransferFrom(
                      address, 
                      transferToAddresses[tokenId],
                      tokenId,
                      1,
                      utils.toUtf8Bytes('')
                    ));
                  }}>
                    Transfer
                  </Button>
                  <Button onClick={() => {
                    console.log("readContracts", readContracts);
                    tx( readContracts.TypedERC1155Composable.balanceOf(
                      address, 
                      BigNumber.from(tokenId)
                    ));
                  }}>
                    Balance
                  </Button>
                </div>
              </List.Item>
            )
          }}
        />
      </div>
    </div>
  );
}

export default UserTokens;

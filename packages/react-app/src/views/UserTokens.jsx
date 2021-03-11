/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState, useEffect, useRef } from "react";
import { Button, List, Card } from "antd";
import { Address, AddressInput, TokenId } from "../components";
import { useQuery, gql } from '@apollo/client';

export default function UserTokens({
  address, 
  mainnetProvider, 
  userProvider, 
  localProvider, 
  yourLocalBalance, 
  getFromIPFS, 
  blockExplorer,
  tx, 
  readContracts, 
  writeContracts 
}) {


  const ACCOUNT_BALANCE = gql`
    query UserTokens($accountId: ID!) {
      account(id: $accountId) {
        id
        balances {
          token {
            id
            uri
          }
          value
        }
      }
    }
  `;

  const componentIsMounted = useRef(true);

  const [ userTokens, setUserTokens ] = useState();
  const [ transferToAddresses, setTransferToAddresses ] = useState({})
  
  const { loading, error, data } = useQuery(ACCOUNT_BALANCE, {
    variables: { accountId: address.toLowerCase() }
    // pollInterval: 2000 // poll every 2 seconds
  });

  useEffect(() => {
    // each useEffect can return a cleanup function
    return () => {
      componentIsMounted.current = false;
    };
  }, []); // no extra deps => the cleanup function runs this on component unmount

  useEffect(() => {
    const fetchUserTokens = async () => {
      let queriedTokens = [];
      if (!userTokens || data.account.balances.length != userTokens.length) {
        data.account.balances.forEach(async (balance) => {
          const token = balance.token;
          try {
            const tokenUri = token.uri;
            console.log(`Fetching ipfs data for ${token.id} with uri: ${tokenUri}`);
            if (tokenUri != null) {
              const jsonManifestBuffer = await getFromIPFS(tokenUri);

              try {
                const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
                console.log("jsonManifest", jsonManifest);
                queriedTokens.push({ id:token.id, uri:tokenUri, owner: address, ...jsonManifest });
              } catch(e) {console.log(e)}
              // we set the user tokens here so we can load piecemeally <- lol word?
              if (componentIsMounted.current) {
                setUserTokens(queriedTokens);
              }
            }
          } catch (err) {
            console.log(err);
          }
        });
      }
    }
    if (!loading && data && data.account) {
      fetchUserTokens();
    }
  }, [data]);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error}`;
  if (data.account == null) return `Account: ${address} does not exist in the database.`
  if (!userTokens) return "WAIT";
  // if (userTokens.length == 0) return 'Waiting';
  // if (data.account == null) return `No balance found for ${address}`;
  
  return (
    <div style={{ width:640, margin: "auto", marginTop:32, paddingBottom:32 }}>
      <List
        bordered
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
              )}>
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
                  onChange={(newValue)=>{
                    let update = {};
                    update[tokenId] = newValue;
                    setTransferToAddresses({ ...transferToAddresses, ...update});
                  }}
                />
                <Button onClick={()=>{
                  console.log("writeContracts", writeContracts);
                  tx( writeContracts.YourCollectible.transferFrom(address, transferToAddresses[tokenId], tokenId) )
                }}>
                  Transfer
                </Button>
              </div>
            </List.Item>
          )
        }}
      />
    </div>
  );
}

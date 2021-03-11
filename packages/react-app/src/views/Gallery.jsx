/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState, useEffect, useRef } from "react";
import { Button, List, Card } from "antd";
import { Address, AddressInput, TokenId } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";
import { useContractReader } from "../hooks";

export default function Gallery({
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


  
  const tokenBalance = useContractReader(
    readContracts,
    "TypedERC1155Composable", 
    "balanceOfAccount", 
    [address]
  );
  // console.log("🤗 tokenBalance:", tokenBalance);

  //
  // 🧠 This effect will update userComposables by polling when your balance changes
  //
  const userBalance = tokenBalance && tokenBalance.toNumber && tokenBalance.toNumber();
  const [ userComposables, setUserComposables ] = useState();

  useEffect(()=>{
    const updateUserComposables = async () => {
      let composableUpdate = []
      for (let tokenIndex = 0; tokenIndex < tokenBalance; ++tokenIndex) {
        try {
          console.log("Getting token index", tokenIndex);
          const tokenId = await readContracts.TypedERC1155Composable.getApprovedTokenByIndex(address, tokenIndex);
          console.log("tokenId",tokenId)
          const tokenURI = await readContracts.TypedERC1155Composable.tokenUris(tokenId);
          console.log("tokenURI",tokenURI)

          // const ipfsHash =  tokenURI.replace("https://ipfs.io/ipfs/","")
          // console.log("ipfsHash",ipfsHash)

          const jsonManifestBuffer = await getFromIPFS(tokenURI);

          try {
            const jsonManifest = JSON.parse(jsonManifestBuffer.toString())
            console.log("jsonManifest", jsonManifest)
            composableUpdate.push({ id:tokenId, uri:tokenURI, owner: address, ...jsonManifest })
          } catch(e) {console.log(e)}

        } catch(e) {console.log(e)}
      }
      setUserComposables(composableUpdate);
    }
    updateUserComposables();
  },[ address, userBalance ]);

  const [ transferToAddresses, setTransferToAddresses ] = useState({})


  return (
    <div>
      <div style={{ width:640, margin: "auto", marginTop:32, paddingBottom:32 }}>
        <List
          bordered
          dataSource={userComposables}
          renderItem={(item) => {
            const id = item.id.toHexString()
            return (
              <List.Item key={id+"_"+item.uri+"_"+item.owner}>

                <Card title={(
                  <div>
                    <span style={{fontSize:16, marginRight:8}}>
                      <TokenId 
                        id={id}
                        fontSize={16}
                      />
                    </span> {item.name}
                  </div>
                )}>
                <div><img src={item.image} style={{maxWidth:150}} /></div>
                <div>{item.description}</div>
                </Card>

                <div>
                  owner: <Address
                      address={item.owner}
                      ensProvider={mainnetProvider}
                      blockExplorer={blockExplorer}
                      fontSize={16}
                  />
                  <AddressInput
                    ensProvider={mainnetProvider}
                    placeholder="transfer to address"
                    value={transferToAddresses[id]}
                    onChange={(newValue)=>{
                      let update = {};
                      update[id] = newValue;
                      setTransferToAddresses({ ...transferToAddresses, ...update});
                    }}
                  />
                  <Button onClick={()=>{
                    console.log("writeContracts", writeContracts);
                    tx( writeContracts.YourCollectible.transferFrom(address, transferToAddresses[id], id) )
                  }}>
                    Transfer
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

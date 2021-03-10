/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import "antd/dist/antd.css";
import { Button, Typography, Table, Input } from "antd";
import { useQuery, gql } from '@apollo/client';
import { Address } from "../components";
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.min.css';
import fetch from 'isomorphic-fetch';
import { utils } from "ethers";

export default function Mint(
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
) {

  /*
      <div style={{width:780, margin: "auto", paddingBottom:64}}>

        <div style={{margin:32, textAlign:'right'}}>
          <Input onChange={(e)=>{setNewPurpose(e.target.value)}} />
          <Button onClick={()=>{
            console.log("newPurpose", newPurpose)
            props.tx( props.writeContracts.YourContract.setPurpose(newPurpose) )
          }}>Set Purpose</Button>
        </div>

        {data?<Table dataSource={data.purposes} columns={purposeColumns} rowKey={"id"} />:<Typography>{(loading?"Loading...":deployWarning)}</Typography>}
      </div>
  */

  const [tokenUri, setTokenUri] = useState("loading...");
  const [newType, setNewType] = useState("loading...");

  return (
    <>
      <div style={{width:780, margin: "auto", paddingBottom:64}}>
        <div style={{margin:32, textAlign:'right'}}>
          <Input onChange={(e)=>{setNewType(e.target.value)}} />
          <Button onClick={()=>{
            console.log("newPurpose", newType)
            tx( writeContracts.ERC1155Composable.createTokenType(utils.formatBytes32String(newType)) )
          }}>CreateTokenType</Button>
        </div>
      </div>
    </>
  );
}

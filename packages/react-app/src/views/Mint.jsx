/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import "antd/dist/antd.css";
import { Button, Typography, Table, Input, Select } from "antd";
import { useQuery, gql } from '@apollo/client';
import { Address } from "../components";
import fetch from 'isomorphic-fetch';
import { utils } from "ethers";
const { Option } = Select;

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

  const TOKEN_TYPES = gql`
    query TokenTypes {
      tokenTypes(orderBy: id) {
        id
        name
        authorizedParents {
          id
          parent {
            id
            name
          }
        }
        authorizedChildren {
          id
          child {
            id
            name
          }
        }
      }
    }
  `;

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
      "tokenTypes": [
      {
        "authorizedChildren": [
          {
            "child": {
              "id": "0x2",
              "name": "LAYER_TYPE"
            },
            "id": "0x1-0x2"
          }
        ],
        "authorizedParents": [],
        "id": "0x1",
        "name": "ARTPIECE_TYPE"
      },
      {
        "authorizedChildren": [
          {
            "child": {
              "id": "0x3",
              "name": "CONTROLLER_TYPE"
            },
            "id": "0x2-0x3"
          }
        ],
        "authorizedParents": [
          {
            "id": "0x1-0x2",
            "parent": {
              "id": "0x1",
              "name": "ARTPIECE_TYPE"
            }
          }
        ],
        "id": "0x2",
        "name": "LAYER_TYPE"
      },
      {
        "authorizedChildren": [],
        "authorizedParents": [
          {
            "id": "0x2-0x3",
            "parent": {
              "id": "0x2",
              "name": "LAYER_TYPE"
            }
          }
        ],
        "id": "0x3",
        "name": "CONTROLLER_TYPE"
      }
    ]
  */

  const { loading, error, data } = useQuery(TOKEN_TYPES);
  
  const [parentTokenTypeName, setParentTokenTypeName] = useState(null);
  const [childTokenTypes, setChildTokenTypes] = useState(null);
  const [childTokenTypeName, setChildTokenTypeName] = useState(null);

  // const [tokenUri, setTokenUri] = useState("loading...");
  // const [newType, setNewType] = useState("loading...");

  const handleParentTypeChange = (parentTypeIndex) => {
    console.log(parentTypeIndex);
    setParentTokenTypeName(data.tokenTypes[parentTypeIndex].name);
    setChildTokenTypes(data.tokenTypes[parentTypeIndex].authorizedChildren);
    // setChildTokenType(data.tokenTypes[parentTypeIndex].authorizedChildren[0]);
  };

  const onChildTypeChange = (childTypeIndex) => {
    setChildTokenTypeName(childTokenTypes[childTypeIndex].child.name);
  };

  if (loading) return 'Loading...';
  if (error) return `Error! ${error}`;

  return (
    <>
      <div style={{width:780, margin: "auto", paddingBottom:64}}>
        <Select defaultValue={data.tokenTypes[0].name} style={{ width: 180 }} onChange={handleParentTypeChange}>
          {data.tokenTypes.map((tokenType, index) => (
            <Option key={index}>{tokenType.name}</Option>
          ))}
          {console.log(`Children of ${parentTokenTypeName} are ${childTokenTypes}`)}
        </Select>
        {childTokenTypes && childTokenTypes.length != 0 &&
          <Select style={{ width: 180 }} value={childTokenTypes[0].child.name} onChange={onChildTypeChange}>
            {childTokenTypes.map((childTokenType, index) => (
              <Option key={index}>{childTokenType.child.name}</Option>
            ))}
            {console.log(`ChildType name: ${childTokenTypeName}`)}
          </Select>
        }
        {/* <div style={{margin:32, textAlign:'right'}}>
          <Input onChange={(e)=>{setNewType(e.target.value)}} />
          <Button onClick={()=>{
            console.log("newPurpose", newType)
            tx( writeContracts.ERC1155Composable.createTokenType(utils.formatBytes32String(newType)) )
          }}>CreateTokenType</Button>
        </div> */}
      </div>
    </>
  );
}

/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import "antd/dist/antd.css";
import { Button, Typography, Table, Input, Select } from "antd";
import { useQuery, gql } from '@apollo/client';
import { Address } from "../components";
import fetch from 'isomorphic-fetch';
import { utils } from "ethers";
import { useDropzone } from 'react-dropzone'

const { Option } = Select;


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

interface AuthorizedChild {
  id: string,
  child: {
    id: string,
    name: string
  }
}

interface AuthorizedParent {
  id: string,
  parent: {
    id: string,
    name: string
  }
} 

interface TokenType {
  id: string,
  name: string,
  authorizedChildren: AuthorizedChild[],
  authorizedParents: AuthorizedParent[]
}

interface TokenTypeData {
  tokenTypes: TokenType[]
}

const TokenTypeSelector = ({}) => {

  const { loading, error, data } = useQuery<TokenTypeData>(TOKEN_TYPES);
  
  const [parentTokenTypeName, setParentTokenTypeName] = useState(null);
  const [childTokenTypes, setChildTokenTypes] = useState(null);
  const [childTokenTypeName, setChildTokenTypeName] = useState(null);


  const handleParentTypeChange = (parentTypeIndex) => {
    console.log(parentTypeIndex);
    setParentTokenTypeName(data.tokenTypes[parentTypeIndex].name);
    setChildTokenTypes(data.tokenTypes[parentTypeIndex].authorizedChildren);
  };

  const onChildTypeChange = (childTypeIndex) => {
    setChildTokenTypeName(childTokenTypes[childTypeIndex].child.name);
  };

  if (loading) return <div>'Loading...'</div>;
  if (error) return <div>`Error! ${error}`</div>;

  return (
    <>
      <div style={{width:780, margin: "auto", paddingBottom:64}}>
        <Select defaultValue={data.tokenTypes[0].name} style={{ width: 180 }} onChange={handleParentTypeChange}>
          {data.tokenTypes.map((tokenType, index) => (
            <Option key={index} value={index}>{tokenType.name}</Option>
          ))}
          {/* {console.log(`Children of ${parentTokenTypeName} are ${childTokenTypes}`)} */}
        </Select>
        {childTokenTypes && childTokenTypes.length != 0 &&
          <Select style={{ width: 180 }} value={childTokenTypes[0].child.name} onChange={onChildTypeChange}>
            {childTokenTypes.map((childTokenType, index: number) => (
              <Option key={index} value={index}>{childTokenType.child.name}</Option>
            ))}
            {console.log(`ChildType name: ${childTokenTypeName}`)}
          </Select>
        }
      </div>
    </>
  );
}

export default TokenTypeSelector;

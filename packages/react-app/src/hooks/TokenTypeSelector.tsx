/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Select } from 'antd';
import { useQuery, gql } from '@apollo/client';

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
  id: string;
  child: {
    id: string;
    name: string;
  };
}

interface AuthorizedParent {
  id: string;
  parent: {
    id: string;
    name: string;
  };
}

export interface TokenType {
  id: string;
  name: string;
  authorizedChildren: AuthorizedChild[];
  authorizedParents: AuthorizedParent[];
}

interface TokenTypeData {
  tokenTypes: TokenType[];
}

type TokenTypeSelectorProps = {
  onSelectedParent: (parent: TokenType) => void;
  // eslint-disable-next-line react/require-default-props
  selectChild?: boolean;
};

const TokenTypeSelector = ({ selectChild = false, onSelectedParent }: TokenTypeSelectorProps) => {
  const { loading, error, data } = useQuery<TokenTypeData>(TOKEN_TYPES);

  const [parentTokenTypeName, setParentTokenTypeName] = useState<string>(null);
  const [childTokenTypes, setChildTokenTypes] = useState<AuthorizedChild[]>(null);
  const [childTokenTypeName, setChildTokenTypeName] = useState<string>(null);

  const handleParentTypeChange = parentTypeIndex => {
    console.log(parentTypeIndex);
    setParentTokenTypeName(data.tokenTypes[parentTypeIndex].name);
    setChildTokenTypes(data.tokenTypes[parentTypeIndex].authorizedChildren);
    console.log(`Type selected: ${data.tokenTypes[parentTypeIndex]}`);
    console.log(data.tokenTypes[parentTypeIndex]);
    console.log(`index selected: ${parentTypeIndex}`);
    onSelectedParent(data.tokenTypes[parentTypeIndex]);
  };

  const onChildTypeChange = childTypeIndex => {
    setChildTokenTypeName(childTokenTypes[childTypeIndex].child.name);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>`Error! ${JSON.stringify(error)}`</div>;

  return (
    <>
      <div>
        <Select
          showSearch
          placeholder="Select a Type"
          style={{ width: 180 }}
          onChange={handleParentTypeChange}
          filterOption={(input, option) =>
            data.tokenTypes[option.value].name.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {data.tokenTypes.map((tokenType: TokenType, index: number) => (
            <Option key={tokenType.id} value={index}>
              {tokenType.name}
            </Option>
          ))}
          {/* {console.log(`Children of ${parentTokenTypeName} are ${childTokenTypes}`)} */}
        </Select>
        {selectChild && childTokenTypes && childTokenTypes.length !== 0 && (
          <Select
            showSearch
            placeholder="Select a Child Type"
            style={{ width: 180 }}
            value={childTokenTypes[0].child.name}
            onChange={onChildTypeChange}
            filterOption={(input, option) => option.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {/* TODO FIK THE CHILDREN FILTER */}
            {childTokenTypes.map((childTokenType: AuthorizedChild, index: number) => (
              <Option key={childTokenType.child.id} value={index}>
                {childTokenType.child.name}
              </Option>
            ))}
            {console.log(`ChildType name: ${childTokenTypeName}`)}
          </Select>
        )}
      </div>
    </>
  );
};

export default TokenTypeSelector;

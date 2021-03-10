import React, { useState } from "react";
import { Address, TokenId } from "../components";
import { useEventListener } from "../hooks";
import { List, Table } from "antd";
import { useQuery, gql } from '@apollo/client';

const { Column, ColumnGroup } = Table;

export default function Transfers({
  mainnetProvider,
  localProvider,
  readContracts,
  singleTransferEvents,
  batchTransferEvents
}) {

  const TRANSFERS = gql`
    query GetTransfers {
      transfers(orderBy: timestamp) {
        token {
          id
        }
        from {
          id
        }
        to {
          id
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(TRANSFERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:32 }}>
        <Table 
          bordered 
          dataSource={data.transfers}
          rowKey={(data) => [data.from.id, data.to.id, data.token.id].join("_")}
        >
        <Column
          title="TokenId"
          dataIndex="token"
          render={(token) => (
            <TokenId 
              id={token.id}
              fontSize={16}
            />
          )}
        />
        <Column
          title="From"
          dataIndex="from"
          render={(fromAddress) => (
            <Address
              address={fromAddress.id}
              ensProvider={mainnetProvider}
              fontSize={16}
            />
          )}
        />
        <Column
          title="To"
          dataIndex="to"
          render={(toAddress) => (
            <Address
              address={toAddress.id}
              ensProvider={mainnetProvider}
              fontSize={16} 
            />
          )}
        />
        </Table>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Address, TokenId } from "../components";
import { useEventListener } from "../hooks";
import { List, Table } from "antd";

const { Column, ColumnGroup } = Table;

export default function Transfers({
  mainnetProvider,
  localProvider,
  readContracts,
  singleTransferEvents,
  batchTransferEvents
}) {

  const [ transferToAddresses, setTransferToAddresses ] = useState({})

  return (
    <div>
      <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:32 }}>
        <Table 
          bordered 
          dataSource={singleTransferEvents}
          rowKey={(event) => [event[1], event[2], event[3], event.blocknumber].join('_')}
        >
        <Column
          title="TokenId"
          key={(event) => [event[1], event[2], event[3], event.blocknumber].join('_')}
          dataIndex="3"
          render={(tokenId) => (
            <TokenId 
              id={tokenId.toHexString()}
              fontSize={16}
            />
          )}
        />
        <Column
          title="From"
          dataIndex="1"
          key={(event) => [event[1], event[2], event[3], event.blocknumber].join('_')}
          render={(fromAddress) => (
            <Address
              address={fromAddress}
              ensProvider={mainnetProvider}
              fontSize={16}
            />
          )}
        />
        <Column
          title="To"
          key={(event) => [event[1], event[2], event[3], event.blocknumber].join('_')}
          dataIndex="2"
          render={(toAddress) => (
            <Address
              address={toAddress}
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

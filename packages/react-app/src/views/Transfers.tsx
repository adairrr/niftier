import React from 'react';
import { Address, TokenId } from '../components';
import { Table } from 'antd';
import { useQuery } from '@apollo/client';
import { TRANSFERS_QUERY } from '../apollo/queries';

const { Column } = Table;

export default function Transfers({}) {
  const { loading, error, data } = useQuery(TRANSFERS_QUERY, {
    pollInterval: 2000, // query every 2 seconds
  });

  if (loading) return <div>'Loading...'</div>;
  if (error) return <div>`Error! ${error.message}`</div>;

  return (
    <div>
      <div style={{ width: 600, margin: 'auto', marginTop: 32, paddingBottom: 32 }}>
        <Table
          bordered
          dataSource={data.transfers}
          rowKey={data => [data.from.id, data.to.id, data.token.id, data.timestamp].join('_')}
        >
          <Column title="TokenId" dataIndex="token" render={token => <TokenId id={token.id} fontSize={16} />} />
          <Column
            title="From"
            dataIndex="from"
            render={fromAddress => <Address address={fromAddress.id} fontSize={16} />}
          />
          <Column title="To" dataIndex="to" render={toAddress => <Address address={toAddress.id} fontSize={16} />} />
        </Table>
      </div>
    </div>
  );
}

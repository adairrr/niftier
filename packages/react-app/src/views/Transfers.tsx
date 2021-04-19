import React from 'react';
import { Table } from 'antd';
import { useQuery } from '@apollo/client';
import { Address, TokenId } from '../components';
import { TRANSFERS_QUERY } from '../apollo/queries';

const { Column } = Table;

const Transfers: React.FC = () => {
  const { loading, error, data } = useQuery(TRANSFERS_QUERY, {
    pollInterval: 2000, // query every 2 seconds
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>`Error! ${error.message}`</div>;

  return (
    <div>
      <div style={{ width: 600, margin: 'auto', marginTop: 32, paddingBottom: 32 }}>
        <Table
          bordered
          dataSource={data.transfers}
          rowKey={dataIt => [dataIt.from.id, dataIt.to.id, dataIt.token.id, dataIt.timestamp].join('_')}
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
};

export default Transfers;

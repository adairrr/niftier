/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button, List, Card, Empty, Tabs } from 'antd';
import { observer } from 'mobx-react-lite';
import StackGrid from 'react-stack-grid';
import Gallery from 'react-photo-gallery';
import { Address, AddressInput, EmptyWithDescription, TokenCard } from '../components';

import { useAddressContext, useContractIOContext } from '../contexts';
import { useQuery as useMstQuery } from '../subgraph_models/reactUtils';
import { BalanceModelType } from '../subgraph_models';
import './UserTokens.less';

const { TabPane } = Tabs;

const UserTokens = () => {
  const currentAddress = useAddressContext();
  const { tx, reader, writer } = useContractIOContext();

  const componentIsMounted = useRef(true);

  const [userBalances, setUserBalances] = useState<BalanceModelType[]>([]);

  const { setQuery, data: mstData, store: mstStore, error: mstError, loading: mstLoading } = useMstQuery<{
    balances: BalanceModelType[];
  }>();

  useMemo(() => {
    // TODO does this work properly as useMemo?
    if (currentAddress) setQuery(store => store.loadInitialBalances(currentAddress.toLowerCase()));
  }, [currentAddress, setQuery]);

  useEffect(() => {
    if (mstData?.balances) {
      setUserBalances(mstData.balances);
      mstData.balances.map(balance => balance.token);
    }
  }, [mstData]);

  console.log(mstError, mstLoading, mstData);

  useEffect(() => {
    // each useEffect can return a cleanup function
    return () => {
      componentIsMounted.current = false;
    };
  }, []); // no extra deps => the cleanup function runs this on component unmount

  const loadMoreBalances = () => {
    if (currentAddress) setQuery(mstStore.loadMoreBalances(currentAddress.toLowerCase()));
  };

  if (mstLoading || !mstData) return <span>Loading...</span>;
  if (mstError) return <span>`Error! ${mstError.message}`</span>;
  if (mstData?.balances == null || mstData.balances.length === 0)
    return (
      <EmptyWithDescription description="No tokens!">
        <Button type="primary">Create some</Button>
      </EmptyWithDescription>
    );
  if (!userBalances) return <span>WAIT</span>;
  // if (userTokens.length == 0) return 'Waiting';
  // if (data.account == null) return `No balance found for ${address}`;

  return (
    <div className="UserTokens">
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Artpieces" key="1">
          <StackGrid columnWidth={180} gutterWidth={10} component="div" itemComponent="div" monitorImagesLoaded>
            {mstStore.sortedBalances.slice().map((balance: BalanceModelType) => {
              return <TokenCard token={balance.token} key={balance.id} />;
            })}
          </StackGrid>
        </TabPane>
        <TabPane tab="Layers" key="2">
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab="Controllers" key="3">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
      {/* <Gallery photos={} */}

      {/* <div style={{ width:640, margin: 'auto', marginTop:32, paddingBottom:32 }}> */}

      {/* <List
          bordered
          loading={fetching}
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
                  )} loading={fetching}>
                  <div><img src={token.image} style={{maxWidth:150}} /></div>
                  <div>{token.description}</div>
                </Card>

                <div>
                  owner: <Address
                      address={token.owner}
                      fontSize={16}
                  />
                  <AddressInput
                    placeholder='transfer to address'
                    value={transferToAddresses[tokenId]}
                    onChange={(newValue: string)=>{
                      let update = {};
                      update[tokenId] = newValue;
                      setTransferToAddresses({ ...transferToAddresses, ...update});
                    }}
                  />
                  <Button onClick={()=>{
                    console.log('writeContracts', writer);
                    tx( writer.TypedERC1155Composable.safeTransferFrom(
                      currentAddress, 
                      transferToAddresses[tokenId],
                      tokenId,
                      1,
                      utils.toUtf8Bytes('')
                    ));
                  }}>
                    Transfer
                  </Button>
                  <Button onClick={() => {
                    console.log('readContracts', reader);
                    tx( reader.TypedERC1155Composable.balanceOf(
                      currentAddress, 
                      BigNumber.from(tokenId)
                    ));
                  }}>
                    Balance
                  </Button>
                </div>
              </List.Item>
            )
          }}
        /> */}
      {/* </div> */}
    </div>
  );
};

export default observer(UserTokens);

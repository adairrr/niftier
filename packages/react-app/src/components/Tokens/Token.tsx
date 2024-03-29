import React, { useState, useEffect, useRef } from 'react';
import { List, Card, Image, Row, Col, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { TokenId } from '..';
import { useAddressContext } from '../../contexts';
import { TokenModelType } from '../../subgraph_models';
import { useQuery as useMstQuery } from '../../subgraph_models/reactUtils';

const { Meta } = Card;
const { Paragraph, Title } = Typography;
// import Title from 'antd/lib/typography/Title';

type TokenProps = {
  tokenId: string;
};

type TokenParams = {
  tokenId: string;
};

interface BaseTokenData {
  id: string;
  uri: string;
}

interface ChildToken {
  child: BaseTokenData;
}

interface ParentToken {
  parent: BaseTokenData;
}

interface TokenData extends BaseTokenData {
  tokenType: {
    name: string;
  };
  children: ChildToken[];
  parents: ParentToken[];
}

// TODO what is it with react dom routing? I have no idea what these props would be... match doesn't work
const Token = () => {
  const currentAddress = useAddressContext();

  const { tokenId } = useParams<TokenParams>(); // gotten from the route...

  const componentIsMounted = useRef(true);

  const [parentToken, setParentToken] = useState<TokenModelType>();
  const [childTokens, setChildTokens] = useState<TokenModelType[]>();

  const { setQuery, data: mstData, store: mstStore, error: mstError, loading: mstLoading } = useMstQuery<{
    token: TokenModelType;
  }>(store => {
    return store.loadToken(tokenId);
  });

  console.log(mstError, mstLoading, mstData);
  console.log(mstData?.token);
  console.log(mstData?.token?.children);
  const children = mstData?.token?.children;
  if (children && children.length > 0) {
    console.log(children[0].child);
  }

  useEffect(() => {
    const token = mstData?.token;
    if (token) {
      setParentToken(token);
      if (token.children && token.children.length > 0) {
        setChildTokens(token.children.slice().map(childRelation => childRelation.child));
      }
    }
  }, [mstData]);

  useEffect(() => {
    // each useEffect can return a cleanup function
    return () => {
      componentIsMounted.current = false;
    };
  }, []); // no extra deps => the cleanup function runs this on component unmount

  // "token": {
  //   "children": [
  //     {
  //       "child": {
  //         "id": "0x24caa0753b0bafa6ae02c0b90dd379dafd97fe27469b776148a45f6e90422"
  //       }
  //     }
  //   ],
  //   "id": "0x1cdba2377be42d7a1bd6e694d826a803c06d58ef6e50c0f03608e76b21f62",
  //   "parents": [],
  //   "tokenType": {
  //     "name": "ARTPIECE_TYPE"
  //   }
  // }

  // TODO put this in a separate fc
  if (mstLoading || !mstData) return <span>Loading...</span>;
  if (mstError) return <span>`Error! ${mstError.message}`</span>;
  if (mstData?.token == null) return <span>Token: ${tokenId} was not found in the database.</span>;
  // if (!userTokens) return (<span>WAIT</span>);

  // title
  // description
  // picture
  // layers if artpiece
  //
  // if (parentTokenMeta === undefined) return( <div>No data</div>);

  return (
    <div>
      {parentToken && (
        <div>
          <Row justify="center">
            <Col span={6} order={1}>
              <Card>
                <Image src={parentToken.preview} />
              </Card>
            </Col>
            <Col span={10} order={2}>
              <Card
                title={
                  <>
                    <Title level={2}>{parentToken.name}</Title>
                  </>
                }
              >
                <span style={{ fontSize: 16, marginRight: 80 }}>
                  <TokenId id={tokenId} fontSize={16} />
                </span>
                <Paragraph>
                  <blockquote>{parentToken.description}</blockquote>
                </Paragraph>
              </Card>
              {childTokens && (
                <List
                  grid={{ gutter: 10, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
                  bordered
                  header="Children"
                  dataSource={childTokens}
                  renderItem={childToken => (
                    <List.Item>
                      <Card hoverable size="small" cover={<img alt="example" src={childToken.preview} />}>
                        <Meta title={childToken.name} description={<TokenId id={childToken.id} />} />
                      </Card>
                      {/* <div><img src={childMetadata.image} style={{maxWidth:150}} /></div> */}
                    </List.Item>
                  )}
                />
              )}
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default Token;

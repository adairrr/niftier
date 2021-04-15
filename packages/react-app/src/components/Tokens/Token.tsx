import ReactDOM from 'react-dom'
import React, { useState, useEffect, useRef, Component, useContext } from 'react';
import { Canvas, MeshProps, useFrame } from 'react-three-fiber';
import type { Mesh } from 'three'
import { Button, List, Card, Image, Row, Col, Typography } from 'antd';
import { Address, AddressInput, TokenId } from '..';
import { useQuery, gql } from '@apollo/client';
import { RouteComponentProps } from 'react-router';
import { useParams } from 'react-router-dom';
import { TOKEN_QUERY } from '../../apollo/queries';
import { PINATA_IPFS_PREFIX } from '../../constants';
import { fetchTokenMetadata, getFromIPFS } from '../../hooks';
import { TokenMetadata } from '../../hooks/FetchTokenMetadata';
import { useAddressContext } from '../../contexts';
import { TokenModelType, TokenRelationshipModelType } from '../../subgraph_models';
import { useQuery as useMstQuery } from '../../subgraph_models/reactUtils';
const { Meta } = Card;
const { Paragraph, Title } = Typography;
// import Title from 'antd/lib/typography/Title';
// import { FallbackImage } from '../images';


type TokenProps = {
  tokenId: string
}

type TokenParams = {
  tokenId: string
}

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
  }
  children: ChildToken[];
  parents: ParentToken[];
}

interface TokenQueryData {
  token: TokenData;
}

// TODO what is it with react dom routing? I have no idea what these props would be... match doesn't work
const Token = ({...props}: TokenProps) => {

  const currentAddress = useAddressContext();

  const {tokenId} = useParams<TokenParams>(); // gotten from the route...

  const componentIsMounted = useRef(true);

  const [ parentToken, setParentToken ] = useState<TokenModelType>();
  const [ parentTokenMeta, setParentTokenMeta ] = useState<TokenMetadata>(undefined);
  const [ childTokens, setChildTokens ] = useState<TokenModelType[]>();
  const [ childTokensMeta, setChildTokensMeta ] = useState<TokenMetadata[]>();

  const { 
    setQuery, 
    data: mstData, 
    store, 
    error: mstError, 
    loading: mstLoading
   } = useMstQuery<{token: TokenModelType}>((store) => {
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


  const { loading, error, data } = useQuery<TokenQueryData>(TOKEN_QUERY, {
    variables: { tokenId: tokenId },
    pollInterval: 2000 // poll every 2 seconds
  });

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

  useEffect(() => {
    const fetchTokenData = async () => {
      console.log(data);

      if (data && data.token) {
        const parentMetadata = await fetchTokenMetadata(data.token.id, data.token.uri, currentAddress);

        if (data.token.children.length > 0) {
          let childTokenMetadatas = [];
          data.token.children.forEach(async (childToken: ChildToken) => {
            const child = childToken.child;
            console.log(child);
            const childMetadata = await fetchTokenMetadata(child.id, child.uri, currentAddress);
            childTokenMetadatas.push(childMetadata);
          });

          if (componentIsMounted.current) {
            setChildTokensMeta(childTokenMetadatas);
            console.log("child token metas")
            console.log(childTokenMetadatas);
          }
        }

        if (componentIsMounted.current) {
          setParentTokenMeta(parentMetadata);
        }
      }
    }
    if (!loading && data && data.token) {
      fetchTokenData();
    }
  }, [data]);

  console.log(data);

  // TODO put this in a separate fc
  if (loading || mstLoading || !mstData) return (<span>'Loading...'</span>);
  if (error || mstError) return (<span>`Error! ${error? error.message : mstError.message}`</span>);
  if (data.token == null || mstData?.token == null) return (<span>Token: ${tokenId} was not found in the database.</span>)
  // if (!userTokens) return (<span>WAIT</span>);

  // title
  // description
  // picture
  // layers if artpiece
  // 
  // if (parentTokenMeta === undefined) return( <div>No data</div>);

  return (
    <div>
      {parentTokenMeta && 
        <div>
          <Row justify="center">
            <Col span={6} order={1}>
              <Card>
                <Image 
                  src={parentToken.preview}
                  // fallback={FallbackImage}
                />
              </Card>
            </Col>
            <Col span={10} order={2}>
              <Card title={(<><Title level={2}>{parentToken.name}</Title></>)}>
                <span style={{fontSize:16, marginRight:80}}>
                  <TokenId 
                    id={tokenId}
                    fontSize={16}
                  />
                </span>
                <Paragraph>
                  <blockquote>{parentToken.description}</blockquote>
                </Paragraph>
              </Card>
              {childTokens && 
                <List
                  grid={{gutter: 10,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 2,
                    xl: 3,
                    xxl: 3,
                  }}
                  bordered
                  header='Children'
                  dataSource={childTokens}
                  renderItem={(childToken) => (
                    <List.Item>
                      <Card 
                        hoverable 
                        size={'small'}
                        cover={
                          <img
                            alt="example"
                            src={childToken.preview}
                          />
                        }
                      >
                        <Meta
                          title={childToken.name}
                          description={<TokenId id={childToken.id}/>}
                        />
                      </Card>
                        {/* <div><img src={childMetadata.image} style={{maxWidth:150}} /></div> */}
                    </List.Item>
                  )}
                />
              }
            </Col>
          </Row>
          
          
          </div>}
      
    </div>
  )
}

export default Token;

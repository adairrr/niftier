import React, { useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { TokenModelType } from '../subgraph_models/TokenModel';
import { Avatar, Card, Image } from 'antd';
import { useQuery } from '../subgraph_models';
import { Link } from 'react-router-dom';
import * as AntIcon from '@ant-design/icons';
import './less/TokenCard.less';
const { Meta } = Card;

type TokenCardProps = {
  token: TokenModelType;
}

const TokenCard: React.FC<TokenCardProps> = ({ token }) => {

  const imageRef = useRef();

  const baseClassName = 'TokenCard';

  // const { setQuery, loading, error } = useQuery(token.)
  
  return (
    <div className={baseClassName}>
      <Image
        className={`${baseClassName}-preview`}
        src={token.preview}
        // TODO tiny blurry thumbnail (https://tinyurl.com/ct4ryh2b)
      />

      <div className={`${baseClassName}-token-info`}>
        {/* <Link to={`/tokens/${token.id}`}>
          <Avatar
            className="user-avatar"
            src={photo.user.profile_image.large}
          />
          <p className="username">{photo.user.name}</p>
        </Link> */}
        <Link to={`/token/${token.id}`}>
          <AntIcon.InfoCircleOutlined className="icon-circle" />
        </Link>
      </div>
      {/* <Card
        // style={{ width: 240 }}
        // loading={token.loadingMetadata}
        cover={<img alt="Token Preview" src={token.preview} />}
      >
        <Meta title={token.name} description={token.description} />
      </Card> */}
    </div>
  );
}

export default observer(TokenCard);

/*
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
*/

/*

    <div className='token-modal'>
      <img ref={imageRef} src={token.preview}/>
      <ModalImage
        small={token.preview}
        // large={token.preview}
        alt={token.description}
        className='token-modal-image'
        showRotate
      /> 
      <div className="token-info">
        {/* <Link to={`/users/${token.owner}`}>
          <Avatar
            className="user-avatar"
            src={token.owner.profile_image.large}
          />
          <p className="username">{token.owner.name}</p>
        </Link> 
        <Link to={`/tokens/${token.id}`}>
          <Icon className="icon-circle" type="info-circle" />
        </Link>
      </div>
    </div>

  */

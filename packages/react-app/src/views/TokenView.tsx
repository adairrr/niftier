import ReactDOM from 'react-dom'
import React, { useState, useEffect, useRef, Component } from 'react';
import { Canvas, MeshProps, useFrame } from 'react-three-fiber';
import type { Mesh } from 'three'
import { Button, List, Card } from 'antd';
import { Address, AddressInput, TokenId } from '../components';
import { useQuery, gql } from '@apollo/client';
import { BigNumber, utils } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { PINATA_IPFS_PREFIX } from '../constants';


type TokenViewProps = {
  address: string,
  tokenId: TokenId
}

const TokenView: React.FC<MeshProps> = (props) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef<Mesh>();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    if (mesh.current) mesh.current.rotation.x = mesh.current.rotation.y += 0.01
  })

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

export default TokenView;

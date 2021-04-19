import React, { useContext, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, message } from 'antd';
import { utils } from 'ethers';
import { ArtpieceStore, MintableLayerListStore } from '../../store';
import { useAddressContext } from '../../contexts';
import useContractIOContext from '../../contexts/ContractIOContext';
import { PinataResponse, uploadJson } from '../../helpers/pinata';

interface ArtpieceLayerMinterProps {
  artpiece: ArtpieceStore;
  layerList: MintableLayerListStore;
}

const ArtpieceLayerMinter: React.FC<ArtpieceLayerMinterProps> = ({ artpiece, layerList }) => {
  // TODO should account for recipient address eventually
  const currentAddress = useAddressContext();
  const { tx, reader, writer } = useContractIOContext();

  const baseClassName = 'ArtpieceLayerMinter';

  const onClickMintArtpieceAndLayers = async () => {
    let error = false;
    if (!artpiece || !artpiece.mediaUri) {
      error = true;
      message.warning('Need to upload the artpiece preview befare minting.');
    }
    layerList.layers.forEach(layer => {
      if (!layer.mediaUri) {
        error = true;
        message.error(`Missing a uri for layer ${layer}`);
      }
    });

    if (!error) {
      // composableorchestrator
      // TODO should come from graphql mobx thing
      const parentTokenTypeName = utils.formatBytes32String('ARTPIECE_TYPE');
      const childTokenTypeName = utils.formatBytes32String('LAYER_TYPE');
      const parentTokenUri = await artpiece.pinMetadata();
      const childTokenUris = await layerList.pinAndGetLayerUris();
      // just using amounts of one right now
      // @ts-ignore
      const childTokenAmounts = childTokenUris.slice().fill(1);

      console.log(
        'passed to ComposableOrchestrator',
        parentTokenTypeName,
        parentTokenUri,
        childTokenTypeName,
        childTokenUris,
        childTokenAmounts,
        currentAddress,
      );

      tx(
        writer.ComposableOrchestrator.mintChildrenAndParent(
          parentTokenTypeName,
          parentTokenUri,
          childTokenTypeName,
          childTokenUris,
          childTokenAmounts,
          currentAddress,
        ),
      );
    }
  };

  return (
    <div className={baseClassName}>
      <Button
        style={{ margin: 8 }}
        /* loading={uploading} */ size="large"
        shape="round"
        type="primary"
        onClick={onClickMintArtpieceAndLayers}
      >
        Mint
      </Button>
    </div>
  );
};

export default observer(ArtpieceLayerMinter);

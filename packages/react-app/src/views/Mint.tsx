/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState, useEffect, useContext, FunctionComponent } from 'react';
import 'antd/dist/antd.css';
import { Button, Input, Tabs } from 'antd';
import { utils } from 'ethers';
import ReactJson from 'react-json-view';
import { PinataResponse, uploadJson } from '../helpers/pinata';
import { TokenTypeSelector } from '../hooks';
import { TokenType } from '../hooks/TokenTypeSelector';
import { PINATA_IPFS_PREFIX } from '../constants';
import { DraggableDropzone } from '../components/Files';
import { useAddressContext, useContractIOContext } from '../contexts';
import { ArtpieceStore, MintableLayerStore, MintableLayerListStore } from '../store';

import { ArtpieceLayerMinter, MintableLayersPreview } from '../components/Mint';

const { TextArea } = Input;

interface TokenAttribute {
  trait_type: string;
  value: string;
}
interface TokenJson {
  description: string;
  external_url: string;
  image: string;
  name: string;
  attributes: TokenAttribute[];
}

const STARTING_JSON: TokenJson = {
  description: 'Token description',
  external_url: 'https://austingriffith.com/portfolio/paintings/', // <-- this can link to a page for the specific file too
  image: 'https://gateway.pinata.cloud/ipfs/iPfShAsH',
  name: 'Token name',
  attributes: [
    {
      trait_type: 'ComposableType',
      value: 'XXX_TYPE',
    },
    {
      trait_type: 'Creator',
      value: 'creator address',
    },
  ],
};

const Mint: FunctionComponent = () => {
  const currentAddress = useAddressContext();
  const { tx, reader, writer } = useContractIOContext();

  // TODO maybe doka image editor
  const [tokenUri, setTokenUri] = useState<TokenJson>(STARTING_JSON);
  const [tokenDescription, setTokenDescription] = useState<string>(null);
  const [selectedTokenType, setSelectedTokenType] = useState<TokenType>(undefined);

  const [uploading, setUploading] = useState(false);
  const [uploadedImageData, setUploadedImageData] = useState<PinataResponse>(null);
  const [tokenIpfsHash, setTokenIpfsHash] = useState<string>(null);
  const [uploadedJsonData, setUploadedJsonData] = useState<PinataResponse>(null);
  const [jsonHash, setJsonHash] = useState<string>();
  const [tokenName, setTokenName] = useState<string>(null);
  const [layerList] = useState(new MintableLayerListStore([new MintableLayerStore('Layer 1', true)]));
  const [artpiece] = useState(new ArtpieceStore('Artpiece'));

  const handleSuccessfulUpload = (uploadResponse: PinataResponse) => {
    console.log('Upload response');
    console.log(uploadResponse);
    setUploadedImageData(uploadResponse);
    setTokenIpfsHash(uploadResponse.IpfsHash);
  };

  useEffect(() => {
    const updatedJson = tokenUri;
    if (tokenDescription) updatedJson.description = tokenDescription;
    if (tokenName) updatedJson.name = tokenName;
    if (selectedTokenType) {
      updatedJson.attributes[0].value = selectedTokenType.name;
    }
    if (currentAddress) updatedJson.attributes[1].value = currentAddress;
    if (uploadedImageData) updatedJson.image = PINATA_IPFS_PREFIX.concat(tokenIpfsHash);
    setTokenUri(updatedJson);
  }, [tokenName, tokenDescription, selectedTokenType, currentAddress, uploadedImageData, tokenIpfsHash, tokenUri]);

  const onClickUploadJson = async () => {
    console.log('UPLOADING json...', tokenUri);
    setUploading(true);
    setJsonHash(undefined); // reset json
    const uploadResp = await uploadJson(JSON.stringify(tokenUri));
    const uploadData: PinataResponse = await uploadResp.json();

    console.log(`Upload data : ${uploadData}`);
    console.log(uploadData);
    setUploadedJsonData(uploadData);
    setJsonHash(uploadData.IpfsHash);
    setUploading(false);
  };

  const onClickMintToken = async () => {
    console.log('Minting the Token!');
    await tx(
      writer.TypedERC1155Composable.mint(
        currentAddress,
        utils.formatBytes32String(selectedTokenType.name),
        PINATA_IPFS_PREFIX.concat(jsonHash),
        1, // TODO amount,
        currentAddress,
        utils.toUtf8Bytes(''), // TODO make functions for these lols
      ),
    );
  };

  return (
    <>
      <MintableLayersPreview layerList={layerList} artpiece={artpiece} />
      <ArtpieceLayerMinter layerList={layerList} artpiece={artpiece} />
      <div />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          {/* <PinataDropzone onSuccessfulUpload={handleSuccessfulUpload}/> */}
          <DraggableDropzone onSuccessfulUpload={handleSuccessfulUpload} />
          <Input
            type="text"
            name="title"
            placeholder="Token Name"
            onChange={e => setTokenName(e.target.value)}
            value={tokenName}
          />
          <div>
            <TokenTypeSelector onSelectedParent={setSelectedTokenType} />
          </div>

          <TextArea rows={3} placeholder="Description" onChange={e => setTokenDescription(e.target.value)} />
        </div>
        <div>
          <div style={{ paddingTop: 32, width: 740, margin: 'auto', textAlign: 'left' }}>
            <ReactJson
              style={{ padding: 8 }}
              src={tokenUri}
              theme="pop"
              enableClipboard={false}
              displayDataTypes={false}
            />
          </div>

          <Button
            style={{ margin: 8 }}
            loading={uploading}
            size="large"
            shape="round"
            type="primary"
            onClick={onClickUploadJson}
          >
            Upload JSON to IPFS
          </Button>
        </div>
        <div style={{ padding: 16, paddingBottom: 150 }}>{jsonHash}</div>
      </div>
      <div>
        {jsonHash && (
          <Button style={{ margin: 8 }} size="large" shape="round" type="primary" onClick={onClickMintToken}>
            Mint the damn token!
          </Button>
        )}
      </div>
    </>
  );
};

export default Mint;

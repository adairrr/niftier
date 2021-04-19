import React, { useContext, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Divider, message } from 'antd';
import { Stage as KonvaStage, Layer as KonvaLayer, Image as KonvaImage, Layer } from 'react-konva';
import LayerTabs from './LayerTabs';
import { ArtpieceStore, MintableLayerListStore } from '../../store';
import { uploadFile } from '../../helpers/pinata';
import { dataURItoFile } from '../../helpers/dataUriFile';

interface MintableLayersPreviewProps {
  artpiece: ArtpieceStore;
  layerList: MintableLayerListStore;
}

const MintableLayersPreview: React.FC<MintableLayersPreviewProps> = ({
  artpiece,
  layerList,
}: MintableLayersPreviewProps) => {
  const stageRef = useRef(null);

  const [artpieceImage, setArtpieceImage] = useState(null);

  const getImage = (imageSrc: string): HTMLImageElement => {
    if (!imageSrc) return undefined;
    console.log('gettingImage');
    const img = new Image(550, 617);
    img.src = imageSrc;
    return img;
  };

  const exportPreviewFile = async () => {
    const uri = stageRef.current.toDataURL();
    console.log(uri);

    return dataURItoFile(uri);
  };

  const onClickUploadArtpiece = async () => {
    const file = await exportPreviewFile();

    const uploadResp = await uploadFile(file);
    console.log(uploadResp);

    if (uploadResp) {
      artpiece.setMediaUri(uploadResp.IpfsHash);
      message.success('Successfully uploaded layered artpiece to Pinata');
    } else {
      message.error('Got an error!');
    }
  };

  return (
    <div style={{ padding: 16, margin: 'auto', marginTop: 64 }}>
      <LayerTabs layerList={layerList} />
      {/* TODO this should be pulled up for SRP */}
      <Divider />
      <KonvaStage width={550} height={617} ref={stageRef}>
        <KonvaLayer>
          {layerList.layers
            .slice()
            .reverse()
            .map(layer => layer.mediaPrevew && <KonvaImage image={getImage(layer.mediaPrevew)} key={layer.id} />)}
        </KonvaLayer>
      </KonvaStage>
      <Button
        style={{ margin: 8 }}
        /* loading={uploading} */ size="large"
        shape="round"
        type="primary"
        onClick={onClickUploadArtpiece}
      >
        Upload Artpiece to IPFS
      </Button>
    </div>
  );
};

export default observer(MintableLayersPreview);

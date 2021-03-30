import React, { useContext, useState } from 'react';
import MintableLayer, { MintableLayerList } from '../../store/MintableLayer';
import { observer } from 'mobx-react-lite';
import { Divider } from 'antd';
import LayerTabs from './LayerTabs';
import { Stage as KonvaStage, Layer as KonvaLayer, Image as KonvaImage, Layer } from 'react-konva';

interface MintableLayersPreviewProps {
  layerList: MintableLayerList;
}

const MintableLayersPreview: React.FC<MintableLayersPreviewProps> = ({ layerList }) => {

  const getImage = (imageSrc: string): HTMLImageElement => {
    if (!imageSrc) return undefined;
    console.log("gettingImage")
    let img = new Image(550, 617);
    img.src = imageSrc;
    return img;
  }

  return (
    <div style={{border:"1px solid #cccccc", padding:16, width:800, margin:"auto",marginTop:64}}>
      <LayerTabs layerList={layerList} />
      {/* <LayerTabs onLayersChange={onLayersChange}/> */}
      <Divider/>
      <KonvaStage width={550} height={617}>
        <KonvaLayer>
          {layerList.layers.slice().reverse().map((layer) => (
              layer.mediaPrevew && <KonvaImage image={getImage(layer.mediaPrevew)} key={layer.id}/>
          ))}
          </KonvaLayer> 
      </KonvaStage>
    </div>
  );
}

export default observer(MintableLayersPreview);

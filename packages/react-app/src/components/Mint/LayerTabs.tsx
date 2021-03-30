import React, { useState } from 'react';
import { Avatar, Button, Popconfirm, Tabs } from 'antd';
import { DraggableTabs } from '..';
import { CloseOutlined } from '@ant-design/icons';
import { DraggableTabOrder } from '../DraggableTabs';
import MintableLayerForm from './MintableLayerForm';
import { MintableLayerList } from '../../store/MintableLayer';
import { observer } from 'mobx-react-lite';
const { TabPane } = Tabs;

type LayerMetadata = {
  title: string;
  preview: string;
  key?: string;
  isDeleted?: boolean;
}

export interface OrderedLayerMD {
  layers?: LayerMetadata[];
}

interface LayerTabsProps {
  layerList: MintableLayerList;
}

const LayerTabs: React.FC<LayerTabsProps> = ({ layerList }) => {

  console.log(layerList);

  const [ newTabIndex, setNewTabIndex ] = useState(2);

  const [ activeTabKey, setActiveTabKey ] = useState(layerList.layers[0].id);
  console.log(activeTabKey);
  const [ showTabImages, setShowTabImages ] = useState(false);

  const onTabChange = (activeKey: string) => setActiveTabKey(activeKey);

  // effect to trigger layers change when the layer tabs are set
//   useEffect(() => {
//     // TODO is this necessary or will it force a new render?
//     localStorage.setItem('layerTabs', JSON.stringify(layerTabs));
//   }, [layerTabs]);


  const onTabAction = (targetTabKey: string, tabAction: 'add' | 'remove') => {
    console.log("In LayerTabs", tabAction);
    if (tabAction === 'add') onAddTab();
  }

  const onAddTab = () => {
    setNewTabIndex(newTabIndex + 1);
    const newLayer = layerList.addLayer(`Layer ${layerList.layerCount + 1}`)

    // add a slot for the new media
    setActiveTabKey(newLayer.id);
  }

  const onCloseTab = (targetTabKey: string) => {
    const newActiveLayerId = layerList.removeLayer(activeTabKey, targetTabKey);
    setActiveTabKey(newActiveLayerId);
    
    // delete the stored form data from the cache
    // localStorage.removeItem(CACHED_FORM_PREFIX.concat(targetTabKey));
  }

  const onTabOrderChange = (changedValue: DraggableTabOrder) => {
    console.log("Hello?")
    console.log(changedValue);

    layerList.reorderLayers(changedValue);
  };

  const toggleTabView = () => setShowTabImages(!showTabImages);

  const tabViewButton = (
    <Button block onClick={toggleTabView}>
      {showTabImages ? 'Toggle names' : 'Toggle images'}
    </Button>
  );

  const tabCloseConfirm = (tabCloseCallback: () => void) => {
    return (
      <Popconfirm
        placement="top"
        title="Are you sure you want to delete this layer?"
        onConfirm={tabCloseCallback}
        okText="Yes"
        cancelText="No"
      >
        <CloseOutlined />
      </Popconfirm>
    );
  };
  // TODO icon based on filetype prefixing tab name? or maybe across image

  return (
    <DraggableTabs
      tabPosition='right'
      type="editable-card"
      activeKey={activeTabKey}
      onEdit={onTabAction}
      onChange={onTabChange}
      style={{ height: 300 }} // show '...' when there are too many tabs
      // renderTabBar={(props, DefaultTabBar) => {
      //   return <DefaultTabBar {...props} />;
      // }}
      // tabBarStyle={{alignItems: 'flex-end'}}
      // onCloseTab={onCloseTab}
      onOrderChange={onTabOrderChange}
      tabBarExtraContent={{ left: tabViewButton }}
    >
      {layerList.layers.map(layer => (
        <TabPane 
          key={layer.id} 
          style={{alignItems: 'flex-end'}}
          closeIcon={tabCloseConfirm(() => onCloseTab(layer.id))}
          tab={showTabImages && layer.mediaPrevew ? <Avatar shape='square' src={layer.mediaPrevew} /> : layer.name} 
        >
          <MintableLayerForm layer={layer}/> 
        </TabPane>
      ))}
    </DraggableTabs>
  );
}

export default observer(LayerTabs);

import React, { FunctionComponent, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Avatar, Button, Popconfirm, Tabs } from 'antd';
import { DraggableTabs, NewLayerCard } from '..';
import { AddressContext } from '../../contexts';
import { CloseOutlined } from '@ant-design/icons';
import { DraggableTabOrder } from '../DraggableTabs';
import { CACHED_FORM_PREFIX } from '../NewLayerCard';

const { TabPane } = Tabs;

type LayerMetadata = {
  title: string;
  preview: string;
  key?: string;
  isDeleted?: boolean;
}

const initialLayerTabs = [
  { title: 'Layer 1', preview: undefined, key: '1' } as LayerMetadata,
];

export interface OrderedLayerMD {
  layers?: LayerMetadata[];
}

type LayerTabsProps = {
  onLayersChange?: (value: OrderedLayerMD) => void;
}

const LayerTabs: FunctionComponent<LayerTabsProps> = ({ onLayersChange }) => {

  const currentAddress = useContext(AddressContext);

  const [ newTabIndex, setNewTabIndex ] = useState(2);

  const [ activeTabKey, setActiveTabKey ] = useState(initialLayerTabs[0].key);
  const [ layerTabs, setLayerTabs ] = useState(localStorage.getItem('layerTabs') ? 
                                               JSON.parse(localStorage.getItem('layerTabs')) : 
                                               initialLayerTabs);
  const [ deletedTabs, setDeletedTabs ] = useState<string[]>([]);
  const [ showTabImages, setShowTabImages ] = useState(false);
  const isFirstRender = useRef(true);

  const triggerLayersChange = (changedValue: OrderedLayerMD) => {
    onLayersChange?.({ ...changedValue });
  };

  const onTabChange = (activeKey: string) => setActiveTabKey(activeKey);

  // effect to trigger layers change when the layer tabs are set
  useEffect(() => {
    // TODO is this necessary or will it force a new render?
    triggerLayersChange({ layers: layerTabs });
    localStorage.setItem('layerTabs', JSON.stringify(layerTabs));
  }, [layerTabs]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
  /*business logic for component did update*/
      
  });

  const onTabAction = (targetTabKey: string, tabAction: 'add' | 'remove') => {
    console.log("In LayerTabs", tabAction);
    if (tabAction === 'add') onAddTab();
  }

  const onAddTab = () => {
    // const newActiveTabKey = `${newTabIndex}`;
    const newActiveTabKey = Date.now().toString();
    setNewTabIndex(newTabIndex + 1);
    const afterAddTabs = [...layerTabs];
    afterAddTabs.push({ title: `Layer ${layerTabs.length + 1}`, preview: undefined, key: newActiveTabKey });

    setLayerTabs(afterAddTabs);
    // add a slot for the new media
    setActiveTabKey(newActiveTabKey);
  }

  const onCloseTab = (targetTabKey: string) => {
    let activeTabKeyRemove = activeTabKey;
    let lastIndex: number;
    // iterate through tabs to find last index
    layerTabs.forEach((tab, index) => {
      if (tab.key === targetTabKey) {
        lastIndex = index - 1;
      }
    });

    // filter out the removed tab
    const afterRemoveTabs = layerTabs.filter(layerTab => layerTab.key !== targetTabKey);
    if (afterRemoveTabs.length && activeTabKeyRemove === targetTabKey) {
      if (lastIndex >= 0) {
        activeTabKeyRemove = afterRemoveTabs[lastIndex].key;
      } else {
        activeTabKeyRemove = afterRemoveTabs[0].key;
      }
    }
    // update state
    setLayerTabs(afterRemoveTabs);
    setActiveTabKey(activeTabKeyRemove);
    
    // delete the stored form data from the cache
    localStorage.removeItem(CACHED_FORM_PREFIX.concat(targetTabKey));
  }

  const onFormValuesChange = (changedTabKey: string, changedValues, allValues) => {
    // TODO this is a pretty dumb way of doing things I think...
    console.log("Here");
    console.log(changedValues, allValues);

    var changedTabIndex = layerTabs.map((tab) => { return tab.key; }).indexOf(changedTabKey);
    if (changedTabIndex === -1) return;

    // console.log(allValues);
    if (changedValues.name) {
      const afterTabNameChange = [...layerTabs];
      afterTabNameChange[changedTabIndex].title = changedValues.name;
      setLayerTabs(afterTabNameChange);
    }
    if (changedValues.image) {
      const afterTabPreviewChange = [...layerTabs];
      afterTabPreviewChange[changedTabIndex].preview = changedValues.image;
      console.log(afterTabPreviewChange[changedTabIndex]);
      setLayerTabs(afterTabPreviewChange);

      // update the tabMedia
    }
  }

  const onTabOrderChange = (changedValue: DraggableTabOrder) => {
    console.log("Hello?")
    console.log(changedValue);

    let changedOrder = changedValue.order;

    // sort the tabs by the order
    const orderedTabs = layerTabs.slice().sort((a, b) => {
      return changedOrder.indexOf(a.key) - changedOrder.indexOf(b.key);
    });

    console.log(layerTabs);
    console.log(changedValue.order);
    console.log(orderedTabs);

    setLayerTabs(orderedTabs);
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
      {layerTabs.map(pane => (
        <TabPane 
          key={pane.key} 
          style={{alignItems: 'flex-end'}}
          closeIcon={tabCloseConfirm(() => onCloseTab(pane.key))}
          tab={showTabImages && pane.preview ? <Avatar shape='square' src={pane.preview} /> : pane.title} 
        >
          <NewLayerCard 
            name={pane.key} 
            onFormValuesChange={onFormValuesChange} 
            address={currentAddress} 
          />
        </TabPane>
      ))}
    </DraggableTabs>
  );
}

export default LayerTabs;

import React, { FunctionComponent, useContext, useReducer, useState } from 'react';
import { Avatar, Button, Popconfirm, Tabs } from 'antd';
import { DraggableTabs, NewLayerCard } from '..';
import { AddressContext } from '../../contexts';
import { CloseOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const initialLayerTabs = [
  { title: 'Layer 1', preview: undefined, key: '1' },
];

type LayerTabsProps = {

}

const LayerTabs: FunctionComponent<LayerTabsProps> = ({  }) => {

  const currentAddress = useContext(AddressContext);

  const [ newTabIndex, setNewTabIndex ] = useState(2);

  const [ activeTabKey, setActiveTabKey ] = useState(initialLayerTabs[0].key);
  const [ layerTabs, setLayerTabs ] = useState(initialLayerTabs);
  const [ showTabImages, setShowTabImages ] = useState(false);

  const onTabChange = (activeKey: string) => setActiveTabKey(activeKey);

  const onTabAction = (targetTabKey: string, tabAction: string) => {
    if (tabAction === 'add') onAddTab();
  }

  const onAddTab = () => {
    const newActiveTabKey = `${newTabIndex}`;
    setNewTabIndex(newTabIndex + 1);
    const afterAddTabs = [...layerTabs];
    afterAddTabs.push({ title: `Layer ${layerTabs.length + 1}`, preview: undefined, key: newActiveTabKey });

    setLayerTabs(afterAddTabs);
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
  }

  const onFormValuesChange = (changedTabKey, changedValues, allValues) => {
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
    }
  }

  const onTabOrderChange = (changedValue: any) => {
    console.log("Hello?")
    console.log(changedValue);
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
      onOrderChange={onTabOrderChange}
      tabBarExtraContent={{ left: tabViewButton }}
    >
      {layerTabs.map(pane => (
        <TabPane 
          key={pane.key} 
          closeIcon={tabCloseConfirm(() => onCloseTab(pane.key))}
          tab={showTabImages && pane.preview ? <Avatar shape='square' src={pane.preview} /> : pane.title} 
        >
          <NewLayerCard name={pane.key} onFormValuesChange={onFormValuesChange} address={currentAddress}/>
        </TabPane>
      ))}
    </DraggableTabs>
  );
}

export default LayerTabs;

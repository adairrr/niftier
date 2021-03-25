import React, { FunctionComponent, useContext, useReducer, useState } from 'react';
import { Button, Tabs } from 'antd';
import { DraggableTabs, NewLayerCard } from '..';
import { AddressContext } from '../../contexts';

const { TabPane } = Tabs;

const initialLayerTabs = [
  { title: 'Layer 1', key: '1' },
];


type LayerTabsProps = {

}

const LayerTabs: FunctionComponent<LayerTabsProps> = ({  }) => {

  const currentAddress = useContext(AddressContext);

  const [ newTabIndex, setNewTabIndex ] = useState(2);

  const [ activeTabKey, setActiveTabKey ] = useState(initialLayerTabs[0].key);
  const [ layerTabs, setLayerTabs ] = useState(initialLayerTabs);
  const [ showTabImages, setShowTabImages ] = useState(true);
  const [ layerNames, setLayerNames ] = useState<string[]>([]);
  // const [ layerNamesState, layerNamesDispatch ] = useReducer(layerNamesReducer, []);


  const onTabChange = (activeKey: string) => setActiveTabKey(activeKey);

  const onTabAction = (targetTabKey: string, tabAction: string) => {
    switch (tabAction) {
      case 'add': 
        const activeTabKeyAdd = `${newTabIndex}`;
        setNewTabIndex(newTabIndex + 1);
        const afterAddTabs = [...layerTabs];
        afterAddTabs.push({ title: `Layer ${layerTabs.length + 1}`, key: activeTabKeyAdd });

        setLayerTabs(afterAddTabs);
        setActiveTabKey(activeTabKeyAdd);
        break;

      case 'remove': 
        let activeTabKeyRemove = activeTabKey;
        let lastIndex: number;
        layerTabs.forEach((layerTab, tabIndex) => {
          if (layerTab.key === targetTabKey) {
            lastIndex = tabIndex - 1;
          }
        });
        const afterRemoveTabs = layerTabs.filter(layerTab => layerTab.key !== targetTabKey);
        if (afterRemoveTabs.length && activeTabKeyRemove === targetTabKey) {
          if (lastIndex >= 0) {
            activeTabKeyRemove = afterRemoveTabs[lastIndex].key;
          } else {
            activeTabKeyRemove = afterRemoveTabs[0].key;
          }
        }
        setLayerTabs(afterRemoveTabs);
        setActiveTabKey(activeTabKeyRemove);
        break;

      default:
        break;
    }
  }

  const onFormValuesChange = (changedValues, allValues) => {
    // TODO this is a pretty dumb way of doing things I think...
    console.log("Here");
    console.log(changedValues, allValues);

    var changedTabIndex = layerTabs.map((tab) => { return tab.key; }).indexOf(activeTabKey);

    // console.log(allValues);
    if (changedValues.name) {
      const afterTabNameChange = [...layerTabs];
      afterTabNameChange[changedTabIndex].title = changedValues.name;
      setLayerTabs(afterTabNameChange);
    }
    // if (changedValues.image) {

    // }
  }

  const toggleTabView = () => setShowTabImages(!showTabImages);

  const tabViewButton = (
    <Button block onClick={toggleTabView}>
      {showTabImages ? 'Toggle names' : 'Toggle images'}
    </Button>
  );

  return (
    <DraggableTabs
      tabBarExtraContent={{left: tabViewButton}}
      tabPosition='right'
      type="editable-card"
      onChange={onTabChange}
      activeKey={activeTabKey}
      onEdit={onTabAction}
    >
      {layerTabs.map(pane => (
        <TabPane tab={pane.title} key={pane.key} >
          <NewLayerCard onFormValuesChange={onFormValuesChange} address={currentAddress}/>
        </TabPane>
      ))}
    </DraggableTabs>
  );
}

export default LayerTabs;

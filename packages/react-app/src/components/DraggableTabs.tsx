import React from 'react';
import { Tabs, TabsProps } from 'antd';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Drag & Drop node
class TabNode extends React.Component {
  render() {
    //@ts-ignore
    const { connectDragSource, connectDropTarget, children } = this.props;

    return connectDragSource(connectDropTarget(children));
  }
}

const cardTarget = {
  drop(props, monitor) {
    const dragKey = monitor.getItem().index;
    const hoverKey = props.index;

    if (dragKey === hoverKey) {
      return;
    }

    props.moveTabNode(dragKey, hoverKey);
    monitor.getItem().index = hoverKey;
  },
};

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    };
  },
};

const WrapTabNode = DropTarget('DND_NODE', cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))(
  DragSource('DND_NODE', cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }))(TabNode),
);

export interface DraggableTabOrder {
  order?: string[];
}

interface DraggableTabsProps extends TabsProps {
  // onCloseTab?: (targetTabKey: string) => void;
  onOrderChange?: (value: DraggableTabOrder) => void;

}

interface DraggableTabsState {
  order: string[];
}

class DraggableTabs extends React.Component<DraggableTabsProps, DraggableTabsState> {

  constructor(props) {
    super(props);
    // this.onCloseTab = this.onCloseTab.bind(this);
    this.onOrderChange = this.onOrderChange.bind(this);
    this.state = { order: [] };
  }

  // // hook to call once we confirm a closed tab
  // onCloseTab = (targetTabKey: string) => {

  //   const newOrder = this.state.order.slice();

  //   const indexToRemove = newOrder.indexOf(targetTabKey);
  //   console.log('newOrder index', indexToRemove);
  //   if (indexToRemove > -1) newOrder.splice(indexToRemove, 1);

  //   this.setState({ order: newOrder });
  //   this.onOrderChange({ order: newOrder });
  //   this.props.onCloseTab(targetTabKey);
  // }
  
  // we want to be able to get the order in a higher level component
  onOrderChange = (changedValue: DraggableTabOrder) => this.props.onOrderChange(changedValue);
  
  
  moveTabNode = (dragKey, hoverKey) => {
    let newOrder = this.state.order.slice();
    const { children } = this.props;

    // add any new children
    React.Children.forEach(children, c => {
      //@ts-ignore
      if (newOrder.indexOf(c.key) === -1) {
        //@ts-ignore
        newOrder.push(c.key);
      }
    });

    const tabs = [];
    React.Children.forEach(children, c => {
      tabs.push(c);
    });

    if (newOrder.length > tabs.length) {
      // const newOrder = this.state.order.slice();

      const tabKeys = tabs.map((tab) => tab.key);

      console.log("got tab keys: ", tabKeys);
      console.log("starting with order", newOrder)

      // find key that is different
      newOrder = newOrder.filter((key) => {
        return tabKeys.indexOf(key) !== -1;
      });

      console.log("Setting new order", newOrder);

      this.setState({ order: newOrder });

      // order = newOrder;

  //   const indexToRemove = newOrder.indexOf(targetTabKey);
  //   console.log('newOrder index', indexToRemove);
  //   if (indexToRemove > -1) newOrder.splice(indexToRemove, 1);
    }

    // TODO remove any old children

    const dragIndex = newOrder.indexOf(dragKey);
    const hoverIndex = newOrder.indexOf(hoverKey);

    newOrder.splice(dragIndex, 1);
    newOrder.splice(hoverIndex, 0, dragKey);

    console.log("Old tab order")
    console.log(this.state.order);
    console.log("New tab order")
    console.log(newOrder);

    this.setState({
      order: newOrder,
    });
    this.onOrderChange({ order: newOrder })
    
  };

  renderTabBar = (props, DefaultTabBar) => (
    <DefaultTabBar {...props}>
      {node => (
        //@ts-ignore
        <WrapTabNode key={node.key} index={node.key} moveTabNode={this.moveTabNode}>
          {node}
        </WrapTabNode>
      )}
    </DefaultTabBar>
  );

  render() {
    let { order } = this.state;
    const { children } = this.props;
    // remove onOrderChange prop
    const { onOrderChange, ...props } = this.props;

    const tabs = [];
    React.Children.forEach(children, c => {
      tabs.push(c);
    });

    const orderTabs = tabs.slice().sort((a, b) => {
      const orderA = order.indexOf(a.key);
      const orderB = order.indexOf(b.key);

      if (orderA !== -1 && orderB !== -1) {
        return orderA - orderB;
      }
      if (orderA !== -1) {
        return -1;
      }
      if (orderB !== -1) {
        return 1;
      }

      const ia = tabs.indexOf(a);
      const ib = tabs.indexOf(b);

      return ia - ib;
    });

    return (
      <DndProvider backend={HTML5Backend}>
        <Tabs 
          renderTabBar={this.renderTabBar}
          {...props}
        >
          {orderTabs}
        </Tabs>
      </DndProvider>
    );
  }
}

export default DraggableTabs;

/* eslint-disable no-console,react/no-multi-comp */
import Drawer from 'rc-drawer';
import React from 'react';
import ReactDom from 'react-dom';
import { Button } from 'antd';

import 'antd/lib/style';
import 'antd/lib/button/style';

import 'rc-drawer/assets/index.less';
import './assets/index.less';

class Demo extends React.Component {
  state = {
    open: false,
    openChild: false,
    openChildren: false,
  }
  onClick = () => {
    this.setState({
      open: !this.state.open,
    });
  }
  onChildClick = () => {
    this.setState({
      openChild: !this.state.openChild,
    })
  }
  onChildrenClick = () => {
    this.setState({
      openChildren: !this.state.openChildren,
    })
  }
  getLevelMove = (e) => {
    const target = e.target;
    if (target.className === 'drawer1') {
      return [200, 100];
    }
    return 100;
  }
  render() {
    return (
      <div >
        <div
          style={{
            width: '100%', height: 667, background: '#fff000',
            color: '#fff', textAlign: 'center', lineHeight: '667px',
          }}
        >
          <Button onClick={this.onClick}>打开抽屉</Button>
        </div>
        <Drawer
          width="20vw"
          handler={false}
          open={this.state.open}
          onMaskClick={this.onClick}
          wrapperClassName="drawer1"
          placement="right"
        >
          <div>
            <Button onClick={this.onChildClick}>打开子级</Button>
            <Drawer
              handler={false}
              open={this.state.openChild}
              onMaskClick={this.onChildClick}
              wrapperClassName="drawer2"
              level=".drawer1"
              placement="right"
              levelMove={100}
            >
              <div style={{ width: 200 }}>
                二级抽屉
                <Button onClick={this.onChildrenClick}>打开子级</Button>
                <Drawer
                  handler={false}
                  open={this.state.openChildren}
                  onMaskClick={this.onChildrenClick}
                  level={['.drawer1', '.drawer2']}
                  placement="right"
                  levelMove={this.getLevelMove}
                >
                  <div style={{ width: 200 }}>
                    三级抽屉
                  </div>
                </Drawer>
              </div>
            </Drawer>
          </div>
        </Drawer>
      </div>);
  }
}
ReactDom.render(<Demo />, document.getElementById('__react-content'));

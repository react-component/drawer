/* eslint-disable no-console,react/no-multi-comp */
import Drawer from 'rc-drawer';
import React from 'react';

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
  };

  onClick = () => {
    const { open } = this.state;
    this.setState({
      open: !open,
    });
  };

  onChildClick = () => {
    const { openChild } = this.state;
    this.setState({
      openChild: !openChild,
    });
  };

  onChildrenClick = () => {
    const { openChildren } = this.state;
    this.setState({
      openChildren: !openChildren,
    });
  };

  getLevelMove = e => {
    const target = e.target;
    if (target.className.indexOf('drawer1') >= 0) {
      return [200, 100];
    }
    return 100;
  };

  render() {
    const { open, openChild, openChildren } = this.state;
    return (
      <div>
        <div
          style={{
            width: '100%',
            height: 667,
            backgroundImage:
              'url("https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg")',

            textAlign: 'center',
            lineHeight: '667px',
          }}
        >
          <Button onClick={this.onClick}>打开抽屉</Button>
        </div>
        <Drawer
          width="20vw"
          handler={false}
          open={open}
          onMaskClick={this.onClick}
          className="drawer1"
          placement="right"
        >
          <div>
            <Button onClick={this.onChildClick}>打开子级</Button>
            <Drawer
              handler={false}
              open={openChild}
              onMaskClick={this.onChildClick}
              className="drawer2"
              level=".drawer1"
              placement="right"
              levelMove={100}
            >
              <div style={{ width: 200 }}>
                二级抽屉
                <Button onClick={this.onChildrenClick}>打开子级</Button>
                <Drawer
                  handler={false}
                  open={openChildren}
                  onMaskClick={this.onChildrenClick}
                  level={['.drawer1', '.drawer2']}
                  placement="right"
                  levelMove={this.getLevelMove}
                >
                  <div style={{ width: 200 }}>三级抽屉</div>
                </Drawer>
              </div>
            </Drawer>
          </div>
        </Drawer>
      </div>
    );
  }
}
export default () => <Demo />;

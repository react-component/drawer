/* eslint-disable no-console,react/no-multi-comp */
import { Button } from 'antd';
import * as React from 'react';

import Drawer from 'rc-drawer';

import 'antd/lib/button/style';
import 'antd/lib/style';

import '../../assets/index.less';
import './assets/index.less';
import motionProps from './motion';

class Demo extends React.Component {
  public state = {
    open: false,
    openChild: false,
    openChildren: false,
  };
  public onClick = () => {
    this.setState({
      open: !this.state.open,
    });
  };
  public onChildClick = () => {
    this.setState({
      openChild: !this.state.openChild,
    });
  };
  public onChildrenClick = () => {
    this.setState({
      openChildren: !this.state.openChildren,
    });
  };

  public render() {
    return (
      <div>
        <div
          style={{
            width: '100%',
            height: 667,
            background: '#fff000',
            color: '#fff',
            textAlign: 'center',
            lineHeight: '667px',
          }}
        >
          <Button onClick={this.onClick}>打开抽屉</Button>
        </div>
        <Drawer
          width="20vw"
          open={this.state.open}
          onClose={this.onClick}
          className="drawer1"
          placement="right"
          push={{ distance: 64 }}
          // zIndex={99999}
          {...motionProps}
        >
          <div>
            <Button onClick={this.onChildClick}>打开子级</Button>
            <Drawer
              open={this.state.openChild}
              onClose={this.onChildClick}
              className="drawer2"
              placement="right"
              // zIndex={88888}
              {...motionProps}
            >
              <div style={{ width: 200 }}>
                二级抽屉
                <Button onClick={this.onChildrenClick}>打开子子级</Button>
                <Drawer
                  open={this.state.openChildren}
                  onClose={this.onChildrenClick}
                  placement="right"
                  {...motionProps}
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
export default Demo;

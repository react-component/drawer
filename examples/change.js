/* eslint-disable no-console,react/no-multi-comp */
import Drawer from 'rc-drawer-menu';
import React from 'react';
import ReactDom from 'react-dom';
import { Menu, Icon } from 'antd';

import 'antd/lib/style';
import 'antd/lib/menu/style';

import 'rc-drawer-menu/assets/index.less';
import './assets/index.less';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
class Demo extends React.Component {
  state = {
    open: true,
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        open: false,
      });
    }, 2000);
  }
  onChange = (bool) => {
    console.log(bool);
  }
  onTouchEnd = () => {
    this.setState({
      open: !this.state.open,
    });
  }
  render() {
    return (
      <div >
        <Drawer
          width="240px"
          onChange={this.onChange}
          open={this.state.open}
          onSwitch={this.onTouchEnd}
          iconChild={null}
          level={null}
        >
          <Menu
            style={{ width: 240 }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
          >
            <SubMenu
              key="sub1"
              title={<span><Icon type="mail" /><span>Navigation One</span></span>}
            >
              <MenuItemGroup key="g1" title="Item 1">
                <Menu.Item key="1">Option 1</Menu.Item>
                <Menu.Item key="2">Option 2</Menu.Item>
              </MenuItemGroup>
              <MenuItemGroup key="g2" title="Item 2">
                <Menu.Item key="3">Option 3</Menu.Item>
                <Menu.Item key="4">Option 4</Menu.Item>
              </MenuItemGroup>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}
            >
              <Menu.Item key="5">Option 5</Menu.Item>
              <Menu.Item key="6">Option 6</Menu.Item>
              <SubMenu key="sub3" title="Submenu">
                <Menu.Item key="7">Option 7</Menu.Item>
                <Menu.Item key="8">Option 8</Menu.Item>
              </SubMenu>
            </SubMenu>
            <SubMenu
              key="sub4"
              title={<span><Icon type="setting" /><span>Navigation Three</span></span>}
            >
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu>
          </Menu>
        </Drawer>
        <div
          style={{
            width: '100%', height: 667, background: '#fff000',
            color: '#fff', textAlign: 'center', lineHeight: '667px',
          }}
        >
          内容区块
          <button
            onClick={this.onTouchEnd}
            style={{ height: 24, width: 100, marginLeft: 20, color: '#000', lineHeight: '24px' }}
          >
            {!this.state.open ? '打开' : '关闭'}
          </button>
        </div>
      </div>
    );
  }
}
ReactDom.render(<Demo />, document.getElementById('__react-content'));

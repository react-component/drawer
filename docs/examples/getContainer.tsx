import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import * as React from 'react';

import Drawer from 'rc-drawer';

import 'antd/lib/menu/style';
import 'antd/lib/style';

import '../../assets/index.less';
import './assets/index.less';

const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;

class DrawerTester extends React.Component {
  private container: HTMLDivElement;

  public getContainer = () => {
    return this.container;
  };
  public saveContainer = (container: HTMLDivElement) => {
    this.container = container;
  };

  public render() {
    return (
      <div>
        <div
          ref={this.saveContainer}
          id="container"
          style={{
            height: 300,
            background: 'rgba(0,0,0,0.05)',
            overflow: 'auto',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              height: 1000,
              boxShadow: `0 0 1px red`,
            }}
          >
            Hello World
          </div>
        </div>
        <Drawer width="20vw" getContainer={this.getContainer} open>
          <Menu
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
          >
            <SubMenu
              key="sub1"
              title={
                <span>
                  <MailOutlined />
                  <span>Navigation One</span>
                </span>
              }
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
              title={
                <span>
                  <AppstoreOutlined />
                  <span>Navigation Two</span>
                </span>
              }
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
              title={
                <span>
                  <SettingOutlined />
                  <span>Navigation Three</span>
                </span>
              }
            >
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu>
          </Menu>
        </Drawer>
      </div>
    );
  }
}
export default DrawerTester;

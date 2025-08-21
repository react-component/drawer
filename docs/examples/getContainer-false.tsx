import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import * as React from 'react';

import Drawer from '@rc-component/drawer';

import 'antd/lib/menu/style';
import 'antd/lib/style';

import '../../assets/index.less';
import './assets/index.less';
import motionProps from './motion';

const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;

export default () => {
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <div
        id="container"
        style={{
          height: 300,
          background: 'rgba(0,0,0,0.05)',
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            height: 1000,
            boxShadow: `0 0 1px red`,
          }}
        >
          <button onClick={() => setOpen(true)} style={{ height: 100 }}>
            Open
          </button>
        </div>
      </div>

      <Drawer
        width="20vw"
        getContainer={false}
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
        {...motionProps}
      >
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
};

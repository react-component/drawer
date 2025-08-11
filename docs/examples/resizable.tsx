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
import motionProps from './motion';

const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;

export default () => {
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<
    'left' | 'right' | 'top' | 'bottom'
  >('right');
  const [resizable, setResizable] = React.useState(true);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setOpen(true)} style={{ marginRight: 8 }}>
          打开抽屉
        </button>
        <label style={{ marginRight: 8 }}>
          <input
            type="checkbox"
            checked={resizable}
            onChange={e => setResizable(e.target.checked)}
          />
          可拖拽调整大小
        </label>
        <span>位置：</span>
        <select
          value={placement}
          onChange={e => setPlacement(e.target.value as any)}
        >
          <option value="left">左侧</option>
          <option value="right">右侧</option>
          <option value="top">顶部</option>
          <option value="bottom">底部</option>
        </select>
      </div>
      <Drawer
        width={placement === 'left' || placement === 'right' ? 320 : undefined}
        height={placement === 'top' || placement === 'bottom' ? 240 : undefined}
        placement={placement}
        open={open}
        onClose={() => setOpen(false)}
        resizable={resizable}
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
                <span>导航一</span>
              </span>
            }
          >
            <MenuItemGroup key="g1" title="分组1">
              <Menu.Item key="1">选项1</Menu.Item>
              <Menu.Item key="2">选项2</Menu.Item>
            </MenuItemGroup>
            <MenuItemGroup key="g2" title="分组2">
              <Menu.Item key="3">选项3</Menu.Item>
              <Menu.Item key="4">选项4</Menu.Item>
            </MenuItemGroup>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <AppstoreOutlined />
                <span>导航二</span>
              </span>
            }
          >
            <Menu.Item key="5">选项5</Menu.Item>
            <Menu.Item key="6">选项6</Menu.Item>
            <SubMenu key="sub3" title="子菜单">
              <Menu.Item key="7">选项7</Menu.Item>
              <Menu.Item key="8">选项8</Menu.Item>
            </SubMenu>
          </SubMenu>
          <SubMenu
            key="sub4"
            title={
              <span>
                <SettingOutlined />
                <span>导航三</span>
              </span>
            }
          >
            <Menu.Item key="9">选项9</Menu.Item>
            <Menu.Item key="10">选项10</Menu.Item>
            <Menu.Item key="11">选项11</Menu.Item>
            <Menu.Item key="12">选项12</Menu.Item>
          </SubMenu>
        </Menu>
        <div style={{ marginTop: 24, color: '#888' }}>
          <p>你可以拖拽抽屉边缘调整大小（仅在勾选“可拖拽调整大小”时生效）。</p>
        </div>
      </Drawer>
    </div>
  );
};

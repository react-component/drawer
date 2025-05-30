import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Menu, Select } from 'antd';
import * as React from 'react';

import Drawer from '@rc-component/drawer';

import 'antd/lib/button/style';
import 'antd/lib/menu/style';
import 'antd/lib/select/style';
import 'antd/lib/style';

import '../../assets/index.less';
import './assets/index.less';
import type { Placement } from '@/Drawer';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const Option = Select.Option;

function Demo() {
  const [placement, setPlacement] = React.useState<Placement>('right');
  const [childShow, setChildShow] = React.useState(true);
  const [width, setWidth] = React.useState('20vw');
  const [height, setHeight] = React.useState<string | null>(null);

  const onChange = (value: string) => {
    setPlacement(value as Placement);
    setWidth(value === 'right' || value === 'left' ? '20vw' : null);
    setHeight(value === 'right' || value === 'left' ? null : '20vh');
    setChildShow(false); // 删除子级，删除切换时的过渡动画。。。
    setTimeout(() => {
      setChildShow(true);
    });
  };

  return (
    <div>
      {childShow && (
        <Drawer placement={placement} width={width} height={height}>
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
      )}
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
        选择位置：
        <Select
          style={{ width: 120, marginLeft: 20 }}
          defaultValue={placement}
          onChange={onChange}
        >
          <Option value="left">左边 left</Option>
          <Option value="top">上面 top</Option>
          <Option value="right">右边 right</Option>
          <Option value="bottom">下面 bottom</Option>
        </Select>
      </div>
    </div>
  );
}

export default Demo;

/* eslint-disable no-console,react/no-multi-comp */
import { Button } from 'antd';
import * as React from 'react';

import Drawer from '@rc-component/drawer';

import 'antd/lib/button/style';
import 'antd/lib/style';

import '../../assets/index.less';
import './assets/index.less';
import motionProps from './motion';

function Demo() {
  const [open, setOpen] = React.useState(true);
  const [openChild, setOpenChild] = React.useState(true);
  const [openChildren, setOpenChildren] = React.useState(true);

  function onClick() {
    setOpen(!open);
  }

  function onChildClick() {
    setOpenChild(!openChild);
  }

  function onChildrenClick(e) {
    setOpenChildren(e.currentTarget instanceof HTMLButtonElement);
  }

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
        <Button onClick={onClick}>打开抽屉</Button>
      </div>
      <Drawer
        width="20vw"
        open={open}
        onClose={onClick}
        className="drawer1"
        placement="right"
        push={{ distance: 64 }}
        rootClassName="level-0"
        // zIndex={99999}
        {...motionProps}
      >
        <div>
          <Button onClick={onChildClick}>打开子级</Button>
          <Drawer
            open={openChild}
            onClose={onChildClick}
            className="drawer2"
            placement="right"
            // zIndex={88888}
            rootClassName="level-1"
            {...motionProps}
          >
            <div style={{ width: 200 }}>
              二级抽屉
              <Button onClick={onChildrenClick}>打开子子级</Button>
              <Drawer
                open={openChildren}
                onClose={onChildrenClick}
                placement="right"
                rootClassName="level-2"
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

export default Demo;

import { Button } from 'antd';
import * as React from 'react';

import Drawer from 'rc-drawer';

import 'antd/lib/button/style';
import 'antd/lib/menu/style';
import 'antd/lib/style';

import '../../assets/index.less';
import './assets/index.less';
import motionProps from './motion';

export default () => {
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  return (
    <div>
      <Drawer
        width="20vw"
        open={open}
        onClose={() => setOpen(false)}
        forceRender
        {...motionProps}
      >
        <input />
        <input />
        <input />
      </Drawer>
      <Drawer
        width="20vw"
        open={open2}
        onClose={() => setOpen2(false)}
        destroyOnClose
        placement="left"
        {...motionProps}
      >
        Hello World!
      </Drawer>
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
        <Button onClick={() => setOpen(true)}>Force Render</Button>
        <Button onClick={() => setOpen2(true)}>Destroy On Close</Button>
      </div>
    </div>
  );
};

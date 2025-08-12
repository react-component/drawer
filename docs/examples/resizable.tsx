import * as React from 'react';

import Drawer from 'rc-drawer';

import '../../assets/index.less';
import './assets/index.less';
import motionProps from './motion';

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
        key={placement}
        onClose={() => setOpen(false)}
        resizable={resizable}
        {...motionProps}
      >
        <div style={{ marginTop: 24, color: '#888' }}>
          <p>你可以拖拽抽屉边缘调整大小（仅在勾选“可拖拽调整大小”时生效）。</p>
        </div>
      </Drawer>
    </div>
  );
};

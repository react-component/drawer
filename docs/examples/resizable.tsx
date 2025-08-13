import * as React from 'react';

import Drawer from 'rc-drawer';

import '../../assets/index.less';
import './assets/index.less';
import motionProps from './motion';
import type { Placement } from '@/index';

export default () => {
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState('right');
  const [resizable, setResizable] = React.useState(true);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setOpen(true)} style={{ marginRight: 8 }}>
          Open Drawer
        </button>
        <label style={{ marginRight: 8 }}>
          <input
            type="checkbox"
            checked={resizable}
            onChange={e => setResizable(e.target.checked)}
          />
          Resizable
        </label>
        <span>Placement: </span>
        <select value={placement} onChange={e => setPlacement(e.target.value)}>
          <option value="left">Left</option>
          <option value="right">Right</option>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
        </select>
      </div>
      <Drawer
        width={placement === 'left' || placement === 'right' ? 320 : undefined}
        height={placement === 'top' || placement === 'bottom' ? 240 : undefined}
        placement={placement as Placement}
        open={open}
        key={placement}
        onClose={() => setOpen(false)}
        resizable={resizable}
        {...motionProps}
      >
        <div style={{ marginTop: 24, color: '#888' }}>
          <p>
            You can drag the drawer edge to resize (only works when
            &quot;Resizable&quot; is checked).
          </p>
        </div>
      </Drawer>
    </div>
  );
};

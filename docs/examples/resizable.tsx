import * as React from 'react';

import Drawer from 'rc-drawer';

import '../../assets/index.less';
import './assets/index.less';
import motionProps from './motion';
import type { Placement } from '@/index';

export default () => {
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<Placement>('right');

  const buttons = [
    { placement: 'left' as Placement, label: 'Left Drawer' },
    { placement: 'right' as Placement, label: 'Right Drawer' },
    { placement: 'top' as Placement, label: 'Top Drawer' },
    { placement: 'bottom' as Placement, label: 'Bottom Drawer' },
  ];

  const openDrawer = (direction: Placement) => {
    setPlacement(direction);
    setOpen(true);
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        {buttons.map(({ placement, label }) => (
          <button
            key={placement}
            onClick={() => openDrawer(placement)}
            style={{ padding: '8px 16px' }}
          >
            {label}
          </button>
        ))}
      </div>
      <Drawer
        width={placement === 'left' || placement === 'right' ? 320 : undefined}
        height={placement === 'top' || placement === 'bottom' ? 240 : undefined}
        placement={placement as Placement}
        open={open}
        key={placement}
        onClose={() => setOpen(false)}
        resizable
        {...motionProps}
      >
        <div style={{ marginTop: 24, color: '#888' }}>
          <p>You can drag the drawer edge to resize.</p>
        </div>
      </Drawer>
    </div>
  );
};

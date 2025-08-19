import * as React from 'react';

import Drawer from '@rc-component/drawer';

import '../../assets/index.less';
import './assets/index.less';
import motionProps from './motion';
import type { Placement } from '@/index';

export default () => {
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<Placement>('right');
  const [width, setWidth] = React.useState(320);
  const [height, setHeight] = React.useState(240);

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

  const isHorizontal = placement === 'left' || placement === 'right';

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
        width={isHorizontal ? width : undefined}
        height={!isHorizontal ? height : undefined}
        placement={placement as Placement}
        open={open}
        key={placement}
        onClose={() => setOpen(false)}
        resizable={{
          onResize: size => {
            if (isHorizontal) {
              setWidth(size);
            } else {
              setHeight(size);
            }
          },
          onResizeStart: () => {
            console.log('onResizeStart');
          },
          onResizeEnd: () => {
            console.log('onResizeEnd');
          },
        }}
        {...motionProps}
      >
        <div>Resizable Drawer</div>
      </Drawer>
    </div>
  );
};

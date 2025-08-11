/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import Drawer from 'rc-drawer';
import motionProps from './motion';

const Demo = () => {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<
    'left' | 'right' | 'top' | 'bottom'
  >('bottom');
  const onTouchEnd = () => {
    setOpen(false);
  };
  const onSwitch = () => {
    setOpen(c => !c);
  };
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <span>位置：</span>
        <select
          value={placement}
          onChange={e => setPlacement(e.target.value as any)}
          style={{ marginRight: 8 }}
        >
          <option value="left">左侧</option>
          <option value="right">右侧</option>
          <option value="top">顶部</option>
          <option value="bottom">底部</option>
        </select>
        <button onClick={onSwitch}>打开</button>
      </div>
      <Drawer
        open={open}
        onClose={onTouchEnd}
        afterOpenChange={(c: boolean) => {
          console.log('transitionEnd: ', c);
        }}
        placement={placement}
        width={
          placement === 'left' || placement === 'right' ? '60%' : undefined
        }
        height={placement === 'top' || placement === 'bottom' ? 240 : undefined}
        {...motionProps}
      >
        content
      </Drawer>
    </div>
  );
};
export default Demo;

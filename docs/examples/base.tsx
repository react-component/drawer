/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import Drawer from '@rc-component/drawer';
import motionProps from './motion';

const Demo = () => {
  const [open, setOpen] = useState(false);
  const onTouchEnd = () => {
    setOpen(false);
  };
  const onSwitch = () => {
    setOpen(c => !c);
  };
  return (
    <div>
      <Drawer
        open={open}
        // defaultOpen
        onClose={onTouchEnd}
        afterOpenChange={(c: boolean) => {
          console.log('transitionEnd: ', c);
        }}
        placement="right"
        // width={400}
        width="60%"
        // Motion
        {...motionProps}
      >
        content
        <button>Button 1</button>
        <button>Button 2</button>
      </Drawer>
      <div>
        <button onClick={onSwitch}>打开</button>
      </div>
    </div>
  );
};
export default Demo;

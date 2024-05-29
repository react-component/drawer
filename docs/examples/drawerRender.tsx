/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import Drawer from 'rc-drawer';
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
        onClose={onTouchEnd}
        afterOpenChange={(c: boolean) => {
          console.log('transitionEnd: ', c);
        }}
        placement="right"
        // width={400}
        width="60%"
        // Motion
        drawerRender={dom => (
          <div id="test" style={{ height: '100%' }}>
            {dom}
          </div>
        )}
      >
        content
      </Drawer>
      <div>
        <button onClick={onSwitch}>打开</button>
      </div>
    </div>
  );
};
export default Demo;

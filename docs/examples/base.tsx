import React, { useState } from 'react';
import Drawer from 'rc-drawer';

const Demo = () => {
  const [open, setOpen] = useState(false);
  const onChange = (bool: boolean) => {
    console.log('change: ', bool);
  };
  const onTouchEnd = () => {
    setOpen(false);
  };
  const onSwitch = () => {
    setOpen(c => !c);
  };
  return (
    <div>
      <Drawer
        onChange={onChange}
        open={open}
        onClose={onTouchEnd}
        handler={false}
        level={null}
        afterVisibleChange={(c: boolean) => {
          console.log('transitionEnd: ', c);
        }}
        placement="right"
        width={400}
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

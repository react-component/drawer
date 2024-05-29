import React, { useState } from 'react';
import Drawer from 'rc-drawer';

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

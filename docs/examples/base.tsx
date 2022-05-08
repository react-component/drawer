import React, { useEffect, useState } from 'react';
import Drawer from 'rc-drawer';

const Child = () => {
  useEffect(() => {
    console.log('load');
  }, []);

  return <>123456</>;
};

const Demo = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <button onClick={() => setVisible(true)}>打开</button>
      <Drawer
        // onChange={open => {
        //   console.log('open', open);
        // }}
        open={visible}
        onClose={() => setVisible(false)}
        handler={false}
        level={null}
        // afterVisibleChange={(c: boolean) => {
        //   console.log('transitionEnd: ', c);
        // }}
        placement="right"
        width={300}
      >
        <Child />
      </Drawer>
    </>
  );
};

export default Demo;

import React from 'react';
import Drawer from '../'

export default () => {
  return (
    <Drawer
      prefixCls="abc"
      wrapperClassName="test"
      width={100}
      height="100px"
      open={false}
      defaultOpen={false}
      handler={<div>abc</div>}
      placement="bottom"
      level="all"
      levelMove={() => [100, 100]}
      duration='.3s'
      ease=""
      getContainer="#abc"
      showMask={false}
      maskStyle={{ top: 100 }}
      onChange={(e) => { console.log(e)}}
      onMaskClick={(e: MouseEvent) => { console.log(e.pageX); }}
      onHandleClick={(e: KeyboardEvent) => { console.log(e.keyCode); }}
    />
  );
}
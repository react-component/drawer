import React from 'react';
import Drawer from './src/Drawer';

// 测试新的 size 属性
const TestNewSizeApi = () => {
  return (
    <div>
      {/* 使用新的 size 属性 */}
      <Drawer open={true} placement="right" size={400} getContainer={false}>
        使用新的 size 属性
      </Drawer>

      {/* 使用新的 defaultSize 属性 */}
      <Drawer
        open={true}
        placement="left"
        defaultSize={300}
        resizable={{
          onResize: size => console.log('resized to:', size),
        }}
        getContainer={false}
      >
        使用新的 defaultSize 属性
      </Drawer>

      {/* 向后兼容：仍然支持 width/height */}
      <Drawer
        open={true}
        placement="right"
        width={350} // deprecated but still works
        getContainer={false}
      >
        向后兼容 width 属性
      </Drawer>
    </div>
  );
};

export default TestNewSizeApi;

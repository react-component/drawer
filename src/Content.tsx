/* eslint-disable @typescript-eslint/no-shadow */
import * as React from 'react';
import { useRef } from 'react';
import CSSMotion from 'rc-motion';

import Child from './DrawerChild';

export type ContentProps = {
  motionName: string;
  ariaId: string;
  onVisibleChanged: (visible: boolean) => void;
  onMouseDown: React.MouseEventHandler;
  onMouseUp: React.MouseEventHandler;
};

export type ContentRef = {
  focus: () => void;
  changeActive: (next: boolean) => void;
};

const Content = (props: any) => {
  const {
    visible,
    onVisibleChanged,
    forceRender,
    motionName,
    destroyOnClose,
    // children,
  } = props;
  console.log('props', props);

  const dialogRef = useRef<HTMLDivElement>();

  function onPrepare() {}

  return (
    <CSSMotion
      visible={visible}
      // onVisibleChanged={onVisibleChanged}
      onVisibleChanged={visible => {
        console.log('vvv', visible);
        onVisibleChanged?.();
      }}
      onAppearPrepare={onPrepare}
      onEnterPrepare={onPrepare}
      forceRender={forceRender}
      motionName={motionName}
      removeOnLeave={destroyOnClose}
      ref={dialogRef}
    >
      {({ className: motionClassName, style: motionStyle }, motionRef) => {
        console.log('1122', motionClassName, motionStyle);
        return (
          <div ref={motionRef}>
            <Child {...props} />
          </div>
        );
      }}
    </CSSMotion>
  );
};

Content.displayName = 'Content';

export default Content;

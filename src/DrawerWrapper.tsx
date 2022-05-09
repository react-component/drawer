import omit from 'rc-util/lib/omit';
import Portal from 'rc-util/lib/PortalWrapper';
import React, { useEffect, useRef, useState } from 'react';

import Child from './DrawerChild';
import type { IDrawerProps, IDrawerChildProps } from './IDrawerPropTypes';

interface IChildProps extends IDrawerChildProps {
  visible?: boolean;
  afterClose?: () => void;
}
const defaultProps: IDrawerProps = {
  prefixCls: 'drawer',
  placement: 'left',
  getContainer: 'body',
  defaultOpen: false,
  level: 'all',
  duration: '.3s',
  ease: 'cubic-bezier(0.78, 0.14, 0.15, 0.86)',
  onChange: () => {},
  afterVisibleChange: () => {},
  handler: (
    <div className="drawer-handle">
      <i className="drawer-handle-icon" />
    </div>
  ),
  showMask: true,
  maskClosable: true,
  maskStyle: {},
  wrapperClassName: '',
  className: '',
  keyboard: true,
  forceRender: false,
  autoFocus: true,
};
const DrawerWrapper = (props: IDrawerProps) => {
  const {
    getContainer = defaultProps.getContainer,
    handler = defaultProps.handler,
    wrapperClassName = defaultProps.wrapperClassName,
    forceRender = defaultProps.forceRender,
    defaultOpen = defaultProps.defaultOpen,
    afterVisibleChange = defaultProps.afterVisibleChange,
    onHandleClick,
    onClose,
    open: propOpen,
  } = props;
  const hasDefaultOpen = 'defaultOpen' in props;
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (!hasDefaultOpen) {
      setOpen(propOpen);
    }
  }, [hasDefaultOpen, propOpen]);

  if ('onMaskClick' in props) {
    console.warn('`onMaskClick` are removed, please use `onClose` instead.');
  }

  const dom = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (onHandleClick) {
      onHandleClick(e);
    }
    setOpen(c => !c);
  };

  const handleOnClose = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (onClose) {
      onClose(e);
    }
    setOpen(false);
  };
  const childProps = omit({ ...defaultProps, ...props }, [
    'defaultOpen',
    'getContainer',
    'wrapperClassName',
    'forceRender',
    'handler',
  ]);

  // 渲染在当前 dom 里；
  if (!getContainer) {
    return (
      <div className={wrapperClassName} ref={dom}>
        <Child
          {...childProps}
          open={open}
          handler={handler}
          getContainer={() => dom.current as HTMLElement}
          onClose={handleOnClose}
          onHandleClick={handleClick}
        />
      </div>
    );
  }
  // 如果有 handler 为内置强制渲染；
  const $forceRender = !!handler || forceRender;

  return (
    <Portal
      visible={open}
      forceRender={$forceRender}
      getContainer={getContainer}
      wrapperClassName={wrapperClassName}
    >
      {({ visible, afterClose, ...rest }: IChildProps) => (
        // react 15，componentWillUnmount 时 Portal 返回 afterClose, visible.
        <Child
          {...childProps}
          {...rest}
          open={visible !== undefined ? visible : open}
          afterVisibleChange={
            afterClose !== undefined ? afterClose : afterVisibleChange
          }
          handler={handler}
          onClose={handleOnClose}
          onHandleClick={handleClick}
        />
      )}
    </Portal>
  );
};

export default DrawerWrapper;

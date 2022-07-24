import * as React from 'react';
import classNames from 'classnames';
import type { Placement } from './Drawer';

export interface DrawerPanelRef {
  focus: VoidFunction;
}

export interface DrawerPanelProps {
  prefixCls: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
  placement: Placement;
  children?: React.ReactNode;
  containerRef?: React.Ref<HTMLDivElement>;
}

const DrawerPanel = (props: DrawerPanelProps) => {
  const {
    prefixCls,
    className,
    style,
    placement,
    width,
    height,
    children,
    containerRef,
  } = props;

  // =============================== Render ===============================
  const panelStyle: React.CSSProperties = {};

  if (placement === 'left' || placement === 'right') {
    panelStyle.width = width;
  } else {
    panelStyle.height = height;
  }

  return (
    <>
      <div
        className={classNames(`${prefixCls}-content`, className)}
        style={{
          ...panelStyle,
          ...style,
        }}
        aria-modal="true"
        role="dialog"
        ref={containerRef}
      >
        {children}
      </div>
    </>
  );
};

if (process.env.NODE_ENV !== 'production') {
  DrawerPanel.displayName = 'DrawerPanel';
}

export default DrawerPanel;

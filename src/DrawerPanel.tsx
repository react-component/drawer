import * as React from 'react';
import classNames from 'classnames';
import type { Placement } from './Drawer';

export interface DrawerPanelProps {
  prefixCls: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  placement: Placement;
  children?: React.ReactNode;
}

export default function DrawerPanel(props: DrawerPanelProps) {
  const { prefixCls, className, style, placement, width, children } = props;

  return (
    <div
      className={classNames(`${prefixCls}-panel`, className)}
      style={{
        width: placement === 'left' || placement === 'right' ? width : '100%',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

import * as React from 'react';
import classNames from 'classnames';

export interface DrawerPanelRef {
  focus: VoidFunction;
}

export interface DrawerPanelProps {
  prefixCls: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  containerRef?: React.Ref<HTMLDivElement>;
}

const DrawerPanel = (props: DrawerPanelProps) => {
  const { prefixCls, className, style, children, containerRef } = props;

  // =============================== Render ===============================

  return (
    <>
      <div
        className={classNames(`${prefixCls}-content`, className)}
        style={{
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

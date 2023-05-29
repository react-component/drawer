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
  bodyProps?: React.HTMLAttributes<HTMLDivElement>;
}

const DrawerPanel = (props: DrawerPanelProps) => {
  const { prefixCls, className, style, children, containerRef, bodyProps } = props;

  const {
    className: bodyClassName,
    style: bodyStyle,
    ...restProps
  } = bodyProps;

  const mergedClassName = classNames(`${prefixCls}-content`, className, bodyClassName);

  // =============================== Render ===============================

  return (
    <>
      <div
        className={mergedClassName}
        style={{
          ...style,
          ...bodyStyle,
        }}
        aria-modal="true"
        role="dialog"
        ref={containerRef}
        {...restProps}
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

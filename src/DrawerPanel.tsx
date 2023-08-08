import { useComposeRef } from 'rc-util';
import * as React from 'react';
import { RefContext } from './context';

export interface DrawerPanelRef {
  focus: VoidFunction;
}

export interface DrawerPanelEvents {
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseOver?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onKeyUp?: React.KeyboardEventHandler<HTMLDivElement>;
}

export interface DrawerPanelProps extends DrawerPanelEvents {
  prefixCls: string;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  containerRef?: React.Ref<HTMLDivElement>;
}

const DrawerPanel = (props: DrawerPanelProps) => {
  const {
    prefixCls,
    className,
    style,
    children,
    containerRef,
    id,
    onMouseEnter,
    onMouseOver,
    onMouseLeave,
    onClick,
    onKeyDown,
    onKeyUp,
  } = props;

  const eventHandlers = {
    onMouseEnter,
    onMouseOver,
    onMouseLeave,
    onClick,
    onKeyDown,
    onKeyUp,
  };

  const { panel: panelRef } = React.useContext(RefContext);
  const mergedRef = useComposeRef(panelRef, containerRef);

  // =============================== Render ===============================

  return (
    <>
      <div
        id={id}
        className={classNames(`${prefixCls}-content`, className)}
        style={{
          ...style,
        }}
        aria-modal="true"
        role="dialog"
        ref={mergedRef}
        {...eventHandlers}
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

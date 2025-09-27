import { clsx } from 'clsx';
import * as React from 'react';
import { RefContext } from './context';
import pickAttrs from '@rc-component/util/lib/pickAttrs';
import { useComposeRef } from '@rc-component/util/lib/ref';

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

export type DrawerPanelAccessibility = Pick<
  React.DialogHTMLAttributes<HTMLDivElement>,
  keyof React.AriaAttributes
>;

export interface DrawerPanelProps
  extends DrawerPanelEvents,
    DrawerPanelAccessibility {
  prefixCls: string;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  containerRef?: React.Ref<HTMLDivElement>;
}

const DrawerPanel: React.FC<Readonly<DrawerPanelProps>> = props => {
  const { prefixCls, className, containerRef, ...restProps } = props;

  const { panel: panelRef } = React.useContext(RefContext);
  const mergedRef = useComposeRef(panelRef, containerRef);

  // =============================== Render ===============================

  return (
    <div
      className={clsx(`${prefixCls}-section`, className)}
      role="dialog"
      ref={mergedRef}
      {...pickAttrs(props, { aria: true })}
      aria-modal="true"
      {...restProps}
    />
  );
};

if (process.env.NODE_ENV !== 'production') {
  DrawerPanel.displayName = 'DrawerPanel';
}

export default DrawerPanel;

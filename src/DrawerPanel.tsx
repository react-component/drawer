import * as React from 'react';
import classNames from 'classnames';
import type { Placement } from './Drawer';
import KeyCode from 'rc-util/lib/KeyCode';

export interface DrawerPanelRef {
  focus: VoidFunction;
}

export interface DrawerPanelProps {
  prefixCls: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  placement: Placement;
  children?: React.ReactNode;
}

const sentinelStyle: React.CSSProperties = {
  width: 0,
  height: 0,
  overflow: 'hidden',
  outline: 'none',
  position: 'absolute',
};

const DrawerPanel = React.forwardRef<DrawerPanelRef, DrawerPanelProps>(
  (props, ref) => {
    const { prefixCls, className, style, placement, width, children } = props;

    // ================================ Refs ================================
    const panelRef = React.useRef<HTMLDivElement>();
    const sentinelStartRef = React.useRef<HTMLDivElement>();
    const sentinelEndRef = React.useRef<HTMLDivElement>();

    React.useImperativeHandle(ref, () => ({
      focus: () => {
        Promise.resolve().then(() => {
          sentinelStartRef.current?.focus({ preventScroll: true });
        });
      },
    }));

    const onPanelKeyDown: React.KeyboardEventHandler<HTMLDivElement> = ({
      keyCode,
      shiftKey,
    }) => {
      switch (keyCode) {
        case KeyCode.TAB: {
          if (!shiftKey && document.activeElement === sentinelEndRef.current) {
            sentinelStartRef.current?.focus({ preventScroll: true });
          } else if (
            shiftKey &&
            document.activeElement === sentinelStartRef.current
          ) {
            sentinelEndRef.current?.focus({ preventScroll: true });
          }
        }
      }
    };

    // =============================== Render ===============================
    return (
      <>
        <div
          className={classNames(`${prefixCls}-panel`, className)}
          style={{
            width:
              placement === 'left' || placement === 'right' ? width : '100%',
            ...style,
          }}
          aria-modal="true"
          role="dialog"
          tabIndex={-1}
          ref={panelRef}
          onKeyDown={onPanelKeyDown}
        >
          <div
            tabIndex={0}
            ref={sentinelStartRef}
            style={sentinelStyle}
            aria-hidden="true"
          />

          {children}

          <div
            tabIndex={0}
            ref={sentinelEndRef}
            style={sentinelStyle}
            aria-hidden="true"
          />
        </div>
      </>
    );
  },
);

if (process.env.NODE_ENV === 'development') {
  DrawerPanel.displayName = 'DrawerPanel';
}

export default DrawerPanel;

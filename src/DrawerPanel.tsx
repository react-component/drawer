import * as React from 'react';
import classNames from 'classnames';
import type { Placement } from './Drawer';
import KeyCode from 'rc-util/lib/KeyCode';
import { composeRef } from 'rc-util/lib/ref';

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
  onClose?: React.KeyboardEventHandler<HTMLElement>;
  containerRef?: React.Ref<HTMLDivElement>;
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
    const {
      prefixCls,
      className,
      style,
      placement,
      width,
      height,
      children,
      onClose,
      containerRef,
    } = props;

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

    const onPanelKeyDown: React.KeyboardEventHandler<
      HTMLDivElement
    > = event => {
      const { keyCode, shiftKey } = event;

      switch (keyCode) {
        // Tab active
        case KeyCode.TAB: {
          if (keyCode === KeyCode.TAB) {
            if (
              !shiftKey &&
              document.activeElement === sentinelEndRef.current
            ) {
              sentinelStartRef.current?.focus({ preventScroll: true });
            } else if (
              shiftKey &&
              document.activeElement === sentinelStartRef.current
            ) {
              sentinelEndRef.current?.focus({ preventScroll: true });
            }
          }
          break;
        }

        // Close
        case KeyCode.ESC: {
          onClose(event);
          break;
        }
      }
    };

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
          tabIndex={-1}
          ref={composeRef(panelRef, containerRef)}
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

if (process.env.NODE_ENV !== 'production') {
  DrawerPanel.displayName = 'DrawerPanel';
}

export default DrawerPanel;

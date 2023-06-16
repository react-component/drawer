import classNames from 'classnames';
import type { CSSMotionProps } from 'rc-motion';
import CSSMotion from 'rc-motion';
import KeyCode from 'rc-util/lib/KeyCode';
import pickAttrs from 'rc-util/lib/pickAttrs';
import * as React from 'react';
import type { DrawerContextProps } from './context';
import DrawerContext from './context';
import type { DrawerPanelEvents } from './DrawerPanel';
import DrawerPanel from './DrawerPanel';
import { parseWidthHeight } from './util';

const sentinelStyle: React.CSSProperties = {
  width: 0,
  height: 0,
  overflow: 'hidden',
  outline: 'none',
  position: 'absolute',
};

export type Placement = 'left' | 'right' | 'top' | 'bottom';

export interface PushConfig {
  distance?: number | string;
}

export interface DrawerPopupProps extends DrawerPanelEvents {
  prefixCls: string;
  open?: boolean;
  inline?: boolean;
  push?: boolean | PushConfig;
  forceRender?: boolean;
  autoFocus?: boolean;
  keyboard?: boolean;

  // Root
  rootClassName?: string;
  rootStyle?: React.CSSProperties;
  zIndex?: number;

  // Drawer
  placement?: Placement;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  contentWrapperStyle?: React.CSSProperties;

  // Mask
  mask?: boolean;
  maskClosable?: boolean;
  maskClassName?: string;
  maskStyle?: React.CSSProperties;

  // Motion
  motion?: CSSMotionProps | ((placement: Placement) => CSSMotionProps);
  maskMotion?: CSSMotionProps;

  // Events
  afterOpenChange?: (open: boolean) => void;
  onClose?: (
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => void;
}

function DrawerPopup(props: DrawerPopupProps, ref: React.Ref<HTMLDivElement>) {
  const {
    prefixCls,
    open,
    placement,
    inline,
    push,
    forceRender,
    autoFocus,
    keyboard,

    // Root
    rootClassName,
    rootStyle,
    zIndex,

    // Drawer
    className,
    id,
    style,
    motion,
    width,
    height,
    children,
    contentWrapperStyle,

    // Mask
    mask,
    maskClosable,
    maskMotion,
    maskClassName,
    maskStyle,

    // Events
    afterOpenChange,
    onClose,
    onMouseEnter,
    onMouseOver,
    onMouseLeave,
    onClick,
    onKeyDown,
    onKeyUp,
  } = props;

  // ================================ Refs ================================
  const panelRef = React.useRef<HTMLDivElement>();
  const sentinelStartRef = React.useRef<HTMLDivElement>();
  const sentinelEndRef = React.useRef<HTMLDivElement>();

  React.useImperativeHandle(ref, () => panelRef.current);

  const onPanelKeyDown: React.KeyboardEventHandler<HTMLDivElement> = event => {
    const { keyCode, shiftKey } = event;

    switch (keyCode) {
      // Tab active
      case KeyCode.TAB: {
        if (keyCode === KeyCode.TAB) {
          if (!shiftKey && document.activeElement === sentinelEndRef.current) {
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
        if (onClose && keyboard) {
          event.stopPropagation();
          onClose(event);
        }
        break;
      }
    }
  };

  // ========================== Control ===========================
  // Auto Focus
  React.useEffect(() => {
    if (open && autoFocus) {
      panelRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  // ============================ Push ============================
  const [pushed, setPushed] = React.useState(false);

  const parentContext = React.useContext(DrawerContext);

  // Merge push distance
  let pushConfig: PushConfig;
  if (push === false) {
    pushConfig = {
      distance: 0,
    };
  } else if (push === true) {
    pushConfig = {};
  } else {
    pushConfig = push || {};
  }
  const pushDistance =
    pushConfig?.distance ?? parentContext?.pushDistance ?? 180;

  const mergedContext = React.useMemo<DrawerContextProps>(
    () => ({
      pushDistance,
      push: () => {
        setPushed(true);
      },
      pull: () => {
        setPushed(false);
      },
    }),
    [pushDistance],
  );

  // ========================= ScrollLock =========================
  // Tell parent to push
  React.useEffect(() => {
    if (open) {
      parentContext?.push?.();
    } else {
      parentContext?.pull?.();
    }
  }, [open]);

  // Clean up
  React.useEffect(
    () => () => {
      parentContext?.pull?.();
    },
    [],
  );

  // ============================ Mask ============================
  const maskNode: React.ReactNode = mask && (
    <CSSMotion key="mask" {...maskMotion} visible={open}>
      {(
        { className: motionMaskClassName, style: motionMaskStyle },
        maskRef,
      ) => {
        return (
          <div
            className={classNames(
              `${prefixCls}-mask`,
              motionMaskClassName,
              maskClassName,
            )}
            style={{
              ...motionMaskStyle,
              ...maskStyle,
            }}
            onClick={maskClosable && open ? onClose : undefined}
            ref={maskRef}
          />
        );
      }}
    </CSSMotion>
  );

  // =========================== Panel ============================
  const motionProps = typeof motion === 'function' ? motion(placement) : motion;

  const wrapperStyle: React.CSSProperties = {};

  if (pushed && pushDistance) {
    switch (placement) {
      case 'top':
        wrapperStyle.transform = `translateY(${pushDistance}px)`;
        break;
      case 'bottom':
        wrapperStyle.transform = `translateY(${-pushDistance}px)`;
        break;
      case 'left':
        wrapperStyle.transform = `translateX(${pushDistance}px)`;

        break;
      default:
        wrapperStyle.transform = `translateX(${-pushDistance}px)`;
        break;
    }
  }

  if (placement === 'left' || placement === 'right') {
    wrapperStyle.width = parseWidthHeight(width);
  } else {
    wrapperStyle.height = parseWidthHeight(height);
  }

  const eventHandlers = {
    onMouseEnter,
    onMouseOver,
    onMouseLeave,
    onClick,
    onKeyDown,
    onKeyUp,
  };

  const panelNode: React.ReactNode = (
    <CSSMotion
      key="panel"
      {...motionProps}
      visible={open}
      forceRender={forceRender}
      onVisibleChanged={nextVisible => {
        afterOpenChange?.(nextVisible);
      }}
      removeOnLeave={false}
      leavedClassName={`${prefixCls}-content-wrapper-hidden`}
    >
      {({ className: motionClassName, style: motionStyle }, motionRef) => {
        return (
          <div
            className={classNames(
              `${prefixCls}-content-wrapper`,
              motionClassName,
            )}
            style={{
              ...wrapperStyle,
              ...motionStyle,
              ...contentWrapperStyle,
            }}
            {...pickAttrs(props, { data: true })}
          >
            <DrawerPanel
              containerRef={motionRef}
              prefixCls={prefixCls}
              className={className}
              style={style}
              {...eventHandlers}
            >
              {children}
            </DrawerPanel>
          </div>
        );
      }}
    </CSSMotion>
  );

  // =========================== Render ===========================
  const containerStyle: React.CSSProperties = {
    ...rootStyle,
  };

  if (zIndex) {
    containerStyle.zIndex = zIndex;
  }

  return (
    <DrawerContext.Provider value={mergedContext}>
      <div
        id={id}
        className={classNames(
          prefixCls,
          `${prefixCls}-${placement}`,
          rootClassName,
          {
            [`${prefixCls}-open`]: open,
            [`${prefixCls}-inline`]: inline,
          },
        )}
        style={containerStyle}
        tabIndex={-1}
        ref={panelRef}
        onKeyDown={onPanelKeyDown}
      >
        {maskNode}
        <div
          tabIndex={0}
          ref={sentinelStartRef}
          style={sentinelStyle}
          aria-hidden="true"
          data-sentinel="start"
        />
        {panelNode}
        <div
          tabIndex={0}
          ref={sentinelEndRef}
          style={sentinelStyle}
          aria-hidden="true"
          data-sentinel="end"
        />
      </div>
    </DrawerContext.Provider>
  );
}

const RefDrawerPopup = React.forwardRef(DrawerPopup);

if (process.env.NODE_ENV !== 'production') {
  RefDrawerPopup.displayName = 'DrawerPopup';
}

export default RefDrawerPopup;

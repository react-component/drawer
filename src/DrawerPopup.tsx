import classNames from 'classnames';
import type { CSSMotionProps } from 'rc-motion';
import CSSMotion from 'rc-motion';
import KeyCode from 'rc-util/lib/KeyCode';
import pickAttrs from 'rc-util/lib/pickAttrs';
import * as React from 'react';
import type { DrawerContextProps } from './context';
import DrawerContext from './context';
import type {
  DrawerPanelAccessibility,
  DrawerPanelEvents,
} from './DrawerPanel';
import DrawerPanel from './DrawerPanel';
import ResizableLine from './ResizableLine';
import { parseWidthHeight } from './util';
import type { DrawerClassNames, DrawerStyles } from './inter';

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

export interface DrawerPopupProps
  extends DrawerPanelEvents,
    DrawerPanelAccessibility {
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

  // classNames
  classNames?: DrawerClassNames;

  // styles
  styles?: DrawerStyles;
  drawerRender?: (node: React.ReactNode) => React.ReactNode;

  // resizable
  resizable?: boolean;
  onResize?: (size: number) => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
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

    // classNames
    classNames: drawerClassNames,
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
    onResize,
    onResizeStart,
    onResizeEnd,

    styles,
    drawerRender,
    resizable,
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
  if (typeof push === 'boolean') {
    pushConfig = push ? {} : { distance: 0 };
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
  const maskNode: React.ReactNode = (
    <CSSMotion key="mask" {...maskMotion} visible={mask && open}>
      {(
        { className: motionMaskClassName, style: motionMaskStyle },
        maskRef,
      ) => (
        <div
          className={classNames(
            `${prefixCls}-mask`,
            motionMaskClassName,
            drawerClassNames?.mask,
            maskClassName,
          )}
          style={{
            ...motionMaskStyle,
            ...maskStyle,
            ...styles?.mask,
          }}
          onClick={maskClosable && open ? onClose : undefined}
          ref={maskRef}
        />
      )}
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

  // ============================ Resizable ============================
  const [currentSize, setCurrentSize] = React.useState<number>();
  const [isDragging, setIsDragging] = React.useState(false);

  const handleResize = React.useCallback(
    (size: number) => {
      setCurrentSize(size);
      onResize?.(size);
    },
    [onResize],
  );

  const handleResizeStart = React.useCallback(() => {
    setIsDragging(true);
    onResizeStart?.();
  }, [onResizeStart]);

  const handleResizeEnd = React.useCallback(() => {
    setIsDragging(false);
    onResizeEnd?.();
  }, [onResizeEnd]);

  const dynamicWrapperStyle = React.useMemo(() => {
    const style: React.CSSProperties = { ...wrapperStyle };

    if (currentSize !== undefined && resizable) {
      if (placement === 'left' || placement === 'right') {
        style.width = currentSize;
      } else {
        style.height = currentSize;
      }
    }

    if (resizable) {
      style.overflow = 'none';
    } else {
      style.overflow = 'auto';
    }

    return style;
  }, [wrapperStyle, currentSize, resizable, placement]);

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [maxSize, setMaxSize] = React.useState(0);
  React.useEffect(() => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.parentElement?.getBoundingClientRect();
      console.log(rect, 'rect');

      setMaxSize(
        placement === 'left' || placement === 'right'
          ? (rect?.width ?? 0)
          : (rect?.height ?? 0),
      );
    }
  }, [wrapperRef.current]);

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
        const content = (
          <DrawerPanel
            id={id}
            containerRef={motionRef}
            prefixCls={prefixCls}
            className={classNames(className, drawerClassNames?.content)}
            style={{
              ...style,
              ...styles?.content,
            }}
            {...pickAttrs(props, { aria: true })}
            {...eventHandlers}
          >
            {children}
          </DrawerPanel>
        );
        return (
          <div
            ref={wrapperRef}
            className={classNames(
              `${prefixCls}-content-wrapper`,
              drawerClassNames?.wrapper,
              !isDragging && motionClassName,
            )}
            style={{
              ...dynamicWrapperStyle,
              ...motionStyle,
              ...styles?.wrapper,
            }}
            {...pickAttrs(props, { data: true })}
          >
            <ResizableLine
              prefixCls={`${prefixCls}-resizable`}
              direction={placement}
              resizable={resizable}
              className={drawerClassNames?.resizableLine}
              style={styles?.resizableLine}
              minSize={0}
              maxSize={maxSize}
              onResize={handleResize}
              onResizeStart={handleResizeStart}
              onResizeEnd={handleResizeEnd}
            />
            {drawerRender ? drawerRender(content) : content}
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

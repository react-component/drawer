import classNames from 'classnames';
import type { CSSMotionProps } from '@rc-component/motion';
import CSSMotion from '@rc-component/motion';
import KeyCode from '@rc-component/util/lib/KeyCode';
import pickAttrs from '@rc-component/util/lib/pickAttrs';
import * as React from 'react';
import type { DrawerContextProps } from './context';
import DrawerContext from './context';
import type {
  DrawerPanelAccessibility,
  DrawerPanelEvents,
} from './DrawerPanel';
import DrawerPanel from './DrawerPanel';
import useDrag from './hooks/useDrag';
import { parseWidthHeight } from './util';
import type { DrawerClassNames, DrawerStyles } from './inter';
import { useEvent } from '@rc-component/util';

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
  /** Size of the drawer (width for left/right placement, height for top/bottom placement) */
  size?: number | string;
  /** Maximum size of the drawer */
  maxSize?: number;

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
  /** Default size for uncontrolled resizable drawer */
  defaultSize?: number | string;
  resizable?: {
    onResize?: (size: number) => void;
    onResizeStart?: () => void;
    onResizeEnd?: () => void;
  };
}

const DrawerPopup: React.ForwardRefRenderFunction<
  HTMLDivElement,
  DrawerPopupProps
> = (props, ref) => {
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
    size,
    maxSize,
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

    styles,
    drawerRender,
    resizable,
    defaultSize,
  } = props;

  // ================================ Refs ================================
  const panelRef = React.useRef<HTMLDivElement>(null);
  const sentinelStartRef = React.useRef<HTMLDivElement>(null);
  const sentinelEndRef = React.useRef<HTMLDivElement>(null);

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

  // ============================ Size ============================
  const [currentSize, setCurrentSize] = React.useState<number>();
  const isHorizontal = placement === 'left' || placement === 'right';

  // Aggregate size logic with backward compatibility using useMemo
  const mergedSize = React.useMemo(() => {
    const legacySize = isHorizontal ? width : height;

    const nextMergedSize =
      size ??
      legacySize ??
      currentSize ??
      defaultSize ??
      (isHorizontal ? 378 : undefined);

    return parseWidthHeight(nextMergedSize);
  }, [size, width, height, defaultSize, isHorizontal, currentSize]);

  // >>> Style
  const wrapperStyle: React.CSSProperties = React.useMemo(() => {
    const nextWrapperStyle: React.CSSProperties = {};

    if (pushed && pushDistance) {
      switch (placement) {
        case 'top':
          nextWrapperStyle.transform = `translateY(${pushDistance}px)`;
          break;
        case 'bottom':
          nextWrapperStyle.transform = `translateY(${-pushDistance}px)`;
          break;
        case 'left':
          nextWrapperStyle.transform = `translateX(${pushDistance}px)`;

          break;
        default:
          nextWrapperStyle.transform = `translateX(${-pushDistance}px)`;
          break;
      }
    }

    if (isHorizontal) {
      nextWrapperStyle.width = parseWidthHeight(mergedSize);
    } else {
      nextWrapperStyle.height = parseWidthHeight(mergedSize);
    }

    return nextWrapperStyle;
  }, [pushed, pushDistance, placement, isHorizontal, mergedSize]);

  // =========================== Resize ===========================
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const onInternalResize = useEvent((size: number) => {
    setCurrentSize(size);
    resizable?.onResize?.(size);
  });

  const { dragElementProps, isDragging } = useDrag({
    prefixCls: `${prefixCls}-resizable`,
    direction: placement,
    className: drawerClassNames?.dragger,
    style: styles?.dragger,
    maxSize,
    containerRef: wrapperRef,
    currentSize: mergedSize,
    onResize: onInternalResize,
    onResizeStart: resizable?.onResizeStart,
    onResizeEnd: resizable?.onResizeEnd,
  });

  // =========================== Events ===========================
  const eventHandlers = {
    onMouseEnter,
    onMouseOver,
    onMouseLeave,
    onClick,
    onKeyDown,
    onKeyUp,
  };

  // =========================== Render ==========================
  // >>>>> Panel
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
            className={classNames(className, drawerClassNames?.section)}
            style={{
              ...style,
              ...styles?.section,
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
              isDragging && `${prefixCls}-content-wrapper-dragging`,
              drawerClassNames?.wrapper,
              !isDragging && motionClassName,
            )}
            style={{
              ...motionStyle,
              ...wrapperStyle,
              ...styles?.wrapper,
            }}
            {...pickAttrs(props, { data: true })}
          >
            {resizable && <div {...dragElementProps} />}
            {drawerRender ? drawerRender(content) : content}
          </div>
        );
      }}
    </CSSMotion>
  );

  // >>>>> Container
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
};

const RefDrawerPopup = React.forwardRef(DrawerPopup);

if (process.env.NODE_ENV !== 'production') {
  RefDrawerPopup.displayName = 'DrawerPopup';
}

export default RefDrawerPopup;

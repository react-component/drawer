import * as React from 'react';
import classNames from 'classnames';
import CSSMotion from 'rc-motion';
import type { CSSMotionProps } from 'rc-motion';
import DrawerPanel from './DrawerPanel';
import type ScrollLocker from 'rc-util/lib/Dom/scrollLocker';

export type Placement = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerPopupProps {
  prefixCls: string;
  open?: boolean;
  placement?: Placement;

  // MISC
  scrollLocker?: ScrollLocker;

  // Root
  rootClassName?: string;
  rootStyle?: React.CSSProperties;

  // Drawer
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  width?: number | string;
  afterOpenChange?: (open: boolean) => void;

  // Mask
  mask?: boolean;
  maskClosable?: boolean;
  maskClassName?: React.CSSProperties;
  maskStyle?: React.CSSProperties;

  // Motion
  motion?: CSSMotionProps | ((placement: Placement) => CSSMotionProps);
  maskMotion?: CSSMotionProps;

  // Events
  onClose?: React.MouseEventHandler<HTMLElement>;
}

export default function DrawerPopup(props: DrawerPopupProps) {
  const {
    prefixCls,
    open,
    placement = 'left',

    // MISC
    scrollLocker,

    // Root
    rootClassName,
    rootStyle,

    // Drawer
    className,
    style,
    motion,
    width = 378,
    children,
    afterOpenChange,

    // Mask
    mask = true,
    maskClosable = true,
    maskMotion,
    maskClassName,
    maskStyle,

    // Events
    onClose,
  } = props;

  // ========================= ScrollLock =========================
  React.useEffect(() => {
    if (open) {
      scrollLocker?.lock();
    }
  }, [open]);

  React.useEffect(
    () => () => {
      scrollLocker?.unLock();
    },
    [],
  );

  // ============================ Mask ============================
  const maskNode: React.ReactNode = mask && (
    <CSSMotion key="mask" {...maskMotion} visible={open}>
      {({ className: motionMaskClassName, style: motionMaskStyle }) => {
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
            onClick={maskClosable && onClose}
          />
        );
      }}
    </CSSMotion>
  );

  // =========================== Panel ============================
  const motionProps = typeof motion === 'function' ? motion(placement) : motion;

  const panelNode: React.ReactNode = (
    <div className={`${prefixCls}-panel-wrapper`}>
      <CSSMotion
        key="panel"
        {...motionProps}
        visible={open}
        onVisibleChanged={nextVisible => {
          afterOpenChange?.(nextVisible);
          if (!nextVisible) {
            scrollLocker?.unLock();
          }
        }}
        removeOnLeave={false}
        leavedClassName={`${prefixCls}-panel-wrapper-hidden`}
      >
        {({ className: motionClassName, style: motionStyle }) => {
          return (
            <DrawerPanel
              prefixCls={prefixCls}
              className={classNames(className, motionClassName)}
              style={{
                ...motionStyle,
                ...style,
              }}
              width={width}
              placement={placement}
            >
              {children}
            </DrawerPanel>
          );
        }}
      </CSSMotion>
    </div>
  );

  // =========================== Render ===========================
  return (
    <div
      className={classNames(
        prefixCls,
        `${prefixCls}-${placement}`,
        rootClassName,
      )}
      style={rootStyle}
    >
      {maskNode}
      {panelNode}
    </div>
  );
}

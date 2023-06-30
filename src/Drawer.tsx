import * as React from 'react';
import Portal from '@rc-component/portal';
import type { PortalProps } from '@rc-component/portal';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import DrawerPopup from './DrawerPopup';
import type { DrawerPopupProps } from './DrawerPopup';
import { warnCheck } from './util';
import type { DrawerPanelEvents } from './DrawerPanel';

export type Placement = 'left' | 'top' | 'right' | 'bottom';

export interface DrawerProps
  extends Omit<DrawerPopupProps, 'prefixCls' | 'inline' | 'scrollLocker'>, DrawerPanelEvents {
  prefixCls?: string;
  open?: boolean;
  onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  destroyOnClose?: boolean;
  getContainer?: PortalProps['getContainer'];
}

const Drawer: React.FC<DrawerProps> = props => {
  const {
    open = false,
    prefixCls = 'rc-drawer',
    placement = 'right' as Placement,
    autoFocus = true,
    keyboard = true,
    width = 378,
    mask = true,
    maskClosable = true,
    getContainer,
    forceRender,
    afterOpenChange,
    destroyOnClose,
    onMouseEnter,
    onMouseOver,
    onMouseLeave,
    onClick,
    onKeyDown,
    onKeyUp,
  } = props;

  const [animatedVisible, setAnimatedVisible] = React.useState(false);

  // ============================= Warn =============================
  if (process.env.NODE_ENV !== 'production') {
    warnCheck(props);
  }

  // ============================= Open =============================
  const [mounted, setMounted] = React.useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  const mergedOpen = mounted ? open : false;

  // ============================ Focus =============================
  const panelRef = React.useRef<HTMLDivElement>();

  const lastActiveRef = React.useRef<HTMLElement>();
  useLayoutEffect(() => {
    if (mergedOpen) {
      lastActiveRef.current = document.activeElement as HTMLElement;
    }
  }, [mergedOpen]);

  // ============================= Open =============================
  const internalAfterOpenChange: DrawerProps['afterOpenChange'] =
    nextVisible => {
      setAnimatedVisible(nextVisible);
      afterOpenChange?.(nextVisible);

      if (
        !nextVisible &&
        lastActiveRef.current &&
        !panelRef.current?.contains(lastActiveRef.current)
      ) {
        lastActiveRef.current?.focus({ preventScroll: true });
      }
    };

  // ============================ Render ============================
  if (!forceRender && !animatedVisible && !mergedOpen && destroyOnClose) {
    return null;
  }

  const eventHandlers = {
    onMouseEnter,
    onMouseOver,
    onMouseLeave,
    onClick,
    onKeyDown,
    onKeyUp,
  };
  const drawerPopupProps = {
    ...props,
    open: mergedOpen,
    prefixCls,
    placement,
    autoFocus,
    keyboard,
    width,
    mask,
    maskClosable,
    inline: getContainer !== undefined,
    afterOpenChange: internalAfterOpenChange,
    ref: panelRef,
    ...eventHandlers,
  };

  return (
    <Portal
      open={mergedOpen || forceRender || animatedVisible}
      autoDestroy={false}
      getContainer={getContainer}
      autoLock={mask && (mergedOpen || animatedVisible)}
    >
      <DrawerPopup {...drawerPopupProps} />
    </Portal>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Drawer.displayName = 'Drawer';
}

export default Drawer;

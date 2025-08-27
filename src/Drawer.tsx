import type { PortalProps } from '@rc-component/portal';
import Portal from '@rc-component/portal';
import useLayoutEffect from '@rc-component/util/lib/hooks/useLayoutEffect';
import * as React from 'react';
import { RefContext } from './context';
import type {
  DrawerPanelAccessibility,
  DrawerPanelEvents,
} from './DrawerPanel';
import type { DrawerPopupProps } from './DrawerPopup';
import DrawerPopup from './DrawerPopup';
import { warnCheck } from './util';
import type { DrawerClassNames, DrawerStyles } from './inter';

export type Placement = 'left' | 'top' | 'right' | 'bottom';

export interface DrawerProps
  extends Omit<DrawerPopupProps, 'prefixCls' | 'inline' | 'scrollLocker'>,
    DrawerPanelEvents,
    DrawerPanelAccessibility {
  prefixCls?: string;
  open?: boolean;
  onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  destroyOnHidden?: boolean;
  getContainer?: PortalProps['getContainer'];
  panelRef?: React.Ref<HTMLDivElement>;
  classNames?: DrawerClassNames;
  styles?: DrawerStyles;
  /** Default width for uncontrolled resizable drawer */
  defaultWidth?: number | string;
  /** Default height for uncontrolled resizable drawer */
  defaultHeight?: number | string;
  /** Resizable configuration - object with optional callbacks */
  resizable?: {
    onResize?: (size: number) => void;
    onResizeStart?: () => void;
    onResizeEnd?: () => void;
  };
}

const Drawer: React.FC<DrawerProps> = props => {
  const {
    open = false,
    prefixCls = 'rc-drawer',
    placement = 'right' as Placement,
    autoFocus = true,
    keyboard = true,
    width,
    mask = true,
    maskClosable = true,
    getContainer,
    forceRender,
    afterOpenChange,
    destroyOnHidden,
    onMouseEnter,
    onMouseOver,
    onMouseLeave,
    onClick,
    onKeyDown,
    onKeyUp,
    resizable,
    defaultWidth,
    defaultHeight,

    // Refs
    panelRef,
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
  const popupRef = React.useRef<HTMLDivElement>(null);

  const lastActiveRef = React.useRef<HTMLElement>(null);
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
        !popupRef.current?.contains(lastActiveRef.current)
      ) {
        lastActiveRef.current?.focus({ preventScroll: true });
      }
    };

  // =========================== Context ============================
  const refContext = React.useMemo(() => ({ panel: panelRef }), [panelRef]);

  // ============================ Render ============================
  if (!forceRender && !animatedVisible && !mergedOpen && destroyOnHidden) {
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
    width:
      width !== undefined
        ? width
        : defaultWidth !== undefined
          ? undefined
          : 378,
    mask,
    maskClosable,
    inline: getContainer === false,
    afterOpenChange: internalAfterOpenChange,
    ref: popupRef,
    resizable,
    defaultWidth,
    defaultHeight,
    ...eventHandlers,
  };

  return (
    <RefContext.Provider value={refContext}>
      <Portal
        open={mergedOpen || forceRender || animatedVisible}
        autoDestroy={false}
        getContainer={getContainer}
        autoLock={mask && (mergedOpen || animatedVisible)}
      >
        <DrawerPopup {...drawerPopupProps} />
      </Portal>
    </RefContext.Provider>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Drawer.displayName = 'Drawer';
}

export default Drawer;

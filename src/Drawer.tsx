import type { PortalProps } from '@rc-component/portal';
import Portal from '@rc-component/portal';
import { useLayoutEffect } from '@rc-component/util';
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
  extends
    Omit<
      DrawerPopupProps,
      'prefixCls' | 'inline' | 'scrollLocker' | 'onPopupFocus'
    >,
    DrawerPanelEvents,
    DrawerPanelAccessibility {
  prefixCls?: string;
  open?: boolean;
  onClose?: (e: React.MouseEvent | React.KeyboardEvent | KeyboardEvent) => void;
  destroyOnHidden?: boolean;
  getContainer?: PortalProps['getContainer'];
  panelRef?: React.Ref<HTMLDivElement>;
  classNames?: DrawerClassNames;
  styles?: DrawerStyles;
  /**
   * @deprecated Use `size` instead. Will be removed in next major version.
   */
  width?: number | string;
  /**
   * @deprecated Use `size` instead. Will be removed in next major version.
   */
  height?: number | string;
  /** Size of the drawer (width for left/right placement, height for top/bottom placement) */
  size?: number | string;
  /** Maximum size of the drawer */
  maxSize?: number;
  /** Default size for uncontrolled resizable drawer */
  defaultSize?: number | string;
  /** Resizable configuration - boolean to enable/disable or object with optional callbacks */
  resizable?:
    | boolean
    | {
        onResize?: (size: number) => void;
        onResizeStart?: (size: number) => void;
        onResizeEnd?: (size: number) => void;
      };
  focusTriggerAfterClose?: boolean;
}

const Drawer: React.FC<DrawerProps> = props => {
  const {
    open = false,
    prefixCls = 'rc-drawer',
    placement = 'right' as Placement,
    autoFocus = true,
    keyboard = true,
    width,
    height,
    size,
    maxSize,
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
    onClose,
    resizable,
    defaultSize,
    focusTriggerAfterClose,

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

  // Mark it as opened as soon as `mergedOpen` turns true. `afterOpenChange` only
  // fires after the whole motion finished, so closing during the enter motion
  // would otherwise unmount the drawer without playing the leave motion.
  // Layout effect so the update is batched together with `setMounted` above.
  useLayoutEffect(() => {
    if (mergedOpen) {
      setAnimatedVisible(true);
    }
  }, [mergedOpen]);

  // ============================ Focus =============================
  const popupRef = React.useRef<HTMLDivElement>(null);

  const openingFocusRef = React.useRef<HTMLElement>(null);
  const lastOutsideFocusRef = React.useRef<HTMLElement>(null);
  const previousFocusByEvent = React.useRef(
    new WeakMap<Event, HTMLElement | null>(),
  );

  useLayoutEffect(() => {
    const record = (element: EventTarget | null, event?: FocusEvent) => {
      if (
        element instanceof HTMLElement &&
        element !== document.body &&
        !popupRef.current?.contains(element)
      ) {
        if (event) {
          previousFocusByEvent.current.set(event, lastOutsideFocusRef.current);
        }
        lastOutsideFocusRef.current = element;
      }
    };

    record(document.activeElement);
    const onFocusIn = (event: FocusEvent) => record(event.target, event);

    document.addEventListener('focusin', onFocusIn, true);
    return () => document.removeEventListener('focusin', onFocusIn, true);
  }, []);

  useLayoutEffect(() => {
    if (mergedOpen) {
      openingFocusRef.current = lastOutsideFocusRef.current;
    }
  }, [mergedOpen]);

  // ============================= Open =============================
  const internalAfterOpenChange: DrawerProps['afterOpenChange'] =
    nextVisible => {
      setAnimatedVisible(nextVisible);
      afterOpenChange?.(nextVisible);

      if (!nextVisible && focusTriggerAfterClose !== false) {
        const restoreFocus = (target: HTMLElement | null) => {
          if (!target?.isConnected || popupRef.current?.contains(target)) {
            return false;
          }

          const view = target.ownerDocument.defaultView;
          for (
            let element: HTMLElement | null = target;
            element;
            element = element.parentElement
          ) {
            if (view?.getComputedStyle(element).display === 'none') {
              return false;
            }
          }

          target.focus({ preventScroll: true });
          return target.matches(':focus');
        };

        if (!restoreFocus(lastOutsideFocusRef.current)) {
          restoreFocus(openingFocusRef.current);
        }
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
    width,
    height,
    size,
    maxSize,
    defaultSize,
    mask,
    maskClosable,
    inline: getContainer === false,
    afterOpenChange: internalAfterOpenChange,
    ref: popupRef,
    onPopupFocus: (event: React.FocusEvent<HTMLDivElement>) => {
      // React capture also sees focus from child portals. Undo the native
      // document capture for this event when the target belongs to the popup.
      const previous = previousFocusByEvent.current.get(event.nativeEvent);
      if (
        previous !== undefined &&
        lastOutsideFocusRef.current === event.target
      ) {
        lastOutsideFocusRef.current = previous;
      }
    },
    resizable,
    ...eventHandlers,
  };

  const onEsc: PortalProps['onEsc'] = ({ top, event }) => {
    if (top && keyboard) {
      event.stopPropagation();
      onClose?.(event);
    }
  };

  return (
    <RefContext.Provider value={refContext}>
      <Portal
        open={mergedOpen || forceRender || animatedVisible}
        autoDestroy={false}
        getContainer={getContainer}
        autoLock={mask && (mergedOpen || animatedVisible)}
        onEsc={onEsc}
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

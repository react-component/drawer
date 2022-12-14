import * as React from 'react';
import Portal from '@rc-component/portal';
import type { PortalProps } from '@rc-component/portal';
import DrawerPopup from './DrawerPopup';
import type { DrawerPopupProps } from './DrawerPopup';
import { warnCheck } from './util';

export type Placement = 'left' | 'top' | 'right' | 'bottom';

export interface DrawerProps
  extends Omit<DrawerPopupProps, 'prefixCls' | 'inline' | 'scrollLocker'> {
  prefixCls?: string;

  open?: boolean;
  onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  destroyOnClose?: boolean;
  getContainer?: PortalProps['getContainer'];
}

// Default Value.
// Since spread with default value will make this all over components.
// Let's maintain this in one place.
const defaultProps = {
  open: false,
  prefixCls: 'rc-drawer',
  placement: 'right' as Placement,
  autoFocus: true,
  keyboard: true,
  width: 378,
  mask: true,
  maskClosable: true,
};

const Drawer: React.FC<DrawerProps> = drawerProps => {
  const props = {
    ...defaultProps,
    ...drawerProps,
  };
  const {
    open,
    getContainer,
    forceRender,
    prefixCls,
    afterOpenChange,
    destroyOnClose,
    mask,
  } = props;

  const [animatedVisible, setAnimatedVisible] = React.useState(false);

  // ============================= Warn =============================
  if (process.env.NODE_ENV !== 'production') {
    warnCheck(props);
  }

  // ============================= Open =============================
  const internalAfterOpenChange: DrawerProps['afterOpenChange'] =
    nextVisible => {
      setAnimatedVisible(nextVisible);
      afterOpenChange?.(nextVisible);
    };

  // ============================ Render ============================
  if (!forceRender && !animatedVisible && !open && destroyOnClose) {
    return null;
  }

  const sharedDrawerProps = {
    ...props,
    prefixCls,
    afterOpenChange: internalAfterOpenChange,
  };

  return (
    <Portal
      open={open || forceRender || animatedVisible}
      autoDestroy={false}
      getContainer={getContainer}
      autoLock={mask && (open || animatedVisible)}
    >
      <DrawerPopup {...sharedDrawerProps} inline={getContainer === false} />
    </Portal>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Drawer.displayName = 'Drawer';
}

export default Drawer;

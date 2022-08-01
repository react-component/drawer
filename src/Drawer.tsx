import * as React from 'react';
import type { GetContainer } from 'rc-util/lib/PortalWrapper';
import Portal from 'rc-util/lib/PortalWrapper';
import DrawerPopup from './DrawerPopup';
import type { DrawerPopupProps } from './DrawerPopup';

export type Placement = 'left' | 'top' | 'right' | 'bottom';

export interface DrawerProps
  extends Omit<DrawerPopupProps, 'prefixCls' | 'inline' | 'scrollLocker'> {
  prefixCls?: string;

  open?: boolean;
  onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  /** @deprecated Only work on Portal mode. You can replace with rootClassName instead */
  wrapperClassName?: string;
  destroyOnClose?: boolean;
  getContainer?: GetContainer | false;
}

const defaultGetContainer = () => document.body;

const Drawer: React.FC<DrawerProps> = props => {
  const {
    open,
    getContainer,
    forceRender,
    wrapperClassName,
    prefixCls,
    afterOpenChange,
    destroyOnClose,
  } = props;

  const [animatedVisible, setAnimatedVisible] = React.useState(false);

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

  if (getContainer === false) {
    return <DrawerPopup {...sharedDrawerProps} inline />;
  }

  return (
    <Portal
      visible={open}
      forceRender={forceRender}
      getContainer={getContainer}
      wrapperClassName={wrapperClassName}
    >
      {({ scrollLocker }) => (
        <DrawerPopup {...sharedDrawerProps} scrollLocker={scrollLocker} />
      )}
    </Portal>
  );
};

// Default Value.
// Since spread with default value will make this all over components.
// Let's maintain this in one place.
Drawer.defaultProps = {
  open: false,
  getContainer: defaultGetContainer,
  prefixCls: 'rc-drawer',
  placement: 'right',
  autoFocus: true,
  keyboard: true,
  width: 378,
  mask: true,
  maskClosable: true,
};

if (process.env.NODE_ENV !== 'production') {
  Drawer.displayName = 'Drawer';
}

export default Drawer;

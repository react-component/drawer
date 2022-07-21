import * as React from 'react';
import type { GetContainer } from 'rc-util/lib/PortalWrapper';
import Portal from 'rc-util/lib/PortalWrapper';
import DrawerPopup from './DrawerPopup';
import type { DrawerPopupProps } from './DrawerPopup';

export type Placement = 'left' | 'top' | 'right' | 'bottom';

export interface DrawerProps extends Omit<DrawerPopupProps, 'prefixCls'> {
  prefixCls?: string;

  width?: string | number;
  height?: string | number;
  open?: boolean;
  placement?: Placement;
  duration?: string;
  onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  keyboard?: boolean;
  contentWrapperStyle?: React.CSSProperties;
  autoFocus?: boolean;
  wrapperClassName?: string;
  destroyOnClose?: boolean;

  getContainer?: GetContainer | false;
}

const defaultGetContainer = () => document.body;

export default function Drawer(props: DrawerProps) {
  const {
    open,
    getContainer = defaultGetContainer,
    forceRender,
    wrapperClassName,
    prefixCls = 'rc-drawer',
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
  const sharedDrawerProps = {
    ...props,
    prefixCls,
    afterOpenChange: internalAfterOpenChange,
  };

  if (getContainer === false) {
    return <DrawerPopup {...sharedDrawerProps} inline />;
  }

  if (!forceRender && !animatedVisible && !open && destroyOnClose) {
    return null;
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
}

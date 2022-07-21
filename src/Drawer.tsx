import * as React from 'react';
import type { GetContainer } from 'rc-util/lib/PortalWrapper';
import Portal from 'rc-util/lib/PortalWrapper';
import DrawerPopup from './DrawerPopup';
import type { DrawerPopupProps } from './DrawerPopup';

export type Placement = 'left' | 'top' | 'right' | 'bottom';

type LevelMove = number | [number, number];

export interface DrawerProps extends Omit<DrawerPopupProps, 'prefixCls'> {
  prefixCls?: string;

  width?: string | number;
  height?: string | number;
  open?: boolean;
  handler?: React.ReactElement | null | false;
  placement?: Placement;
  level?: null | string | string[];
  levelMove?:
    | LevelMove
    | ((e: { target: HTMLElement; open: boolean }) => LevelMove);
  duration?: string;
  ease?: string;
  showMask?: boolean;
  onChange?: (open?: boolean) => void;
  onHandleClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  keyboard?: boolean;
  contentWrapperStyle?: React.CSSProperties;
  autoFocus?: boolean;
  wrapperClassName?: string;
  forceRender?: boolean;
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
  } = props;

  const sharedDrawerProps = {
    ...props,
    prefixCls,
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
}

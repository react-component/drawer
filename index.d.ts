// Type definitions for rc-drawer 1.9
// Project: https://github.com/react-component/drawer
// Definitions by: jljsj33 <https://github.com/jljsj33>
// Definitions: https://github.com/react-component/drawer
import * as React from 'react';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type IPlacement = 'left' | 'top' | 'right' | 'bottom';

type ILevelMove = number | [number, number];

type IStringOrHtmlElement = string | HTMLElement;

export interface IProps<T> extends Omit<React.HTMLAttributes<T>, 'onChange'> {
  prefixCls?: string,
  wrapperClassName?: string,
  width?: string | number,
  height?: string | number,
  open?: boolean,
  defaultOpen?: boolean,
  handler?: boolean | React.ReactNode,
  placement?: IPlacement,
  level?: null | string | string[],
  levelMove?: ILevelMove | ((e: { target: HTMLElement, open: boolean }) => ILevelMove),
  duration?: string,
  ease?: string,
  getContainer?:  IStringOrHtmlElement | (() => IStringOrHtmlElement),
  showMask?: boolean,
  maskStyle?: React.CSSProperties,
  onChange?: ((open: boolean) => void),
  afterVisibleChange?: ((open: boolean) => void),
  onMaskClick?: ((e: MouseEvent | KeyboardEvent) => void),
  onHandleClick?: ((e: MouseEvent | KeyboardEvent) => void),
}

export default class ReDrawer<T> extends React.Component<IProps<T>> { }
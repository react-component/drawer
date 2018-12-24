import * as React from "react";

export interface Props {
  wrapperClassName: string,
  className: string,
  children: React.ReactChild,
  style: object,
  width: any,
  height: any,
  defaultOpen: boolean,
  firstEnter: boolean,
  open: boolean,
  prefixCls: string,
  placement: string,
  level: string | any[],
  levelMove: number | Function | any[],
  ease: string,
  duration: string,
  getContainer: string | Function | object | bool,
  handler: any,
  onChange: Function,
  onMaskClick: Function,
  onHandleClick: Function,
  showMask: boolean,
  maskStyle: object,
}

export default class Drawer extends React.Component<Props> {}

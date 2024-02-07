declare module 'rc-util/lib/KeyCode' {
  const Ret: { ESC: any; TAB: any };
  export default Ret;
}

declare module 'rc-util/lib/getScrollBarSize' {
  const Ret: (b: boolean) => number;
  export default Ret;
}

declare module 'rc-util/lib/*' {
  const Ret: any;
  export default Ret;
}

declare module 'raf';

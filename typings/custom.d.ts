declare module "rc-util/lib/KeyCode" {
  var Ret: { ESC: any; TAB: any; };
  export default Ret;
}

declare module 'rc-util/lib/getScrollBarSize' {
  var Ret: (b: boolean) => number;
  export default Ret;
}

declare module 'rc-util/lib/*' {
  var Ret: any;
  export default Ret;
}

declare module 'raf';


export function dataToArray(vars: any) {
  if (Array.isArray(vars)) {
    return vars;
  }
  return [vars];
}
const transitionEndObject: {
  [key: string]: string;
} = {
  transition: 'transitionend',
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'oTransitionEnd otransitionend',
};
export const transitionStr: string = Object.keys(transitionEndObject).filter(key => {
  if (typeof document === 'undefined') {
    return false;
  }
  const html = document.getElementsByTagName('html')[0];
  return key in (html ? html.style : {});
})[0];
export const transitionEnd: string = transitionEndObject[transitionStr];

export function addEventListener(
  target: HTMLElement,
  eventType: string,
  callback: (e: React.TouchEvent | TouchEvent | Event) => void,
  options?: any,
) {
  if (target.addEventListener) {
    target.addEventListener(eventType, callback, options);
  } else if ((target as any).attachEvent) {
    // tslint:disable-line
    (target as any).attachEvent(`on${eventType}`, callback); // tslint:disable-line
  }
}

export function removeEventListener(
  target: HTMLElement,
  eventType: string,
  callback: (e: React.TouchEvent | TouchEvent | Event) => void,
  options?: any,
) {
  if (target.removeEventListener) {
    target.removeEventListener(eventType, callback, options);
  } else if ((target as any).attachEvent) {
    // tslint:disable-line
    (target as any).detachEvent(`on${eventType}`, callback); // tslint:disable-line
  }
}

export function transformArguments(arg: any, cb: any) {
  const result = typeof arg === 'function' ? arg(cb) : arg;
  if (Array.isArray(result)) {
    if (result.length === 2) {
      return result;
    }
    return [result[0], result[1]];
  }
  return [result];
}

export const isNumeric = (value: string | number | undefined) => {
  return !isNaN(parseFloat(value as string)) && isFinite(value as number);
};

export const windowIsUndefined = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export const getTouchParentScroll = (
  root: HTMLElement,
  currentTarget: HTMLElement | Document | null,
  differX: number,
  differY: number,
): boolean => {
  if (!currentTarget || currentTarget === document || currentTarget instanceof Document) {
    return false;
  }
  // root 为 drawer-content 设定了 overflow, 判断为 root 的 parent 时结束滚动；
  if (currentTarget === root.parentNode) {
    return true;
  }

  const isY = Math.max(Math.abs(differX), Math.abs(differY)) === Math.abs(differY);
  const isX = Math.max(Math.abs(differX), Math.abs(differY)) === Math.abs(differX);

  const scrollY = currentTarget.scrollHeight - currentTarget.clientHeight;
  const scrollX = currentTarget.scrollWidth - currentTarget.clientWidth;
  /**
   * <div style="height: 300px">
   *   <div style="height: 900px"></div>
   * </div>
   * 在没设定 overflow: auto 或 scroll 时，currentTarget 里获取不到 scrollTop 或 scrollLeft,
   * 预先用 scrollTo 来滚动，如果取出的值跟滚动前取出不同，则 currnetTarget 被设定了 overflow; 否则就是上面这种。
   */
  const t = currentTarget.scrollTop;
  const l = currentTarget.scrollLeft;
  currentTarget.scrollTop += 1;
  currentTarget.scrollLeft += 1;
  const currentT = currentTarget.scrollTop;
  const currentL = currentTarget.scrollLeft;
  currentTarget.scrollTop -= 1;
  currentTarget.scrollLeft -= 1;
  if (
    (isY &&
      (!scrollY ||
        !(currentT - t) ||
        (scrollY &&
          ((currentTarget.scrollTop >= scrollY && differY < 0) ||
            (currentTarget.scrollTop <= 0 && differY > 0))))) ||
    (isX &&
      (!scrollX ||
        !(currentL - l) ||
        (scrollX &&
          ((currentTarget.scrollLeft >= scrollX && differX < 0) ||
            (currentTarget.scrollLeft <= 0 && differX > 0)))))
  ) {
    return getTouchParentScroll(root, currentTarget.parentNode as HTMLElement, differX, differY); // tslint:disable-line
  }
  return false;
};

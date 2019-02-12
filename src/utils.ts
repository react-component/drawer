export function dataToArray(vars: string[] | string): string[] {
  if (Array.isArray(vars)) {
    return vars;
  }
  return [vars];
}

const transitionEndObject = {
  transition: 'transitionend',
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'oTransitionEnd otransitionend',
};

export const transitionStr = Object.keys(transitionEndObject).filter(key => {
  if (typeof document === 'undefined') {
    return false;
  }
  const html = document.getElementsByTagName('html')[0];
  return key in (html ? html.style : {});
})[0];

export const transitionEnd = transitionEndObject[transitionStr];

export function addEventListener(
  target: EventTarget | null,
  eventType: string,
  callback: ((e: Event) => void) | any,
  options?: boolean | AddEventListenerOptions,
) {
  if (target && target.addEventListener) {
    target.addEventListener(eventType, callback, options);
    // oh, IE
  } else if ((target as any).attachEvent) {
    (target as any).attachEvent(`on${eventType}`, callback);
  }
}

export function removeEventListener(
  target: EventTarget | null,
  eventType: string,
  callback: ((e: Event) => void) | any,
  options?: boolean | AddEventListenerOptions,
) {
  if (target && target.removeEventListener) {
    target.removeEventListener(eventType, callback, options);
    // oh, IE
  } else if ((target as any).attachEvent) {
    (target as any).detachEvent(`on${eventType}`, callback);
  }
}

export function transformArguments(arg: any, cb: any) {
  let result = arg;
  if (typeof arg === 'function') {
    result = arg(cb);
  }
  if (Array.isArray(result)) {
    if (result.length === 2) {
      return result;
    }
    return [result[0], result[1]];
  }
  return [result];
}

export const isNumeric = (value: string | number) => {
  return !isNaN(parseFloat(value as string)) && isFinite(value as number);
};

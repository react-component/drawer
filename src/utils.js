export function dataToArray(vars) {
  if (Array.isArray(vars)) {
    return vars;
  }
  return [vars];
}
const trnasitionEndObject = {
  transition: 'transitionend',
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'oTransitionEnd otransitionend',
};
const trnasitionStr = Object.keys(trnasitionEndObject).filter(key => {
  if (typeof document === 'undefined') {
    return false;
  }
  return key in (document.body && document.body.style);
})[0];
export const transitionEnd = trnasitionEndObject[trnasitionStr];

export function addEventListener(target, eventType, callback, options) {
  if (target.addEventListener) {
    target.addEventListener(eventType, callback, options);
  } else if (target.attachEvent) {
    target.attachEvent(`on${eventType}`, callback);
  }
}

export function removeEventListener(target, eventType, callback, options) {
  if (target.removeEventListener) {
    target.removeEventListener(eventType, callback, options);
  } else if (target.attachEvent) {
    target.detachEvent(`on${eventType}`, callback);
  }
}
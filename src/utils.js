export function dataToArray(vars) {
  if (!vars && vars !== 0) {
    return [];
  }
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
const trnasitionStr = Object.keys(trnasitionEndObject).filter(key =>
  key in (document && document.body.style)
)[0];
export const transitionEnd = trnasitionEndObject[trnasitionStr];

const availablePrefixs = ['moz', 'ms', 'webkit'];

function requestAnimationFramePolyfill() {
  let lastTime = 0;
  return function (callback) {
    const currTime = new Date().getTime();
    const timeToCall = Math.max(0, 16 - (currTime - lastTime));
    const id = window.setTimeout(() => {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}

export function getRequestAnimationFrame() {
  if (typeof window === 'undefined') {
    return () => { };
  }
  if (window.requestAnimationFrame) {
    return window.requestAnimationFrame.bind(window);
  }
  const prefix = availablePrefixs.filter(key => `${key}RequestAnimationFrame` in window)[0];
  return prefix
    ? window[`${prefix}RequestAnimationFrame`]
    : requestAnimationFramePolyfill();
}

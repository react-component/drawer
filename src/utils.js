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
const trnasitionStr = Object.keys(trnasitionEndObject).filter(key => {
  if (typeof document === 'undefined') {
    return false;
  }
  return key in (document.body && document.body.style);
})[0];
export const transitionEnd = trnasitionEndObject[trnasitionStr];

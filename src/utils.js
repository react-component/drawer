export function 数据转换成数组(变量们) {
  if (Array.isArray(变量们)) {
    return 变量们;
  }
  return [变量们];
}
const 过渡动画结束对象 = {
  transition: 'transitionend',
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'oTransitionEnd otransitionend',
};
export const 过渡动画字符串 = Object.keys(过渡动画结束对象).filter(键 => {
  if (typeof document === 'undefined') {
    return false;
  }
  const 超文本标记语言 = document.getElementsByTagName('html')[0];
  return 键 in (超文本标记语言 ? 超文本标记语言.style : {});
})[0];
export const 过渡动画结束 = 过渡动画结束对象[过渡动画字符串];

export function 添加事件监听者(目标, 事件类型, 回调, 配置) {
  if (目标.addEventListener) {
    目标.addEventListener(事件类型, 回调, 配置);
  } else if (目标.attachEvent) {
    目标.attachEvent(`on${事件类型}`, 回调);
  }
}

export function 移除事件监听者(目标, 事件类型, 回调, 配置) {
  if (目标.removeEventListener) {
    目标.removeEventListener(事件类型, 回调, 配置);
  } else if (目标.attachEvent) {
    目标.detachEvent(`on${事件类型}`, 回调);
  }
}

export function 变换参数(参数, 回调) {
  let 结果;
  if (typeof 参数 === 'function') {
    结果 = 参数(回调);
  } else {
    结果 = 参数;
  }
  if (Array.isArray(结果)) {
    if (结果.length === 2) {
      return 结果;
    }
    return [结果[0], 结果[1]];
  }
  return [结果];
}

export const 是数字吗 = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);// eslint-disable-line
};
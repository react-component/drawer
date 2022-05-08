/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import getScrollBarSize from 'rc-util/lib/getScrollBarSize';
import KeyCode from 'rc-util/lib/KeyCode';
import omit from 'rc-util/lib/omit';

import type { IDrawerChildProps } from './IDrawerPropTypes';

import {
  addEventListener,
  dataToArray,
  getParent,
  getTouchParentScroll,
  isNumeric,
  removeEventListener,
  transformArguments,
  transitionEnd,
  transitionStr,
  windowIsUndefined,
} from './utils';

const currentDrawer: Record<string, boolean> = {};

// interface IState {
//   _self: DrawerChild;
//   prevProps?: IDrawerChildProps;
// }

interface Point {
  x: number;
  y: number;
}

const DrawerChild = (props: IDrawerChildProps) => {
  const {
    className,
    children,
    style,
    width,
    height,
    defaultOpen,
    open,
    prefixCls,
    placement,
    level,
    levelMove,
    ease,
    duration,
    getContainer,
    handler,
    onChange,
    afterVisibleChange,
    showMask,
    maskClosable,
    maskStyle,
    onClose,
    onHandleClick,
    keyboard,
    getOpenCount,
    scrollLocker,
    contentWrapperStyle,
    ...rest
  } = props;
  const { autoFocus } = props;
  // public static getDerivedStateFromProps(
  //   props: IDrawerChildProps,
  //   { prevProps, _self }: { prevProps: IDrawerChildProps; _self: DrawerChild },
  // ) {
  //   const nextState = {
  //     prevProps: props,
  //   };
  //   if (prevProps !== undefined) {
  //     const { placement, level } = props;
  //     if (placement !== prevProps.placement) {
  //       // test 的 bug, 有动画过场，删除 dom
  //       _self.contentDom = null;
  //     }
  //     if (level !== prevProps.level) {
  //       _self.getLevelDom(props);
  //     }
  //   }
  //   return nextState;
  // }

  // constructor(props: IDrawerChildProps) {
  //   super(props);
  //   this.state = {
  //     _self: this,
  //   };
  // }
  const passive = useRef<{ passive: boolean } | boolean>();
  const levelDom = useRef<HTMLElement[]>();
  const dom = useRef<HTMLDivElement>(null);
  const contentWrapper = useRef<HTMLDivElement>(null);
  const contentDom = useRef<HTMLDivElement>(null);
  const maskDom = useRef<HTMLDivElement>(null);
  const handlerDom = useRef<HTMLDivElement>(null);
  const drawerId = useRef<string>();
  const startPos = useRef<Point>(null);

  useEffect(() => {
    if (!windowIsUndefined) {
      let passiveSupported = false;
      try {
        window.addEventListener(
          'test',
          null,
          Object.defineProperty({}, 'passive', {
            get: () => {
              passiveSupported = true;
              return null;
            },
          }),
        );
      } catch (err) {}
      passive.current = passiveSupported ? { passive: false } : false;
    }
    // const { open, getContainer, showMask, autoFocus } = this.props;
    const container = getParent(getContainer);
    drawerId.current = `drawer_id_${Number(
      (Date.now() + Math.random())
        .toString()
        .replace('.', Math.round(Math.random() * 9).toString()),
    ).toString(16)}`;
    getLevelDom(props);
    if (open) {
      if (container && container.parentNode === document.body) {
        currentDrawer[drawerId.current] = open;
      }
      // 默认打开状态时推出 level;
      openLevelTransition();
      if (autoFocus) {
        domFocus();
      }
      if (showMask) {
        scrollLocker?.lock();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const container = getParent(getContainer);
    if (container && container.parentNode === document.body) {
      currentDrawer[drawerId.current] = !!open;
    }
    openLevelTransition();
    if (open) {
      if (autoFocus) {
        domFocus();
      }
      if (showMask) {
        scrollLocker?.lock();
      }
    } else {
      scrollLocker?.unLock();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    return () => {
      delete currentDrawer[drawerId.current];
      if (open) {
        setLevelTransform(false);
        document.body.style.touchAction = '';
      }
      scrollLocker?.unLock();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const forceUpdate = useState({})[1];

  const domFocus = () => {
    if (dom.current) {
      dom.current.focus();
      forceUpdate({});
    }
  };

  const removeStartHandler = (e: React.TouchEvent | TouchEvent) => {
    if (e.touches.length > 1) {
      // need clear the startPos when another touch event happens
      startPos.current = null;
      return;
    }
    startPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const removeMoveHandler = (e: React.TouchEvent | TouchEvent) => {
    // the startPos may be null or undefined
    if (e.changedTouches.length > 1 || !startPos.current) {
      return;
    }
    const currentTarget = e.currentTarget as HTMLElement;
    const differX = e.changedTouches[0].clientX - startPos.current.x;
    const differY = e.changedTouches[0].clientY - startPos.current.y;
    if (
      (currentTarget === maskDom.current ||
        currentTarget === handlerDom.current ||
        (currentTarget === contentDom.current &&
          getTouchParentScroll(
            currentTarget,
            e.target as HTMLElement,
            differX,
            differY,
          ))) &&
      e.cancelable
    ) {
      e.preventDefault();
    }
  };

  const handleTransitionEnd = (e: TransitionEvent) => {
    const dom: HTMLElement = e.target as HTMLElement;
    removeEventListener(dom, transitionEnd, handleTransitionEnd);
    dom.style.transition = '';
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === KeyCode.ESC) {
      e.stopPropagation();
      if (onClose) {
        onClose(e as any);
      }
    }
  };

  const onWrapperTransitionEnd = (e: React.TransitionEvent) => {
    // const { open, afterVisibleChange } = this.props;
    if (
      e.target === contentWrapper.current &&
      e.propertyName.match(/transform$/)
    ) {
      dom.current.style.transition = '';
      if (!open && getCurrentDrawerSome()) {
        document.body.style.overflowX = '';
        if (maskDom.current) {
          maskDom.current.style.left = '';
          maskDom.current.style.width = '';
        }
      }
      if (afterVisibleChange) {
        afterVisibleChange(!!open);
      }
    }
  };

  const openLevelTransition = () => {
    // const { open, width, height } = this.props;
    const { isHorizontal, placementName } = getHorizontalBoolAndPlacementName();
    const contentValue = contentDom.current
      ? contentDom.current.getBoundingClientRect()[
          isHorizontal ? 'width' : 'height'
        ]
      : 0;
    const value = (isHorizontal ? width : height) || contentValue;
    setLevelAndScrolling(open, placementName, value);
  };

  const setLevelTransform = (
    open?: boolean,
    placementName?: string,
    value?: string | number,
    right?: number,
  ) => {
    // const { placement, levelMove, duration, ease, showMask } = this.props;
    // router 切换时可能会导至页面失去滚动条，所以需要时时获取。
    levelDom.current?.forEach(dom => {
      dom.style.transition = `transform ${duration} ${ease}`;
      addEventListener(dom, transitionEnd, handleTransitionEnd);
      let levelValue = open ? value : 0;
      if (levelMove) {
        const $levelMove = transformArguments(levelMove, { target: dom, open });
        levelValue = open ? $levelMove[0] : $levelMove[1] || 0;
      }
      const $value =
        typeof levelValue === 'number' ? `${levelValue}px` : levelValue;
      let placementPos =
        placement === 'left' || placement === 'top' ? $value : `-${$value}`;
      placementPos =
        showMask && placement === 'right' && right
          ? `calc(${placementPos} + ${right}px)`
          : placementPos;
      dom.style.transform = levelValue
        ? `${placementName}(${placementPos})`
        : '';
    });
  };

  const setLevelAndScrolling = (
    open?: boolean,
    placementName?: string,
    value?: string | number,
  ) => {
    // const { onChange } = this.props;
    if (!windowIsUndefined) {
      const right =
        document.body.scrollHeight >
          (window.innerHeight || document.documentElement.clientHeight) &&
        window.innerWidth > document.body.offsetWidth
          ? getScrollBarSize(true)
          : 0;
      setLevelTransform(open, placementName, value, right);
      toggleScrollingToDrawerAndBody(right);
    }
    if (onChange) {
      onChange(open);
    }
  };

  const toggleScrollingToDrawerAndBody = (right: number) => {
    // const { getContainer, showMask, open } = this.props;
    const container = getParent(getContainer);
    // 处理 body 滚动
    if (container && container.parentNode === document.body && showMask) {
      const eventArray = ['touchstart'];
      const domArray = [
        document.body,
        maskDom.current,
        handlerDom.current,
        contentDom.current,
      ];
      if (open && document.body.style.overflow !== 'hidden') {
        if (right) {
          addScrollingEffect(right);
        }
        document.body.style.touchAction = 'none';
        // 手机禁滚
        domArray.forEach((item, i) => {
          if (!item) {
            return;
          }
          addEventListener(
            item,
            eventArray[i] || 'touchmove',
            i ? removeMoveHandler : removeStartHandler,
            passive.current,
          );
        });
      } else if (getCurrentDrawerSome()) {
        document.body.style.touchAction = '';
        if (right) {
          remScrollingEffect(right);
        }
        // 恢复事件
        domArray.forEach((item, i) => {
          if (!item) {
            return;
          }
          removeEventListener(
            item,
            eventArray[i] || 'touchmove',
            i ? removeMoveHandler : removeStartHandler,
            passive.current,
          );
        });
      }
    }
  };

  const addScrollingEffect = (right: number) => {
    // const { placement, duration, ease } = this.props;
    const widthTransition = `width ${duration} ${ease}`;
    const transformTransition = `transform ${duration} ${ease}`;
    dom.current.style.transition = 'none';
    switch (placement) {
      case 'right':
        dom.current.style.transform = `translateX(-${right}px)`;
        break;
      case 'top':
      case 'bottom':
        dom.current.style.width = `calc(100% - ${right}px)`;
        dom.current.style.transform = 'translateZ(0)';
        break;
      default:
        break;
    }
    setTimeout(() => {
      if (dom.current) {
        dom.current.style.transition = `${transformTransition},${widthTransition}`;
        dom.current.style.width = '';
        dom.current.style.transform = '';
      }
    });
  };

  const remScrollingEffect = (right: number) => {
    // const { placement, duration, ease } = this.props;

    if (transitionStr) {
      document.body.style.overflowX = 'hidden';
    }
    dom.current.style.transition = 'none';
    let heightTransition: string;
    let widthTransition = `width ${duration} ${ease}`;
    const transformTransition = `transform ${duration} ${ease}`;
    switch (placement) {
      case 'left': {
        dom.current.style.width = '100%';
        widthTransition = `width 0s ${ease} ${duration}`;
        break;
      }
      case 'right': {
        dom.current.style.transform = `translateX(${right}px)`;
        dom.current.style.width = '100%';
        widthTransition = `width 0s ${ease} ${duration}`;
        if (maskDom.current) {
          maskDom.current.style.left = `-${right}px`;
          maskDom.current.style.width = `calc(100% + ${right}px)`;
        }
        break;
      }
      case 'top':
      case 'bottom': {
        dom.current.style.width = `calc(100% + ${right}px)`;
        dom.current.style.height = '100%';
        dom.current.style.transform = 'translateZ(0)';
        heightTransition = `height 0s ${ease} ${duration}`;
        break;
      }
      default:
        break;
    }
    setTimeout(() => {
      if (dom.current) {
        dom.current.style.transition = `${transformTransition},${
          heightTransition ? `${heightTransition},` : ''
        }${widthTransition}`;
        dom.current.style.transform = '';
        dom.current.style.width = '';
        dom.current.style.height = '';
      }
    });
  };

  const getCurrentDrawerSome = () =>
    !Object.keys(currentDrawer).some(key => currentDrawer[key]);

  const getLevelDom = ({ level, getContainer }: IDrawerChildProps) => {
    if (windowIsUndefined) {
      return;
    }
    const container = getParent(getContainer);
    const parent = container ? (container.parentNode as HTMLElement) : null;
    levelDom.current = [];
    if (level === 'all') {
      const children: HTMLElement[] = parent
        ? Array.prototype.slice.call(parent.children)
        : [];
      children.forEach((child: HTMLElement) => {
        if (
          child.nodeName !== 'SCRIPT' &&
          child.nodeName !== 'STYLE' &&
          child.nodeName !== 'LINK' &&
          child !== container
        ) {
          levelDom.current.push(child);
        }
      });
    } else if (level) {
      dataToArray(level).forEach(key => {
        document.querySelectorAll(key).forEach(item => {
          levelDom.current.push(item);
        });
      });
    }
  };

  const getHorizontalBoolAndPlacementName = () => {
    const isHorizontal = placement === 'left' || placement === 'right';
    const placementName = `translate${isHorizontal ? 'X' : 'Y'}`;
    return {
      isHorizontal,
      placementName,
    };
  };

  // tslint:disable-next-line:member-ordering

  // 首次渲染都将是关闭状态。
  const _open = dom.current ? open : false;
  const wrapperClassName = classnames(prefixCls, {
    [`${prefixCls}-${placement}`]: true,
    [`${prefixCls}-open`]: _open,
    [className || '']: !!className,
    'no-mask': !showMask,
  });

  const { placementName } = getHorizontalBoolAndPlacementName();
  // 百分比与像素动画不同步，第一次打用后全用像素动画。
  // const defaultValue = !contentDom.current || !level ? '100%' : `${value}px`;
  const placementPos =
    placement === 'left' || placement === 'top' ? '-100%' : '100%';
  const transform = _open ? '' : `${placementName}(${placementPos})`;

  const handlerChildren =
    handler &&
    React.cloneElement(handler, {
      onClick: (e: React.MouseEvent) => {
        if (handler.props.onClick) {
          handler.props.onClick();
        }
        if (onHandleClick) {
          onHandleClick(e);
        }
      },
      ref: c => {
        handlerDom.current = c;
      },
    });
  return (
    <div
      {...omit(rest, ['switchScrollingEffect', 'autoFocus'])}
      tabIndex={-1}
      className={wrapperClassName}
      style={style}
      ref={dom}
      onKeyDown={_open && keyboard ? onKeyDown : undefined}
      onTransitionEnd={onWrapperTransitionEnd}
    >
      {showMask && (
        <div
          className={`${prefixCls}-mask`}
          onClick={maskClosable ? onClose : undefined}
          style={maskStyle}
          ref={maskDom}
        />
      )}
      <div
        className={`${prefixCls}-content-wrapper`}
        style={{
          transform,
          msTransform: transform,
          width: isNumeric(width) ? `${width}px` : width,
          height: isNumeric(height) ? `${height}px` : height,
          ...contentWrapperStyle,
        }}
        ref={contentWrapper}
      >
        <div className={`${prefixCls}-content`} ref={contentDom}>
          {children}
        </div>
        {handlerChildren}
      </div>
    </div>
  );
};

export default DrawerChild;

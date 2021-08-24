import * as React from 'react';
import classnames from 'classnames';
import getScrollBarSize from 'rc-util/lib/getScrollBarSize';
import KeyCode from 'rc-util/lib/KeyCode';
import omit from 'rc-util/lib/omit';

import type { IDrawerChildProps } from './IDrawerPropTypes';

import {
  addEventListener,
  dataToArray,
  getTouchParentScroll,
  isNumeric,
  removeEventListener,
  transformArguments,
  transitionEnd,
  transitionStr,
  windowIsUndefined,
} from './utils';

const currentDrawer: Record<string, boolean> = {};

interface IState {
  _self: DrawerChild;
  prevProps?: IDrawerChildProps;
}

class DrawerChild extends React.Component<IDrawerChildProps, IState> {
  public static getDerivedStateFromProps(
    props: IDrawerChildProps,
    { prevProps, _self }: { prevProps: IDrawerChildProps; _self: DrawerChild },
  ) {
    const nextState = {
      prevProps: props,
    };
    if (prevProps !== undefined) {
      const { placement, level } = props;
      if (placement !== prevProps.placement) {
        // test 的 bug, 有动画过场，删除 dom
        _self.contentDom = null;
      }
      if (level !== prevProps.level) {
        _self.getLevelDom(props);
      }
    }
    return nextState;
  }

  private levelDom: HTMLElement[];

  private dom: HTMLElement;

  private contentWrapper: HTMLElement;

  private contentDom: HTMLElement | null;

  private maskDom: HTMLElement;

  private handlerDom: HTMLElement;

  private drawerId: string;

  private timeout: any;

  private passive: { passive: boolean } | boolean;

  private startPos: {
    x: number;
    y: number;
  };

  constructor(props: IDrawerChildProps) {
    super(props);
    this.state = {
      _self: this,
    };
  }

  public componentDidMount() {
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
      this.passive = passiveSupported ? { passive: false } : false;
    }
    const { open, getContainer, showMask, autoFocus } = this.props;
    const container = getContainer && getContainer();
    this.drawerId = `drawer_id_${Number(
      (Date.now() + Math.random())
        .toString()
        .replace('.', Math.round(Math.random() * 9).toString()),
    ).toString(16)}`;
    this.getLevelDom(this.props);
    if (open) {
      if (container && container.parentNode === document.body) {
        currentDrawer[this.drawerId] = open;
      }
      // 默认打开状态时推出 level;
      this.openLevelTransition();
      this.forceUpdate(() => {
        if (autoFocus) {
          this.domFocus();
        }
      });
      if (showMask) {
        this.props.scrollLocker?.lock();
      }
    }
  }

  public componentDidUpdate(prevProps: IDrawerChildProps) {
    const {
      open,
      getContainer,
      scrollLocker,
      showMask,
      autoFocus,
    } = this.props;
    const container = getContainer && getContainer();
    if (open !== prevProps.open) {
      if (container && container.parentNode === document.body) {
        currentDrawer[this.drawerId] = !!open;
      }
      this.openLevelTransition();
      if (open) {
        if (autoFocus) {
          this.domFocus();
        }
        if (showMask) {
          scrollLocker?.lock();
        }
      } else {
        scrollLocker?.unLock();
      }
    }
  }

  public componentWillUnmount() {
    const { open, scrollLocker } = this.props;
    delete currentDrawer[this.drawerId];
    if (open) {
      this.setLevelTransform(false);
      document.body.style.touchAction = '';
    }
    scrollLocker?.unLock();
  }

  private domFocus = () => {
    if (this.dom) {
      this.dom.focus();
    }
  };

  private removeStartHandler = (e: React.TouchEvent | TouchEvent) => {
    if (e.touches.length > 1) {
      return;
    }
    this.startPos = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  private removeMoveHandler = (e: React.TouchEvent | TouchEvent) => {
    if (e.changedTouches.length > 1) {
      return;
    }
    const currentTarget = e.currentTarget as HTMLElement;
    const differX = e.changedTouches[0].clientX - this.startPos.x;
    const differY = e.changedTouches[0].clientY - this.startPos.y;
    if (
      (currentTarget === this.maskDom ||
        currentTarget === this.handlerDom ||
        (currentTarget === this.contentDom &&
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

  private transitionEnd = (e: TransitionEvent) => {
    const dom: HTMLElement = e.target as HTMLElement;
    removeEventListener(dom, transitionEnd, this.transitionEnd);
    dom.style.transition = '';
  };

  private onKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === KeyCode.ESC) {
      const { onClose } = this.props;
      e.stopPropagation();
      if (onClose) {
        onClose(e as any);
      }
    }
  };

  private onWrapperTransitionEnd = (e: React.TransitionEvent) => {
    const { open, afterVisibleChange } = this.props;
    if (
      e.target === this.contentWrapper &&
      e.propertyName.match(/transform$/)
    ) {
      this.dom.style.transition = '';
      if (!open && this.getCurrentDrawerSome()) {
        document.body.style.overflowX = '';
        if (this.maskDom) {
          this.maskDom.style.left = '';
          this.maskDom.style.width = '';
        }
      }
      if (afterVisibleChange) {
        afterVisibleChange(!!open);
      }
    }
  };

  private openLevelTransition = () => {
    const { open, width, height } = this.props;
    const {
      isHorizontal,
      placementName,
    } = this.getHorizontalBoolAndPlacementName();
    const contentValue = this.contentDom
      ? this.contentDom.getBoundingClientRect()[
          isHorizontal ? 'width' : 'height'
        ]
      : 0;
    const value = (isHorizontal ? width : height) || contentValue;
    this.setLevelAndScrolling(open, placementName, value);
  };

  private setLevelTransform = (
    open?: boolean,
    placementName?: string,
    value?: string | number,
    right?: number,
  ) => {
    const { placement, levelMove, duration, ease, showMask } = this.props;
    // router 切换时可能会导至页面失去滚动条，所以需要时时获取。
    this.levelDom.forEach(dom => {
      dom.style.transition = `transform ${duration} ${ease}`;
      addEventListener(dom, transitionEnd, this.transitionEnd);
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

  private setLevelAndScrolling = (
    open?: boolean,
    placementName?: string,
    value?: string | number,
  ) => {
    const { onChange } = this.props;
    if (!windowIsUndefined) {
      const right =
        document.body.scrollHeight >
          (window.innerHeight || document.documentElement.clientHeight) &&
        window.innerWidth > document.body.offsetWidth
          ? getScrollBarSize(true)
          : 0;
      this.setLevelTransform(open, placementName, value, right);
      this.toggleScrollingToDrawerAndBody(right);
    }
    if (onChange) {
      onChange(open);
    }
  };

  private toggleScrollingToDrawerAndBody = (right: number) => {
    const { getContainer, showMask, open } = this.props;
    const container = getContainer && getContainer();
    // 处理 body 滚动
    if (container && container.parentNode === document.body && showMask) {
      const eventArray = ['touchstart'];
      const domArray = [
        document.body,
        this.maskDom,
        this.handlerDom,
        this.contentDom,
      ];
      if (open && document.body.style.overflow !== 'hidden') {
        if (right) {
          this.addScrollingEffect(right);
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
            i ? this.removeMoveHandler : this.removeStartHandler,
            this.passive,
          );
        });
      } else if (this.getCurrentDrawerSome()) {
        document.body.style.touchAction = '';
        if (right) {
          this.remScrollingEffect(right);
        }
        // 恢复事件
        domArray.forEach((item, i) => {
          if (!item) {
            return;
          }
          removeEventListener(
            item,
            eventArray[i] || 'touchmove',
            i ? this.removeMoveHandler : this.removeStartHandler,
            this.passive,
          );
        });
      }
    }
  };

  private addScrollingEffect = (right: number) => {
    const { placement, duration, ease } = this.props;
    const widthTransition = `width ${duration} ${ease}`;
    const transformTransition = `transform ${duration} ${ease}`;
    this.dom.style.transition = 'none';
    switch (placement) {
      case 'right':
        this.dom.style.transform = `translateX(-${right}px)`;
        break;
      case 'top':
      case 'bottom':
        this.dom.style.width = `calc(100% - ${right}px)`;
        this.dom.style.transform = 'translateZ(0)';
        break;
      default:
        break;
    }
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (this.dom) {
        this.dom.style.transition = `${transformTransition},${widthTransition}`;
        this.dom.style.width = '';
        this.dom.style.transform = '';
      }
    });
  };

  private remScrollingEffect = (right: number) => {
    const { placement, duration, ease } = this.props;

    if (transitionStr) {
      document.body.style.overflowX = 'hidden';
    }
    this.dom.style.transition = 'none';
    let heightTransition: string;
    let widthTransition = `width ${duration} ${ease}`;
    const transformTransition = `transform ${duration} ${ease}`;
    switch (placement) {
      case 'left': {
        this.dom.style.width = '100%';
        widthTransition = `width 0s ${ease} ${duration}`;
        break;
      }
      case 'right': {
        this.dom.style.transform = `translateX(${right}px)`;
        this.dom.style.width = '100%';
        widthTransition = `width 0s ${ease} ${duration}`;
        if (this.maskDom) {
          this.maskDom.style.left = `-${right}px`;
          this.maskDom.style.width = `calc(100% + ${right}px)`;
        }
        break;
      }
      case 'top':
      case 'bottom': {
        this.dom.style.width = `calc(100% + ${right}px)`;
        this.dom.style.height = '100%';
        this.dom.style.transform = 'translateZ(0)';
        heightTransition = `height 0s ${ease} ${duration}`;
        break;
      }
      default:
        break;
    }
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (this.dom) {
        this.dom.style.transition = `${transformTransition},${
          heightTransition ? `${heightTransition},` : ''
        }${widthTransition}`;
        this.dom.style.transform = '';
        this.dom.style.width = '';
        this.dom.style.height = '';
      }
    });
  };

  private getCurrentDrawerSome = () =>
    !Object.keys(currentDrawer).some(key => currentDrawer[key]);

  private getLevelDom = ({ level, getContainer }: IDrawerChildProps) => {
    if (windowIsUndefined) {
      return;
    }
    const container = getContainer && getContainer();
    const parent = container ? (container.parentNode as HTMLElement) : null;
    this.levelDom = [];
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
          this.levelDom.push(child);
        }
      });
    } else if (level) {
      dataToArray(level).forEach(key => {
        document.querySelectorAll(key).forEach(item => {
          this.levelDom.push(item);
        });
      });
    }
  };

  private getHorizontalBoolAndPlacementName = () => {
    const { placement } = this.props;
    const isHorizontal = placement === 'left' || placement === 'right';
    const placementName = `translate${isHorizontal ? 'X' : 'Y'}`;
    return {
      isHorizontal,
      placementName,
    };
  };

  // tslint:disable-next-line:member-ordering
  public render() {
    const {
      className,
      children,
      style,
      width,
      height,
      defaultOpen,
      open: $open,
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
      ...props
    } = this.props;
    // 首次渲染都将是关闭状态。
    const open = this.dom ? $open : false;
    const wrapperClassName = classnames(prefixCls, {
      [`${prefixCls}-${placement}`]: true,
      [`${prefixCls}-open`]: open,
      [className || '']: !!className,
      'no-mask': !showMask,
    });

    const { placementName } = this.getHorizontalBoolAndPlacementName();
    // 百分比与像素动画不同步，第一次打用后全用像素动画。
    // const defaultValue = !this.contentDom || !level ? '100%' : `${value}px`;
    const placementPos =
      placement === 'left' || placement === 'top' ? '-100%' : '100%';
    const transform = open ? '' : `${placementName}(${placementPos})`;

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
        ref: (c: HTMLElement) => {
          this.handlerDom = c;
        },
      });
    return (
      <div
        {...omit(props, ['switchScrollingEffect'])}
        tabIndex={-1}
        className={wrapperClassName}
        style={style}
        ref={(c: HTMLElement | null) => {
          this.dom = c as HTMLElement;
        }}
        onKeyDown={open && keyboard ? this.onKeyDown : undefined}
        onTransitionEnd={this.onWrapperTransitionEnd}
      >
        {showMask && (
          <div
            className={`${prefixCls}-mask`}
            onClick={maskClosable ? onClose : undefined}
            style={maskStyle}
            ref={c => {
              this.maskDom = c as HTMLElement;
            }}
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
          ref={c => {
            this.contentWrapper = c as HTMLElement;
          }}
        >
          <div
            className={`${prefixCls}-content`}
            ref={c => {
              this.contentDom = c as HTMLElement;
            }}            
          >
            {children}
          </div>
          {handlerChildren}
        </div>
      </div>
    );
  }
}

export default DrawerChild;

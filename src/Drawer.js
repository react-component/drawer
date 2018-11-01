import 瑞哎科特 from 'react';
import 瑞哎科特文档对象模型 from 'react-dom';
import 属性类型检查者 from 'prop-types';
import 类名合并者 from 'classnames';
import 容器渲染者 from 'rc-util/lib/ContainerRender';
import 获取滚动条大小 from 'rc-util/lib/getScrollBarSize';
import {
  数据转换成数组,
  过渡动画结束,
  过渡动画字符串,
  添加事件监听者,
  移除事件监听者,
  变换参数,
  是数字吗,
} from './utils';

const 是瑞哎科特16 = 'createPortal' in 瑞哎科特文档对象模型;

const 当前抽屉 = {};
const windowIsUndefined = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

class 抽屉 extends 瑞哎科特.PureComponent {
  static defaultProps = {
    prefixCls: 'drawer',
    placement: 'left',
    getContainer: 'body',
    level: 'all',
    duration: '.3s',
    ease: 'cubic-bezier(0.78, 0.14, 0.15, 0.86)',
    onChange: () => { },
    onMaskClick: () => { },
    onHandleClick: () => { },
    handler: (
      <div className="drawer-handle">
        <i className="drawer-handle-icon" />
      </div>
    ),
    firstEnter: false,
    showMask: true,
    maskStyle: {},
    wrapperClassName: '',
    className: '',
  };

  constructor(props) {
    super(props);
    this.层级文档对象模型 = [];
    this.内容文档对象模型 = null;
    this.遮罩文档对象模型 = null;
    this.handlerdom = null;
    this.第一次进入 = props.firstEnter;// 记录首次进入.
    this.定时器编号 = null;
    this.抽屉编号 = Number((Date.now() + Math.random()).toString()
      .replace('.', Math.round(Math.random() * 9))).toString(16);
    const open = props.open !== undefined ? props.open : !!props.defaultOpen;
    当前抽屉[this.抽屉编号] = open;
    this.state = {
      open,
    };
  }
  componentDidMount() {
    if (!windowIsUndefined) {
      let passiveSupported = false;
      window.addEventListener(
        'test',
        null,
        Object.defineProperty({}, 'passive', {
          get: () => {
            passiveSupported = true;
            return null;
          },
        })
      );
      this.passive = passiveSupported ? { passive: false } : false;
    }
    const open = this.getOpen();
    if (this.props.handler || open || this.第一次进入) {
      this.getDefault(this.props);
      if (open) {
        this.isOpenChange = true;
      }
      this.forceUpdate();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { open, placement } = nextProps;
    if (open !== undefined && open !== this.props.open) {
      this.isOpenChange = true;
      // 没渲染 dom 时，获取默认数据;
      if (!this.container) {
        this.getDefault(nextProps);
      }
      this.setState({
        open,
      });
    }
    if (placement !== this.props.placement) {
      // test 的 bug, 有动画过场，删除 dom
      this.内容文档对象模型 = null;
    }
    if (this.props.level !== nextProps.level) {
      this.getParentAndLevelDom(nextProps);
    }
  }

  componentDidUpdate() {
    // dom 没渲染时，重走一遍。
    if (!this.第一次进入 && this.container) {
      this.forceUpdate();
      this.第一次进入 = true;
    }
  }

  componentWillUnmount() {
    delete 当前抽屉[this.抽屉编号];
    delete this.isOpenChange;
    if (this.container) {
      if (this.state.open) {
        this.setLevelDomTransform(false, true);
      }
      document.body.style.overflow = '';
      // 拦不住。。直接删除；
      if (this.props.getContainer) {
        this.container.parentNode.removeChild(this.container);
      }
    }
    this.第一次进入 = false;
    clearTimeout(this.定时器编号);
    // suppport react15
    // 需要 didmount 后也会渲染，直接 unmount 将不会渲染，加上判断.
    if (this.组件渲染者 && !是瑞哎科特16) {
      this.组件渲染者({
        afterClose: this.移除容器,
        onClose() { },
        visible: false,
      });
    }
  }

  当触摸遮罩层结束 = e => {
    this.props.onMaskClick(e);
    this.onTouchEnd(e, true);
  };

  onIconTouchEnd = e => {
    this.props.onHandleClick(e);
    this.onTouchEnd(e);
  };
  onTouchEnd = (e, close) => {
    if (this.props.open !== undefined) {
      return;
    }
    const open = close || this.state.open;
    this.isOpenChange = true;
    this.setState({
      open: !open,
    });
  };

  当包裹动画结束 = (e) => {
    if (e.target === this.contentWrapper) {
      this.文档对象模型.style.transition = '';
      if (!this.state.open && this.getCrrentDrawerSome()) {
        document.body.style.overflowX = '';
        if (this.遮罩文档对象模型) {
          this.遮罩文档对象模型.style.left = '';
          this.遮罩文档对象模型.style.width = '';
        }
      }
    }
  }

  getDefault = props => {
    this.getParentAndLevelDom(props);
    if (props.getContainer || props.parent) {
      this.container = this.defaultGetContainer();
    }
  };

  getCrrentDrawerSome = () => !Object.keys(当前抽屉).some(key => 当前抽屉[key]);

  getContainer = () => {
    return this.container;
  };
  getParentAndLevelDom = props => {
    if (windowIsUndefined) {
      return;
    }
    const { level, getContainer } = props;
    this.层级文档对象模型 = [];
    if (getContainer) {
      if (typeof getContainer === 'string') {
        const dom = document.querySelectorAll(getContainer)[0];
        this.祖先 = dom;
      }
      if (typeof getContainer === 'function') {
        this.祖先 = getContainer();
      }
      if (typeof getContainer === 'object' && getContainer instanceof window.HTMLElement) {
        this.祖先 = getContainer;
      }
    }
    if (!getContainer && this.container) {
      this.祖先 = this.container.parentNode;
    }
    if (level === 'all') {
      const children = Array.prototype.slice.call(this.祖先.children);
      children.forEach(child => {
        if (child.nodeName !== 'SCRIPT' && child.nodeName !== 'STYLE'
          && child.nodeName !== 'LINK' && child !== this.container) {
          this.层级文档对象模型.push(child);
        }
      });
    } else if (level) {
      数据转换成数组(level).forEach(key => {
        document.querySelectorAll(key).forEach(item => {
          this.层级文档对象模型.push(item);
        });
      });
    }
  };

  setLevelDomTransform = (打开的, openTransition, placementName, value) => {
    const { placement, levelMove, duration, ease, onChange, getContainer } = this.props;
    if (!windowIsUndefined) {
      this.层级文档对象模型.forEach(文档对象模型 => {
        if (this.isOpenChange || openTransition) {
          /* eslint no-param-reassign: "error" */
          文档对象模型.style.transition = `transform ${duration} ${ease}`;
          添加事件监听者(文档对象模型, 过渡动画结束, this.trnasitionEnd);
          let levelValue = 打开的 ? value : 0;
          if (levelMove) {
            const $levelMove = 变换参数(levelMove, { target: 文档对象模型, 打开的 });
            levelValue = 打开的 ? $levelMove[0] : $levelMove[1] || 0;
          }
          const $value = typeof levelValue === 'number' ? `${levelValue}px` : levelValue;
          const placementPos = placement === 'left' || placement === 'top' ? $value : `-${$value}`;
          文档对象模型.style.transform = levelValue ? `${placementName}(${placementPos})` : '';
          文档对象模型.style.msTransform = levelValue ? `${placementName}(${placementPos})` : '';
        }
      });
      // 处理 body 滚动
      if (getContainer === 'body') {
        const eventArray = ['touchstart'];
        const domArray = [document.body, this.遮罩文档对象模型, this.handlerdom, this.内容文档对象模型];
        const right = document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight) &&
          window.innerWidth > document.body.offsetWidth
          ? 获取滚动条大小(1) : 0;
        let widthTransition = `width ${duration} ${ease}`;
        const trannsformTransition = `transform ${duration} ${ease}`;
        if (打开的 && document.body.style.overflow !== 'hidden') {
          document.body.style.overflow = 'hidden';
          if (right) {
            document.body.style.position = 'relative';
            document.body.style.width = `calc(100% - ${right}px)`;
            this.文档对象模型.style.transition = 'none';
            switch (placement) {
              case 'right':
                this.文档对象模型.style.transform = `translateX(-${right}px)`;
                this.文档对象模型.style.msTransform = `translateX(-${right}px)`;
                break;
              case 'top':
              case 'bottom':
                this.文档对象模型.style.width = `calc(100% - ${right}px)`;
                this.文档对象模型.style.transform = 'translateZ(0)';
                break;
              default:
                break;
            }
            clearTimeout(this.定时器编号);
            this.定时器编号 = setTimeout(() => {
              this.文档对象模型.style.transition = `${trannsformTransition},${widthTransition}`;
              this.文档对象模型.style.width = '';
              this.文档对象模型.style.transform = '';
              this.文档对象模型.style.msTransform = '';
            });
          }
          // 手机禁滚
          domArray.forEach((item, i) => {
            if (!item) {
              return;
            }
            添加事件监听者(
              item,
              eventArray[i] || 'touchmove',
              i ? this.removeMoveHandler : this.removeStartHandler,
              this.passive
            );
          });
        } else if (this.getCrrentDrawerSome()) {
          document.body.style.overflow = '';
          if ((this.isOpenChange || openTransition) && right) {
            document.body.style.position = '';
            document.body.style.width = '';
            if (过渡动画字符串) {
              document.body.style.overflowX = 'hidden';
            }
            this.文档对象模型.style.transition = 'none';
            let heightTransition;
            switch (placement) {
              case 'right': {
                this.文档对象模型.style.transform = `translateX(${right}px)`;
                this.文档对象模型.style.msTransform = `translateX(${right}px)`;
                this.文档对象模型.style.width = '100%';
                widthTransition = `width 0s ${ease} ${duration}`
                if (this.遮罩文档对象模型) {
                  this.遮罩文档对象模型.style.left = `-${right}px`;
                  this.遮罩文档对象模型.style.width = `calc(100% + ${right}px)`;
                }
                break;
              }
              case 'top':
              case 'bottom': {
                this.文档对象模型.style.width = `calc(100% + ${right}px)`;
                this.文档对象模型.style.height = '100%';
                this.文档对象模型.style.transform = 'translateZ(0)';
                heightTransition = `height 0s ${ease} ${duration}`
                break;
              }
              default:
                break;
            }
            clearTimeout(this.定时器编号);
            this.定时器编号 = setTimeout(() => {
              this.文档对象模型.style.transition = `${trannsformTransition},${
                heightTransition ? `${heightTransition},` : ''}${widthTransition}`;
              this.文档对象模型.style.transform = '';
              this.文档对象模型.style.msTransform = '';
              this.文档对象模型.style.width = '';
              this.文档对象模型.style.height = '';
            });
          }
          domArray.forEach((item, i) => {
            if (!item) {
              return;
            }
            移除事件监听者(
              item,
              eventArray[i] || 'touchmove',
              i ? this.removeMoveHandler : this.removeStartHandler,
              this.passive
            );
          });
        }
      }
    }
    if (onChange && this.isOpenChange && this.第一次进入) {
      onChange(打开的);
      this.isOpenChange = false;
    }
  };

  getChildToRender = open => {
    const {
      className,
      prefixCls,
      style,
      placement,
      children,
      handler,
      showMask,
      maskStyle,
      width,
      height,
    } = this.props;
    const wrapperClassname = 类名合并者(prefixCls, {
      [`${prefixCls}-${placement}`]: true,
      [`${prefixCls}-open`]: open,
      [className]: !!className,
    });
    const isOpenChange = this.isOpenChange;
    const isHorizontal = placement === 'left' || placement === 'right';
    const placementName = `translate${isHorizontal ? 'X' : 'Y'}`;
    // 百分比与像素动画不同步，第一次打用后全用像素动画。
    // const defaultValue = !this.contentDom || !level ? '100%' : `${value}px`;
    const placementPos =
      placement === 'left' || placement === 'top' ? '-100%' : '100%';
    const transform = open ? '' : `${placementName}(${placementPos})`;
    if (isOpenChange === undefined || isOpenChange) {
      const contentValue = this.内容文档对象模型 ? this.内容文档对象模型.getBoundingClientRect()[
        isHorizontal ? 'width' : 'height'
      ] : 0;
      const value = (isHorizontal ? width : height) || contentValue;
      this.setLevelDomTransform(open, false, placementName, value);
    }
    const handlerCildren = handler && 瑞哎科特.cloneElement(handler, {
      onClick: (e) => {
        if (handler.props.onClick) {
          handler.props.onClick();
        }
        this.onIconTouchEnd(e);
      },
      ref: (c) => {
        this.handlerdom = c;
      }
    });
    return (
      <div
        className={wrapperClassname}
        style={style}
        ref={被引用的文档对象模型 => { this.文档对象模型 = 被引用的文档对象模型; }}
        onTransitionEnd={this.当包裹动画结束}
      >
        {showMask && (
          <div
            className={`${prefixCls}-mask`}
            onClick={this.当触摸遮罩层结束}
            style={maskStyle}
            ref={被引用的文档对象模型 => {
              this.遮罩文档对象模型 = 被引用的文档对象模型;
            }}
          />
        )}
        <div
          className={`${prefixCls}-content-wrapper`}
          style={{
            transform,
            msTransform: transform,
            width: 是数字吗(width) ? `${width}px` : width,
            height: 是数字吗(height) ? `${height}px` : height,
          }}
          ref={c => {
            this.contentWrapper = c;
          }}
        >
          <div
            className={`${prefixCls}-content`}
            ref={c => {
              this.内容文档对象模型 = c;
            }}
            onTouchStart={open ? this.removeStartHandler : null} // 跑用例用
            onTouchMove={open ? this.removeMoveHandler : null} // 跑用例用
          >
            {children}
          </div>
          {handlerCildren}
        </div>
      </div>
    );
  };

  getOpen = () => (
    this.props.open !== undefined ? this.props.open : this.state.open
  )

  getTouchParentScroll = (root, currentTarget, differX, differY) => {
    if (!currentTarget) {
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
    if (currentTarget.scrollTo) {
      currentTarget.scrollTo(currentTarget.scrollLeft + 1, currentTarget.scrollTop + 1);
    }
    const currentT = currentTarget.scrollTop;
    const currentL = currentTarget.scrollLeft;
    if (currentTarget.scrollTo) {
      currentTarget.scrollTo(currentTarget.scrollLeft - 1, currentTarget.scrollTop - 1);
    }
    if (
      isY && (!scrollY || !(currentT - t) ||
        (scrollY && (currentTarget.scrollTop >= scrollY && differY < 0 ||
          currentTarget.scrollTop <= 0 && differY > 0))
      ) ||
      isX && (!scrollX || !(currentL - l) ||
        (scrollX && (currentTarget.scrollLeft >= scrollX && differX < 0 ||
          currentTarget.scrollLeft <= 0 && differX > 0))
      )
    ) {
      return this.getTouchParentScroll(root, currentTarget.parentNode, differX, differY);
    }
    return false;
  }

  removeStartHandler = e => {
    if (e.touches.length > 1) {
      return;
    }
    this.startPos = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  removeMoveHandler = 事件 => {
    if (事件.changedTouches.length > 1) {
      return;
    }
    const 当前目标 = 事件.currentTarget;
    const differX = 事件.changedTouches[0].clientX - this.startPos.x;
    const differY = 事件.changedTouches[0].clientY - this.startPos.y;
    if (
      当前目标 === this.遮罩文档对象模型 ||
      当前目标 === this.handlerdom ||
      当前目标 === this.内容文档对象模型 &&
      this.getTouchParentScroll(当前目标, 事件.target, differX, differY)
    ) {
      事件.preventDefault();
    }
  };

  trnasitionEnd = e => {
    移除事件监听者(e.target, 过渡动画结束, this.trnasitionEnd);
    e.target.style.transition = '';
  };

  defaultGetContainer = () => {
    if (windowIsUndefined) {
      return null;
    }
    const container = document.createElement('div');
    this.祖先.appendChild(container);
    if (this.props.wrapperClassName) {
      container.className = this.props.wrapperClassName;
    }
    return container;
  };

  render() {
    const { getContainer, wrapperClassName } = this.props;
    const 打开的 = this.getOpen();
    当前抽屉[this.抽屉编号] = 打开的 ? this.container : 打开的;
    const children = this.getChildToRender(this.第一次进入 ? 打开的 : false);
    if (!getContainer) {
      return (
        <div
          className={wrapperClassName}
          ref={c => {
            this.container = c;
          }}
        >
          {children}
        </div>
      );
    }
    if (!this.container || !打开的 && !this.第一次进入) {
      return null;
    }
    // suppport react15
    if (!是瑞哎科特16) {
      return (
        <容器渲染者
          parent={this}
          visible
          autoMount
          autoDestroy={false}
          getComponent={() => children}
          getContainer={this.getContainer}
        >
          {({ 组件渲染者, 移除容器 }) => {
            this.组件渲染者 = 组件渲染者;
            this.移除容器 = 移除容器;
            return null;
          }}
        </容器渲染者>
      );
    }
    return 瑞哎科特文档对象模型.createPortal(children, this.container);
  }
}

抽屉.propTypes = {
  wrapperClassName: 属性类型检查者.string,
  className: 属性类型检查者.string,
  children: 属性类型检查者.node,
  style: 属性类型检查者.object,
  width: 属性类型检查者.any,
  height: 属性类型检查者.any,
  defaultOpen: 属性类型检查者.bool,
  firstEnter: 属性类型检查者.bool,
  open: 属性类型检查者.bool,
  prefixCls: 属性类型检查者.string,
  placement: 属性类型检查者.string,
  level: 属性类型检查者.oneOfType([属性类型检查者.string, 属性类型检查者.array]),
  levelMove: 属性类型检查者.oneOfType([属性类型检查者.number, 属性类型检查者.func, 属性类型检查者.array]),
  ease: 属性类型检查者.string,
  duration: 属性类型检查者.string,
  getContainer: 属性类型检查者.oneOfType([属性类型检查者.string, 属性类型检查者.func, 属性类型检查者.object, 属性类型检查者.bool]),
  handler: 属性类型检查者.any,
  onChange: 属性类型检查者.func,
  onMaskClick: 属性类型检查者.func,
  onHandleClick: 属性类型检查者.func,
  showMask: 属性类型检查者.bool,
  maskStyle: 属性类型检查者.object,
};

export default 抽屉;

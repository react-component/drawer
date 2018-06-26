import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ContainerRender from 'rc-util/lib/ContainerRender';
import { dataToArray, transitionEnd } from './utils';

const IS_REACT_16 = 'createPortal' in ReactDOM;

const windowIsUndefined = typeof window === 'undefined';
class Drawer extends React.PureComponent {
  static defaultProps = {
    prefixCls: 'drawer',
    placement: 'left',
    getContainer: 'body',
    level: 'all',
    levelTransition: 'transform .3s cubic-bezier(0.78, 0.14, 0.15, 0.86)',
    onChange: () => {},
    onMaskClick: () => {},
    onHandleClick: () => {},
    handleChild: <i className="drawer-handle-icon" />,
    handleStyle: {},
    showMask: true,
    maskStyle: {},
    wrapperClassName: '',
    className: '',
  };

  constructor(props) {
    super(props);
    this.levelDom = [];
    this.contextDom = null;
    this.maskDom = null;
    this.handleDom = null;
    this.mousePos = null;
    this.firstEnter = false;// 记录首次进入.
    if (props.onIconClick || props.parent || props.iconChild || props.width) {  // eslint-disable-line react/prop-types
      /* eslint-disable  no-console */
      console.warn(
        'rc-drawer-menu API has been changed, please look at the releases, ' +
          'https://github.com/react-component/drawer-menu/releases'
      );
    }
    this.state = {
      open: props.open !== undefined ? props.open : !!props.defaultOpen,
    };
  }
  componentDidMount() {
    if (this.props.handleChild || this.props.open) {
      this.getDefault(this.props);
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
      this.contextDom = null;
    }
    if (this.props.level !== nextProps.level) {
      this.getParentAndLevelDom(nextProps);
    }
  }

  componentDidUpdate() {
    // dom 没渲染时，重走一遍。
    if (!this.firstEnter) {
      this.forceUpdate();
      if (this.container) {
        this.firstEnter = true;
      }
    }
  }

  componentWillUnmount() {
    if (this.container) {
      this.setLevelDomTransform(false, true);
      // 拦不住。。直接删除；
      if (this.props.getContainer) {
        this.container.parentNode.removeChild(this.container);
      }
    }
    // suppport react15
    if (IS_REACT_16) {
      return;
    }
    this.renderComponent({
      afterClose: this.removeContainer,
      onClose() {},
      visible: false,
    });
  }

  onMaskTouchEnd = e => {
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

  getDefault = props => {
    this.getParentAndLevelDom(props);
    if (props.getContainer || props.parent) {
      this.container = this.defaultGetContainer();
    }
  };

  getContainer = () => {
    return this.container;
  };
  getParentAndLevelDom = props => {
    if (windowIsUndefined) {
      return;
    }
    const { level, getContainer } = props;
    this.levelDom = [];
    if (getContainer) {
      if (typeof getContainer === 'string') {
        const dom = document.querySelectorAll(getContainer)[0];
        this.parent = dom;
      }
      if (typeof getContainer === 'function') {
        this.parent = getContainer();
      }
      if (typeof getContainer === 'object' && getContainer instanceof window.HTMLElement) {
        this.parent = getContainer;
      }
    }
    if (!getContainer && this.container) {
      this.parent = this.container.parentNode;
    }
    if (level === 'all') {
      const children = Array.prototype.slice.call(this.parent.children);
      children.forEach(child => {
        if (child.nodeName !== 'SCRIPT' && child.nodeName !== 'STYLE' && child !== this.container) {
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

  setLevelDomTransform = (open, openTransition, placementName, value) => {
    const { placement, levelTransition, onChange } = this.props;
    this.levelDom.forEach(dom => {
      if (this.isOpenChange || openTransition) {
        /* eslint no-param-reassign: "error" */
        dom.style.transition = levelTransition;
        dom.addEventListener(transitionEnd, this.trnasitionEnd);
      }
      const placementPos = placement === 'left' || placement === 'top' ? value : -value;
      dom.style.transform = open ? `${placementName}(${placementPos}px)` : '';
    });
    // 处理 body 滚动
    if (!windowIsUndefined) {
      const eventArray = ['touchstart'];
      const domArray = [document.body, this.maskDom, this.handleDom, this.contextDom];
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
      const passive = passiveSupported ? { passive: false } : false;
      if (open) {
        this.bodyDefaultOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        // 手机禁滚
        if (document.body.addEventListener) {
          domArray.forEach((item, i) => {
            if (!item) {
              return;
            }
            item.addEventListener(
              eventArray[i] || 'touchmove',
              i ? this.removeMoveHandler : this.removeStartHandler,
              passive
            );
          });
        }
      } else {
        document.body.style.overflow = this.bodyDefaultOverflow;
        if (document.body.removeEventListener) {
          domArray.forEach((item, i) => {
            if (!item) {
              return;
            }
            item.removeEventListener(
              eventArray[i] || 'touchmove',
              i ? this.removeMoveHandler : this.removeStartHandler,
              passive
            );
          });
        }
        delete this.bodyDefaultOverflow;
      }
    }
    if (onChange && this.isOpenChange && this.firstEnter) {
      onChange(open);
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
      handleChild,
      handleStyle,
      showMask,
      maskStyle,
    } = this.props;
    const wrapperClassname = classnames(prefixCls, {
      [`${prefixCls}-${placement}`]: true,
      [`${prefixCls}-open`]: open,
      [className]: !!className,
    });
    const value = this.contextDom
      ? this.contextDom.getBoundingClientRect()[
        placement === 'left' || placement === 'right' ? 'width' : 'height'
      ]
      : 0;
    const placementName = `translate${placement === 'left' || placement === 'right' ? 'X' : 'Y'}`;
    // 百分比与像素动画不同步，第一次打用后全用像素动画。
    const defaultValue = !this.contextDom ? '100%' : `${value}px`;
    const placementPos =
      placement === 'left' || placement === 'top' ? `-${defaultValue}` : defaultValue;
    const transform = open ? '' : `${placementName}(${placementPos})`;
    if (this.isOpenChange === undefined || this.isOpenChange) {
      this.setLevelDomTransform(open, false, placementName, value);
    }
    return (
      <div
        className={wrapperClassname}
        style={style}
      >
        {showMask && (
          <div
            className={`${prefixCls}-mask`}
            onClick={this.onMaskTouchEnd}
            style={maskStyle}
            ref={c => {
              this.maskDom = c;
            }}
          />
        )}
        <div className={`${prefixCls}-content-wrapper`} style={{ transform }}>
          <div
            className={`${prefixCls}-content`}
            ref={c => {
              this.contextDom = c;
            }}
            onTouchStart={open ? this.removeStartHandler : null} // 跑用例用
            onTouchMove={open ? this.removeMoveHandler : null} // 跑用例用
          >
            {children}
          </div>
          {handleChild && (
            <div
              className={`${prefixCls}-handle`}
              onClick={this.onIconTouchEnd}
              style={handleStyle}
              ref={c => {
                this.handleDom = c;
              }}
            >
              {handleChild}
            </div>
          )}
        </div>
      </div>
    );
  };

  removeStartHandler = e => {
    if (e.touches.length > 1) {
      return;
    }
    this.startPos = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  removeMoveHandler = e => {
    if (e.changedTouches.length > 1) {
      return;
    }
    const currentTarget = e.currentTarget;
    const differX = e.changedTouches[0].clientX - this.startPos.x;
    const differY = e.changedTouches[0].clientY - this.startPos.y;
    if (
      currentTarget === this.maskDom ||
      currentTarget === this.handleDom ||
      (currentTarget === this.contextDom &&
        ((((currentTarget.scrollTop + currentTarget.offsetHeight >= currentTarget.scrollHeight &&
          differY < 0) ||
          (currentTarget.scrollTop <= 0 && differY > 0)) &&
          Math.max(Math.abs(differX), Math.abs(differY)) === differY) ||
          (((currentTarget.scrollLeft + currentTarget.offsetWidth >= currentTarget.scrollWidth &&
            differX < 0) ||
            (currentTarget.scrollLeft <= 0 && differX > 0)) &&
            Math.max(Math.abs(differX), Math.abs(differY)) === differX)))
    ) {
      e.preventDefault();
    }
  };

  trnasitionEnd = e => {
    e.target.removeEventListener(transitionEnd, this.trnasitionEnd);
    e.target.style.transition = '';
  };

  defaultGetContainer = () => {
    if (windowIsUndefined) {
      return null;
    }
    const container = document.createElement('div');
    this.parent.appendChild(container);
    if (this.props.wrapperClassName) {
      container.className = this.props.wrapperClassName;
    }
    return container;
  };

  render() {
    const { getContainer, wrapperClassName } = this.props;
    const open = this.props.open !== undefined ? this.props.open : this.state.open;
    const children = this.getChildToRender(this.firstEnter ? open : false);
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
    if (!this.container || !open && !this.firstEnter) {
      return null;
    }
    // suppport react15
    if (!IS_REACT_16) {
      return (
        <ContainerRender
          parent={this}
          visible
          autoMount
          autoDestroy={false}
          getComponent={() => {
            return this.getChildToRender();
          }}
          getContainer={this.getContainer}
        >
          {({ renderComponent, removeContainer }) => {
            this.renderComponent = renderComponent;
            this.removeContainer = removeContainer;
            return null;
          }}
        </ContainerRender>
      );
    }
    return ReactDOM.createPortal(children, this.container);
  }
}

Drawer.propTypes = {
  wrapperClassName: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object,
  defaultOpen: PropTypes.bool,
  open: PropTypes.bool,
  prefixCls: PropTypes.string,
  placement: PropTypes.string,
  level: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  levelTransition: PropTypes.string,
  getContainer: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object, PropTypes.bool]),
  handleChild: PropTypes.any,
  handleStyle: PropTypes.object,
  onChange: PropTypes.func,
  onMaskClick: PropTypes.func,
  onHandleClick: PropTypes.func,
  showMask: PropTypes.bool,
  maskStyle: PropTypes.object,
};

export default Drawer;

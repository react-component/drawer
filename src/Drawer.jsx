import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { dataToArray, transitionEnd } from './utils';

const windowIsUndefined = typeof window === 'undefined';

class Drawer extends React.PureComponent {
  static propTypes = {
    wrapperClassName: PropTypes.string,
    open: PropTypes.bool,
    bodyStyle: PropTypes.object,
    defaultOpen: PropTypes.bool,
    placement: PropTypes.string,
    level: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    levelTransition: PropTypes.string,
    getContainer: PropTypes.string,
    handleChild: PropTypes.any,
    handleStyle: PropTypes.object,
    onChange: PropTypes.func,
    onMaskClick: PropTypes.func,
    onHandleClick: PropTypes.func,
    showMask: PropTypes.bool,
    maskStyle: PropTypes.object,
  }
  static defaultProps = {
    className: '',
    prefixCls: 'drawer',
    placement: 'left',
    getContainer: 'body',
    level: 'all',
    levelTransition: 'transform .3s cubic-bezier(0.78, 0.14, 0.15, 0.86)',
    onChange: () => { },
    onMaskClick: () => { },
    onHandleClick: () => { },
    handleChild: (<i className="drawer-handle-icon" />),
    handleStyle: {},
    showMask: true,
    maskStyle: {},
  }

  levelDom = [];
  contextDom = null;
  maskDom = null;
  handleDom = null;
  mousePos = null;
  constructor(props) {
    super(props);
    if (props.onIconClick || props.parent || props.iconChild || props.width) {
      console.warn('rc-drawer-menu API has been changed, please look at the releases, ' +
        'https://github.com/react-component/drawer-menu/releases');
    }
    this.state = {
      open: props.open !== undefined ? props.open : !!props.defaultOpen,
    };
  }
  componentDidMount() {
    this.getParentAndLevelDom(this.props);
    if (this.props.getContainer || this.props.parent) {
      this.container = this.defaultGetContainer();
    }
    this.forceUpdate();
  }

  componentWillReceiveProps(nextProps) {
    const { open, placement } = nextProps;
    if (open !== undefined && open !== this.props.open) {
      this.isOpenChange = true;
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

  componentWillUnmount() {
    if (this.container) {
      this.setLevelDomTransform(false, true);
      // 拦不住。。直接删除；
      if (this.props.getContainer) {
        this.container.parentNode.removeChild(this.container);
      }
    }
  }

  getParentAndLevelDom = (props) => {
    if (windowIsUndefined) {
      return;
    }
    const { level, getContainer } = props;
    this.levelDom = [];
    this.parent = getContainer && document.querySelectorAll(getContainer)[0]
      || this.container.parentNode;
    if (level === 'all') {
      const children = Array.prototype.slice.call(this.parent.children);
      children.forEach(child => {
        if (child.nodeName !== 'SCRIPT' &&
          child.nodeName !== 'STYLE' &&
          child !== this.container
        ) {
          this.levelDom.push(child);
        }
      });
    } else if (level) {
      dataToArray(level).forEach(key => {
        document.querySelectorAll(key)
          .forEach(item => {
            this.levelDom.push(item);
          });
      });
    }
  }

  trnasitionEnd = (e) => {
    const dom = e.target;
    dom.removeEventListener(transitionEnd, this.trnasitionEnd);
    dom.style.transition = '';
  }

  onTouchEnd = (e, close) => {
    if (this.props.open !== undefined) {
      return;
    }
    const open = close || this.state.open;
    this.isOpenChange = true;
    this.setState({
      open: !open,
    });
  }

  onMaskTouchEnd = (e) => {
    this.props.onMaskClick(e);
    this.onTouchEnd(e, true);
  }

  onIconTouchEnd = (e) => {
    this.props.onHandleClick(e);
    this.onTouchEnd(e);
  }

  setLevelDomTransform = (open, openTransition, placementName, value) => {
    const { placement, levelTransition, onChange } = this.props;
    this.levelDom.forEach(dom => {
      if (this.isOpenChange || openTransition) {
        dom.style.transition = levelTransition;
        dom.addEventListener(transitionEnd, this.trnasitionEnd);
      }
      const placementPos = placement === 'left' || placement === 'top'
        ? value : -value;
      dom.style.transform = open ? `${placementName}(${placementPos}px)` : '';
    });
    // 处理 body 滚动
    if (!windowIsUndefined) {
      if (open) {
        this.bodyDefaultOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = this.bodyDefaultOverflow;
        delete this.bodyDefaultOverflow;
      }
    }
    if (onChange && this.isOpenChange) {
      onChange(open);
      this.isOpenChange = false;
    }
  }

  getChildToRender = () => {
    const open = this.props.open !== undefined ? this.props.open : this.state.open;
    const {
      className, prefixCls, style, placement,
      children, handleChild, handleStyle, showMask, maskStyle,
    } = this.props;
    const wrapperClassname = classnames(prefixCls, {
      [`${prefixCls}-${placement}`]: true,
      [`${prefixCls}-open`]: open,
      [className]: !!className,
    });
    const value = this.contextDom ? this.contextDom.getBoundingClientRect()[
      placement === 'left' || placement === 'right' ? 'width' : 'height'
    ] : 0;
    const placementName = `translate${placement === 'left' || placement === 'right' ? 'X' : 'Y'}`;
    // 百分比与像素动画不同步，第一次打用后全用像素动画。
    const defaultValue = !this.contextDom ? '100%' : `${value}px`;
    const placementPos = placement === 'left' || placement === 'top'
      ? `-${defaultValue}` : defaultValue;
    const transform = open ? '' : `${placementName}(${placementPos})`;
    if (this.isOpenChange === undefined || this.isOpenChange) {
      this.setLevelDomTransform(open, false, placementName, value);
    }
    return (
      <div className={wrapperClassname} style={style}>
        {showMask && <div
          className={`${prefixCls}-mask`}
          onClick={this.onMaskTouchEnd}
          style={maskStyle}
          ref={(c) => {
            this.maskDom = c;
          }}
        />}
        <div
          className={`${prefixCls}-content-wrapper`}
          style={{ transform }}
        >
          <div
            className={`${prefixCls}-content`}
            ref={(c) => {
              this.contextDom = c;
            }}
          >
            {children}
          </div>
          {handleChild && (
            <div
              className={`${prefixCls}-handle`}
              onClick={this.onIconTouchEnd}
              style={handleStyle}
              ref={(c) => {
                this.handleDom = c;
              }}
            >
              {handleChild}
            </div>
          )}
        </div>
      </div>
    );
  }

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
    const children = this.getChildToRender();
    if (!this.props.getContainer) {
      return (<div className={this.props.wrapperClassName} ref={(c) => { this.container = c; }}>
        {children}
      </div>);
    }
    if (!this.container) {
      return null;
    }
    return createPortal(children, this.container);
  }
}

export default Drawer;

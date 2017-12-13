import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { dataToArray, transitionEnd } from './utils';

class Drawer extends React.PureComponent {
  static propTypes = {
    wrapperClassName: PropTypes.string,
    width: PropTypes.string,
    open: PropTypes.bool,
    defaultOpen: PropTypes.bool,
    placement: PropTypes.string,
    level: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    levelTransition: PropTypes.string,
    parent: PropTypes.string,
    openClassName: PropTypes.string,
    iconChild: PropTypes.any,
    onChange: PropTypes.func,
    onSwitch: PropTypes.func,
  }
  static defaultProps = {
    className: 'drawer',
    width: '60vw',
    placement: 'left',
    openClassName: 'drawer-open',
    parent: 'body',
    level: 'all',
    levelTransition: 'transform .3s cubic-bezier(0.78, 0.14, 0.15, 0.86)',
    onChange: () => { },
    onSwitch: () => { },
    iconChild: (<i className="drawer-button-icon" />),
  }

  levelDom = [];

  contextDom = null;
  contextWrapDom = null;

  mousePos = null;

  constructor(props) {
    super(props);
    this.state = {
      open: props.open !== undefined ? props.open : !!props.defaultOpen,
    };
  }
  componentDidMount() {
    this.dom = ReactDOM.findDOMNode(this);
    this.getParentAndLevelDom();
    this.container = this.props.parent ? this.defaultGetContainer() : this.dom;
    this.forceUpdate();
  }

  componentWillReceiveProps(nextProps) {
    const { open } = nextProps;
    if (open !== undefined && open !== this.props.open) {
      this.isOpenChange = true;
      this.setState({
        open,
      });
    }
  }

  componentWillUnmount() {
    if (this.container) {
      this.setLevelDomTransform(false, true);
      // 拦不住。。直接删除；
      if (this.props.parent) {
        this.container.parentNode.removeChild(this.container);
      }
      /* this.contextWrapDom.style.transform = '';
      this.container.style.opacity = 0;
      this.container.style.pointerEvents = 'none';
      this.container.style.transition = 'opacity 11.3s';
      console.log(this.container)
      const removeElemetFunc = () => {
        this.container.removeEventListener(transitionEnd, removeElemetFunc);
        this.levelDom.forEach(dom => {
          dom.style.transition = '';
        });
        ReactDOM.unmountComponentAtNode(this.container);
        this.container.parentNode.removeChild(this.container);
        this.container = null;
      };
      this.container.addEventListener(transitionEnd, removeElemetFunc); */
    }
  }

  getParentAndLevelDom = () => {
    if (typeof document === 'undefined') {
      return;
    }
    const { level, parent } = this.props;
    this.levelDom = [];
    this.parent = parent && document.querySelectorAll(parent)[0] || this.dom.parentNode;
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
      dataToArray(this.props.level).forEach(key => {
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
    this.props.onSwitch(e);
    if (this.props.open !== undefined) {
      return;
    }
    if (e) {
      e.preventDefault();
    }
    const open = close || this.state.open;
    this.isOpenChange = true;
    this.setState({
      open: !open,
    });
  }

  touchStart = (e) => {
    if (e.touches.length > 1) {
      return;
    }
    const touchs = e.touches[0];
    this.mousePos = {
      x: touchs.pageX,
      y: touchs.pageY,
    };
  }
  touchEnd = () => {
    this.mousePos = null;
  }

  getScollDom = (dom) => {
    const doms = [];
    const setScrollDom = (d) => {
      if ((d.scrollHeight > d.clientHeight || d.scrollWidth > d.clientWidth)) {
        doms.push(d);
      }
      if (d !== this.contextDom) {
        setScrollDom(d.parentNode);
      }
    };
    setScrollDom(dom);
    return doms[doms.length - 1];
  }

  getIsButtonDom = (dom) => {
    if (dom.className === `${this.props.className}-button`) {
      return true;
    }
    if (dom.parentNode) {
      return this.getIsButtonDom(dom.parentNode);
    }
    return false;
  }

  removeScroll = (e) => {
    const dom = e.target;
    if (dom.className === `${this.props.className}-bg` || this.getIsButtonDom(dom)) {
      e.preventDefault();
      e.returnValue = false;
      return;
    }

    let y = e.deltaY;
    let x = e.deltaX;
    if (e.type === 'touchmove') {
      if (e.touches.length > 1 || !this.mousePos) {
        return;
      }
      const touches = e.touches[0];
      // 上滑为正，下滑为负
      y = this.mousePos.y - touches.pageY;
      x = this.mousePos.x - touches.pageX;
    }
    const scrollDom = this.getScollDom(dom);
    if (!scrollDom) {
      return;
    }
    // 竖向
    const scrollTop = scrollDom.scrollTop;
    const height = scrollDom.clientHeight;
    const scrollHeight = scrollDom.scrollHeight;
    const isScrollY = scrollHeight - height > 2;
    const maxOrMinScrollY = isScrollY &&
      ((scrollTop <= 0 && y < 0) || (scrollTop + height >= scrollHeight && y > 0));
    // 横向
    const width = scrollDom.clientWidth;
    const scrollLeft = scrollDom.scrollLeft;
    const scrollWidth = scrollDom.scrollWidth;
    const isScrollX = scrollWidth - width > 2;
    const maxOrMinScrollX = scrollWidth - width > 2 &&
      ((scrollLeft <= 0 && x < 0) || (scrollLeft + width >= scrollWidth && x > 0));
    if (!isScrollY && !isScrollX || (maxOrMinScrollY || maxOrMinScrollX)) {
      e.preventDefault();
      e.returnValue = false;
      return;
    }
  }

  setLevelDomTransform = (open, openTransition) => {
    const { placement, levelTransition, width, onChange } = this.props;
    this.levelDom.forEach(dom => {
      if (this.isOpenChange || openTransition) {
        dom.style.transition = levelTransition;
        dom.addEventListener(transitionEnd, this.trnasitionEnd);
      }
      if (!open) {
        dom.style.transform = '';
      } else {
        dom.style.transform = `translateX(${placement === 'left' ? width : `-${width}`})`;
      }
    });
    // 处理 body 滚动
    if (open) {
      document.body.addEventListener('mousewheel', this.removeScroll);
      document.body.addEventListener('touchmove', this.removeScroll);
    } else {
      document.body.removeEventListener('mousewheel', this.removeScroll);
      document.body.removeEventListener('touchmove', this.removeScroll);
    }
    if (onChange && this.isOpenChange) {
      onChange(open);
      this.isOpenChange = false;
    }
  }

  getChildToRender = () => {
    const open = this.props.open !== undefined ? this.props.open : this.state.open;
    const { className, openClassName, placement, children, width, iconChild } = this.props;
    const wrapperClassname = classnames(this.props.className, {
      [`${className}-${placement}`]: true,
      [openClassName]: open,
    });
    const placementPos = placement === 'left' ? width : `-${width}`;
    const transform = open ? `translateX(${placementPos})` : '';
    const contentStyle = {
      width,
      [placement]: `-${width}`,
      transform,
    };
    if (this.isOpenChange === undefined || this.isOpenChange) {
      this.setLevelDomTransform(open);
    }
    let iconChildToRender;
    if (iconChild) {
      if (Array.isArray(iconChild)) {
        if (iconChild.length === 2) {
          iconChildToRender = open ? iconChild[1] : iconChild[0];
        } else {
          iconChildToRender = iconChild[0];
        }
      } else {
        iconChildToRender = iconChild;
      }
    }
    return (
      <div className={wrapperClassname}>
        <div
          className={`${className}-bg`}
          onTouchEnd={(e) => { this.onTouchEnd(e, true); }}
          onClick={(e) => { this.onTouchEnd(e, true); }}
        />
        <div
          className={`${className}-content-wrapper`}
          style={contentStyle}
          ref={(c) => {
            this.contextWrapDom = c;
          }}
        >
          <div
            className={`${className}-content`}
            onTouchStart={this.touchStart}
            onTouchEnd={this.touchEnd}
            ref={(c) => {
              this.contextDom = c;
            }}
          >
            {children}
          </div>
          {iconChildToRender && (
            <div
              className={`${className}-button`}
              onClick={(e) => { this.onTouchEnd(e); }}
            >
              {iconChildToRender}
            </div>
          )}
        </div>
      </div>
    );
  }

  defaultGetContainer = () => {
    const container = document.createElement('div');
    this.parent.appendChild(container);
    if (this.props.wrapperClassName) {
      container.className = this.props.wrapperClassName;
    }
    return container;
  };

  render() {
    const children = this.getChildToRender();
    if (!this.props.parent) {
      return (<div className={this.props.wrapperClassName}>
        {children}
      </div>);
    }
    if (!this.container) {
      return null;
    }
    return ReactDOM.createPortal(children, this.container);
  }
}

export default Drawer;

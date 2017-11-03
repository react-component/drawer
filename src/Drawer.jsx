import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { dataToArray, transitionEnd, getRequestAnimationFrame } from './utils';

const raf = getRequestAnimationFrame();

class MobileMenu extends React.PureComponent {
  static propTypes = {
    wrapperClassName: PropTypes.string,
    width: PropTypes.string,
    placement: PropTypes.string,
    level: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    levelTransition: PropTypes.string,
    parent: PropTypes.string,
    openClassName: PropTypes.string,
  }
  static defaultProps = {
    className: 'drawer',
    width: '60vw',
    placement: 'left',
    openClassName: 'drawer-open',
    parent: 'body',
    level: 'all',
    levelTransition: 'transform .3s cubic-bezier(0.78, 0.14, 0.15, 0.86)',
  }

  levelDom = [];

  state = {
    open: false,
  };

  componentDidMount() {
    raf(() => {
      this.getParentAndLevelDom();
      this.container = this.defaultGetContainer();
      this.componentDidUpdate();
    });
  }
  componentDidUpdate() {
    this.renderPickerComponent(this.getChildToRender());
  }
  componentWillUnmount() {
    if (this.container) {
      ReactDOM.unmountComponentAtNode(this.container);
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }
  }

  getParentAndLevelDom = () => {
    if (typeof document === 'undefined') {
      return;
    }
    const { level, parent } = this.props;
    this.levelDom = [];
    this.parent = document.querySelectorAll(parent)[0];
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
    } else {
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
    e.preventDefault();
    const { placement, levelTransition, width } = this.props;
    const open = close || this.state.open;
    this.levelDom.forEach(dom => {
      dom.style.transition = levelTransition;
      if (open) {
        dom.style.transform = '';
      } else {
        dom.style.transform = `translateX(${placement === 'left' ? width : `-${width}`})`;
      }
      dom.addEventListener(transitionEnd, this.trnasitionEnd);
    });

    this.setState({
      open: !open,
    });
  }

  getChildToRender = () => {
    const { open } = this.state;
    const { className, openClassName, placement, children, width } = this.props;
    const wrapperClassname = classnames(this.props.className, {
      [`${className}-${placement}`]: true,
      [openClassName]: open,
    });
    const placementPos = placement === 'left' ? width : `-${width}`;
    const contentStyle = {
      width,
      [placement]: `-${width}`,
      transform: open ? `translateX(${placementPos})` : '',
    };
    const iconChild = this.props.iconChild || (
      <i className={`${className}-button-icon`} />
    );
    return (
      <div className={wrapperClassname}>
        <div
          className={`${className}-bg`}
          onTouchEnd={(e) => { this.onTouchEnd(e, true); }}
          onClick={(e) => { this.onTouchEnd(e, true); }}
        />
        <div className={`${className}-wrapper`} style={contentStyle}>
          <div className={`${className}-content`}>
            {children}
          </div>
          <div
            className={`${className}-button`}
            onClick={(e) => { this.onTouchEnd(e); }}
          >
            {iconChild}
          </div>
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

  renderPickerComponent = (children) => {
    ReactDOM.unstable_renderSubtreeIntoContainer(this, children, this.container);
  }

  render() {
    return null;
  }
}

export default MobileMenu;

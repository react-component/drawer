import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { dataToArray, transitionEnd, getRequestAnimationFrame } from './utils';

const raf = getRequestAnimationFrame();

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
    onIconClick: PropTypes.func,
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
    onIconClick: () => { },
  }

  levelDom = [];

  constructor(props) {
    super(props);
    this.state = {
      open: props.open !== undefined ? props.open : !!props.defaultOpen,
    };
  }

  componentDidMount() {
    raf(() => {
      this.getParentAndLevelDom();
      this.container = this.defaultGetContainer();
      this.componentDidUpdate();
    });
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
    this.props.onIconClick(e);
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

  setLevelDomTransform = (open) => {
    const { placement, levelTransition, width, onChange } = this.props;
    this.levelDom.forEach(dom => {
      if (this.isOpenChange) {
        dom.style.transition = levelTransition;
        dom.addEventListener(transitionEnd, this.trnasitionEnd);
      }
      if (!open) {
        dom.style.transform = '';
      } else {
        dom.style.transform = `translateX(${placement === 'left' ? width : `-${width}`})`;
      }
    });
    if (onChange && this.isOpenChange) {
      onChange(open);
      this.isOpenChange = false;
    }
  }

  getChildToRender = () => {
    let open;
    open = this.props.open !== undefined ? this.props.open : this.state.open;
    const { className, openClassName, placement, children, width } = this.props;
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

export default Drawer;

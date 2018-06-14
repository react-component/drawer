import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import ReactDom from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import expect from 'expect.js';
import Drawer from '../src';
import '../assets/index.less';
import { setTimeout } from 'timers';

describe('rc-drawer-menu', () => {
  let div;
  let instance;

  function createDrawerInstance(props) {
    class DrawerDeom extends React.PureComponent {
      constructor(childrenProps) {
        super(childrenProps);
        this.state = {
          open: childrenProps.open,
        };
      }
      switchMenu = () => {
        this.setState({
          open: !this.state.open,
        });
      }
      render() {
        return (
          <Drawer
            {...props}
            open={this.state.open}
            defaultOpen={this.props.defaultOpen}
            level={this.props.level}
          >
            <div style={{ width: 200 }}>
              test
            </div>
          </Drawer>
        );
      }
    }
    return ReactDom.render(<DrawerDeom {...props} />, div);
  }

  beforeEach(() => {
    div = document.createElement('div');
    div.className = 'react-wrapper';
    document.body.appendChild(div);
  });

  afterEach(() => {
    try {
      ReactDom.unmountComponentAtNode(div);
      document.body.removeChild(div);
    } catch (e) {
      console.log(e);
    }
  });

  it('single drawer', () => {
    instance = createDrawerInstance({});
    const drawer = TestUtils.findRenderedDOMComponentWithClass(instance, 'drawer');
    const drawerContent = TestUtils.findRenderedDOMComponentWithClass(instance,
      'drawer-content-wrapper');
    console.log(drawer);
    expect(!!drawer).to.be(true);
    expect(drawer.parentNode.parentNode.tagName).to.be('BODY');
    console.log(drawerContent.style.transform);
    expect(drawerContent.style.transform).to.be('translateX(-100%)');
  });

  it('icon child is element', () => {
    instance = createDrawerInstance({
      handleChild: <i className="a">a</i>,
    });
    const icon = TestUtils.findRenderedDOMComponentWithClass(instance,
      'drawer-handle');
    const handleChild = icon.children[0];
    console.log(handleChild.className);
    expect(handleChild.className).to.be('a');
  });

  it('default open drawer', () => {
    instance = createDrawerInstance({
      defaultOpen: true,
      level: [],
      handleChild: (<i className="a">a</i>),
    });
    const drawer = TestUtils.findRenderedDOMComponentWithClass(instance,
      'drawer-content-wrapper');
    expect(drawer.style.transform).to.eql('');
  });

  it('switch open drawer', (done) => {
    instance = createDrawerInstance({
      wrapperClassName: 'drawer-2',
    });
    const drawer = TestUtils.findRenderedDOMComponentWithClass(instance,
      'drawer-content-wrapper');
    console.log('第一次百分比：', drawer.style.transform);
    expect(drawer.style.transform).to.be('translateX(-100%)');
    instance.switchMenu();
    setTimeout(() => {
      console.log(drawer.style.transform);
      expect(drawer.style.transform).to.eql('');
      instance.switchMenu();
      setTimeout(() => {
        console.log('第二次变绝对值：', drawer.style.transform);
        expect(drawer.style.transform).to.be('translateX(-200px)');
        done();
      }, 500);
    }, 500);
  });
  it('getContainer is null', () => {
    instance = createDrawerInstance({
      getContainer: null,
    });
    const drawer = TestUtils.findRenderedDOMComponentWithClass(instance, 'drawer');
    console.log(drawer.parentNode.parentNode.className);
    expect(drawer.parentNode.parentNode.className).to.be('react-wrapper');
  });
  it('click open close', (done) => {
    instance = createDrawerInstance({});
    const content = TestUtils.findRenderedDOMComponentWithClass(instance,
      'drawer-content-wrapper');
    console.log(content.style.transform);
    expect(content.style.transform).to.be('translateX(-100%)');
    const handle = TestUtils.findRenderedDOMComponentWithClass(instance, 'drawer-handle');
    TestUtils.Simulate.click(handle);
    console.log(content.style.transform);
    expect(content.style.transform).to.be('');
    setTimeout(() => {
      const mask = TestUtils.findRenderedDOMComponentWithClass(instance, 'drawer-mask');
      TestUtils.Simulate.click(mask);
      console.log(content.style.transform);
      expect(content.style.transform).to.be('translateX(-200px)');
      done();
    }, 450);
  });
});

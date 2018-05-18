import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import ReactDom from 'react-dom';
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
            open={this.state.open}
            defaultOpen={this.props.defaultOpen}
            level={this.props.level}
            handleChild={props.handleChild}
            wrapperClassName={props.wrapperClassName}
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
    const drawer = document.getElementsByClassName('drawer');
    console.log(drawer.length);
    expect(drawer.length).to.be(1);
    const drawerDom = drawer[0].children[1];
    console.log(drawerDom.style.transform);
    expect(drawerDom.style.transform).to.eql('translateX(-100%)');
  });

  it('icon child is element', () => {
    instance = createDrawerInstance({
      handleChild: <i className="a">a</i>,
      wrapperClassName: 'drawer-3',
    });
    const icon = document.querySelectorAll('.drawer-3 .drawer-handle')[0];
    const handleChild = icon.children[0];
    expect(handleChild.className).to.eql('a');
  });

  it('default open drawer', () => {
    instance = createDrawerInstance({
      defaultOpen: true,
      level: [],
      handleChild: (<i className="a">a</i>),
      wrapperClassName: 'drawer-1',
    });
    const drawer = document.querySelectorAll('.drawer-1 .drawer-content-wrapper')[0];
    expect(drawer.style.transform).to.eql('');
  });

  it('switch open drawer', (done) => {
    instance = createDrawerInstance({
      wrapperClassName: 'drawer-2',
    });
    const drawer = document.querySelectorAll('.drawer-2 .drawer-content-wrapper')[0];
    console.log(drawer.style.transform);
    expect(drawer.style.transform).to.eql('translateX(-100%)');
    instance.switchMenu();
    setTimeout(() => {
      console.log(drawer.style.transform);
      expect(drawer.style.transform).to.eql('');
      instance.switchMenu();
      setTimeout(() => {
        console.log(drawer.style.transform);
        expect(drawer.style.transform).to.eql('translateX(-100%)');
        done();
      }, 500);
    }, 500);
  });
});

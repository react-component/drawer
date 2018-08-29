/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import Drawer from '../src';

function Div(props) {
  return (
    <div className="div-wrapper">
      {props.show && <Drawer wrapperClassName="drawer-wrapper" defaultOpen />}
    </div>
  );
}
Div.propTypes = {
  show: PropTypes.bool,
};

function DrawerComp(props) {
  return (
    <div className="react-wrapper">
      <div id="a" style={{ position: 'absolute', top: 0, left: 0 }}>test1</div>
      <Drawer getContainer={null} open={props.open} wrapperClassName="drawer-wrapper" />
    </div>
  );
}

function createClientXY(x, y) {
  return { clientX: x, clientY: y };
}

function createStartTouchEventObject({ x = 0, y = 0 }) {
  return { touches: [createClientXY(x, y)] };
}

function createMoveTouchEventObject({ x = 0, y = 0 }) {
  return { touches: [createClientXY(x, y)], changedTouches: [createClientXY(x, y)] };
}

describe('rc-drawer-menu', () => {
  let instance;
  it('single drawer', () => {
    instance = mount(<Drawer onIconClick={() => { }} />);
    const drawer = instance.find('.drawer');
    const drawerContent = instance.find('.drawer-content-wrapper');
    expect(!!drawer).toBe(true);
    expect(drawer.instance().parentNode.parentNode.tagName).toBe('BODY');
    console.log('clientWidth:', drawerContent.instance().clientWidth);
    expect(drawerContent.instance().style.transform).toBe('translateX(-100%)');
  });

  it('icon child is element', () => {
    instance = mount(<Drawer
      handler={<div className="a"><i >a</i></div>}
      level={null}
    />);
    const icon = instance.find('.a');
    console.log('icon.length:', icon.length);
    expect(icon.length).toBe(1);
  });

  it('default open drawer', () => {
    instance = mount(<Drawer
      handler={<i className="a">a</i>}
      defaultOpen
      level={[]}
    />);
    const drawer = instance.find('.drawer-content-wrapper').instance();
    const content = instance.find('.drawer-content');
    content.simulate('touchStart',
      createStartTouchEventObject({ x: 100, y: 0 }));
    content.simulate('touchMove',
      createMoveTouchEventObject({ x: 150, y: 10 }));
    content.simulate('touchEnd',
      createMoveTouchEventObject({ x: 200, y: 0 }));
    content.simulate('touchStart',
      createStartTouchEventObject({ x: 0, y: 0 }));
    content.simulate('touchMove',
      createMoveTouchEventObject({ x: 0, y: 10 }));
    content.simulate('touchEnd',
      createMoveTouchEventObject({ x: 0, y: 10 }));
    console.log('transform is empty:', drawer.style.transform);
    expect(drawer.style.transform).toEqual('');
  });

  it('handler is null，open=true', () => {
    const instance = mount(<Drawer
      handler={false}
      open
      level={null}
    />);
    expect(instance.render()).toMatchSnapshot();
  });
  it('handler is null，open=false', () => {
    const instance = mount(<Drawer
      handler={false}
      open={false}
      level={null}
    />);
    expect(instance.render()).toMatchSnapshot();
  });
  it('switch open drawer', () => {
    instance = mount(<DrawerComp />);
    jest.useFakeTimers();
    const drawer = instance.find('.drawer-content-wrapper').instance();
    console.log('第一次：', drawer.style.transform);
    expect(drawer.style.transform).toBe('translateX(-100%)');
    instance.setProps({
      open: true,
    });
    jest.runAllTimers();
    console.log(drawer.style.transform);
    expect(drawer.style.transform).toEqual('');
    instance.setProps({
      open: false,
    });
    console.log('第二次：', drawer.style.transform);
    jest.runAllTimers();
    expect(drawer.style.transform).toBe('translateX(-100%)');
    jest.useRealTimers();
  });
  it('getContainer is null', () => {
    instance = mount(<div className="react-wrapper">
      <div id="a" className="a" style={{ position: 'absolute', top: 0, left: 0 }}>test1</div>
      <Drawer
        getContainer={null}
        defaultOpen
        level="#a"
        wrapperClassName="drawer-wrapper"
      />
    </div>);
    const drawer = instance.find('.drawer').instance();
    const a = instance.find('#a').instance();
    console.log('a transform:', a.style.transform);
    expect(a.style.transform).toBe('');
    console.log(drawer.parentNode.parentNode.className);
    expect(drawer.parentNode.className).toBe('drawer-wrapper');
    expect(drawer.parentNode.parentNode.className).toBe('react-wrapper');
  });
  it('click open close', () => {
    instance = mount(<Drawer level="b" levelMove={200} />);
    const content = instance.find('.drawer-content-wrapper').instance();
    console.log(content.style.transform);
    expect(content.style.transform).toBe('translateX(-100%)');
    const handle = instance.find('.drawer-handle');
    handle.simulate('click');
    console.log(content.style.transform);
    expect(content.style.transform).toBe('');
    const mask = instance.find('.drawer-mask');
    mask.simulate('click');
    console.log(content.style.transform);
    expect(content.style.transform).toBe('translateX(-100%)');
  });
  it('will unmount', () => {
    instance = mount(<Div show />);
    const divWrapper = instance.find('.div-wrapper').instance();
    const content = instance.find('.drawer-content-wrapper').instance();
    console.log(content.style.transform);
    expect(content.style.transform).toBe('');
    instance.setProps({
      show: false,
    });
    expect(divWrapper.children.length).toBe(0);
  });
  it('placement change', () => {
    instance = mount(<Drawer level={null} />);
    const content = instance.find('.drawer-content-wrapper').instance();
    console.log(content.style.transform);
    expect(content.style.transform).toBe('translateX(-100%)');
    instance.setProps({
      placement: 'top',
      level: ['a', 'b'],
    });
    console.log(content.style.transform);
    expect(content.style.transform).toBe('translateY(-100%)');
  });
  it('levelMove is Array', () => {
    instance = mount(<Drawer handler={false} levelMove={[200, 0]} />);
    expect(instance.children().length).toBe(0);
    instance.setProps({
      open: true,
    });
    instance.setProps({
      open: false,
      levelMove: () => (200),
    });
    instance.setProps({
      open: true,
      levelMove: [200],
    });
  });
  it('handler is null, render is null', () => {
    instance = mount(<Drawer handler={false} levelMove={200} />);
    console.log(instance.children())
    expect(instance.children().length).toBe(0);
    instance.setProps({
      open: true,
    });
    console.log(instance.children())
    expect(instance.children().length).toBe(1);
  });
});

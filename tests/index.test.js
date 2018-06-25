/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import expect from 'expect.js';
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

describe('rc-drawer-menu', () => {
  let instance;
  it('single drawer', () => {
    instance = mount(<Drawer onIconClick={() => { }} />);
    const drawer = instance.find('.drawer');
    const drawerContent = instance.find('.drawer-content-wrapper');
    expect(!!drawer).to.be(true);
    expect(drawer.instance().parentNode.parentNode.tagName).to.be('BODY');
    console.log('clientWidth:', drawerContent.instance().clientWidth);
    expect(drawerContent.instance().style.transform).to.be('translateX(-100%)');
  });

  it('icon child is element', () => {
    instance = mount(<Drawer handleChild={<i className="a">a</i>} level={null} />);
    const icon = instance.find('.drawer-handle');
    const handleChild = icon.instance().children[0];
    console.log('icon className is a: ', handleChild.className);
    expect(handleChild.className).to.be('a');
  });

  it('default open drawer', () => {
    instance = mount(<Drawer
      handleChild={<i className="a">a</i>}
      defaultOpen
      level={[]}
    />);
    const drawer = instance.find('.drawer-content-wrapper').instance();
    console.log('transform is empty:', drawer.style.transform);
    expect(drawer.style.transform).to.eql('');
  });

  it('switch open drawer', () => {
    instance = mount(<DrawerComp />);
    jest.useFakeTimers();
    const drawer = instance.find('.drawer-content-wrapper').instance();
    console.log('第一次：', drawer.style.transform);
    expect(drawer.style.transform).to.be('translateX(-0px)');
    instance.setProps({
      open: true,
    });
    jest.runAllTimers();
    console.log(drawer.style.transform);
    expect(drawer.style.transform).to.eql('');
    instance.setProps({
      open: false,
    });
    console.log('第二次：', drawer.style.transform);
    jest.runAllTimers();
    expect(drawer.style.transform).to.be('translateX(-0px)');
    jest.useRealTimers();
  });
  it('getContainer is null', () => {
    instance = mount(<div className="react-wrapper">
      <div id="a" style={{ position: 'absolute', top: 0, left: 0 }}>test1</div>
      <Drawer getContainer={null} defaultOpen level="#a" wrapperClassName="drawer-wrapper" />
    </div>);
    const drawer = instance.find('.drawer').instance();
    const a = instance.find('#a').instance();
    console.log('a transform:', a.style.transform);
    expect(a.style.transform).to.be('');
    console.log(drawer.parentNode.parentNode.className);
    expect(drawer.parentNode.className).to.be('drawer-wrapper');
    expect(drawer.parentNode.parentNode.className).to.be('react-wrapper');
  });
  it('click open close', () => {
    instance = mount(<Drawer level="b" />);
    const content = instance.find('.drawer-content-wrapper').instance();
    console.log(content.style.transform);
    expect(content.style.transform).to.be('translateX(-100%)');
    const handle = instance.find('.drawer-handle');
    handle.simulate('click');
    console.log(content.style.transform);
    expect(content.style.transform).to.be('');
    const mask = instance.find('.drawer-mask');
    mask.simulate('click');
    console.log(content.style.transform);
    expect(content.style.transform).to.be('translateX(-0px)');
  });
  it('will unmount', () => {
    instance = mount(<Div show />);
    const divWrapper = instance.find('.div-wrapper').instance();
    const content = instance.find('.drawer-content-wrapper').instance();
    console.log(content.style.transform);
    expect(content.style.transform).to.be('');
    instance.setProps({
      show: false,
    });
    expect(divWrapper.children.length).to.be(0);
  });
  it('placement change', () => {
    instance = mount(<Drawer level={null} />);
    const content = instance.find('.drawer-content-wrapper').instance();
    console.log(content.style.transform);
    expect(content.style.transform).to.be('translateX(-100%)');
    instance.setProps({
      placement: 'top',
      level: ['a', 'b'],
    });
    console.log(content.style.transform);
    expect(content.style.transform).to.be('translateY(-100%)');
  });
  it('handleChild is null, render is null', () => {
    instance = mount(<Drawer handleChild={false} />);
    console.log(instance.children())
    expect(instance.children().length).to.be(0);
    instance.setProps({
      open: true,
    });
    console.log(instance.children())
    expect(instance.children().length).to.be(1);
  });
});

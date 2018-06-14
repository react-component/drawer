import React from 'react';
import expect from 'expect.js';
import { mount } from 'enzyme';
import Drawer from '../src';

describe('rc-drawer-menu', () => {
  let instance;
  it('single drawer', () => {
    instance = mount(<Drawer />);
    const drawer = instance.find('.drawer');
    const drawerContent = instance.find('.drawer-content-wrapper');
    expect(!!drawer).to.be(true);
    expect(drawer.instance().parentNode.parentNode.tagName).to.be('BODY');
    console.log('clientWidth:', drawerContent.instance().clientWidth);
    expect(drawerContent.instance().style.transform).to.be('translateX(-100%)');
  });

  it('icon child is element', () => {
    instance = mount(<Drawer handleChild={<i className="a">a</i>} />);
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
    instance = mount(<Drawer />);
    jest.useFakeTimers();
    const drawer = instance.find('.drawer-content-wrapper').instance();

    console.log('第一次百分比：', drawer.style.transform);
    expect(drawer.style.transform).to.be('translateX(-100%)');
    instance.setProps({
      open: true,
    });
    jest.runAllTimers();
    console.log(drawer.style.transform);
    expect(drawer.style.transform).to.eql('');
    instance.setProps({
      open: false,
    });
    console.log('第二次变绝对值：', drawer.style.transform);
    jest.runAllTimers();
    expect(drawer.style.transform).to.be('translateX(-0px)');
    jest.useRealTimers();
  });
  it('getContainer is null', () => {
    instance = mount(<div className="react-wrapper">
      <Drawer getContainer={null} wrapperClassName="drawer-wrapper"/>
    </div>);
    const drawer = instance.find('.drawer').instance();
    console.log(drawer.parentNode.parentNode.className);
    expect(drawer.parentNode.className).to.be('drawer-wrapper');
    expect(drawer.parentNode.parentNode.className).to.be('react-wrapper');
  });
  it('click open close', () => {
    instance = mount(<Drawer />);
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
});

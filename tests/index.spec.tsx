import { mount } from 'enzyme';
import * as React from 'react';
import toJson from 'enzyme-to-json';
import Drawer from '../src';

function Div(props) {
  const { show, ...otherProps } = props;
  return (
    <div className="div-wrapper">
      {show && (
        <Drawer wrapperClassName="drawer-wrapper" defaultOpen {...otherProps} />
      )}
    </div>
  );
}

function DrawerComp(props: { open?: boolean }) {
  return (
    <div className="react-wrapper">
      <div id="a" style={{ position: 'absolute', top: 0, left: 0 }}>
        test1
      </div>
      <Drawer
        getContainer={null}
        open={props.open}
        wrapperClassName="drawer-wrapper"
      />
    </div>
  );
}

function createClientXY(x: number, y: number) {
  return { clientX: x, clientY: y };
}

function createStartTouchEventObject({ x = 0, y = 0 }) {
  return { touches: [createClientXY(x, y)] };
}

function createMoveTouchEventObject({ x = 0, y = 0 }) {
  return {
    touches: [createClientXY(x, y)],
    changedTouches: [createClientXY(x, y)],
  };
}

describe('rc-drawer-menu', () => {
  let instance;
  it('single drawer', () => {
    instance = mount(<Drawer onHandleClick={() => {}} />);
    const drawer = instance.find('.drawer') as any;
    const drawerContent = instance.find('.drawer-content-wrapper') as any;
    expect(!!drawer).toBe(true);
    expect(drawer.instance().parentNode.parentNode.tagName).toBe('BODY');
    console.log('clientWidth:', drawerContent.instance().clientWidth);
    expect(drawerContent.instance().style.transform).toBe('translateX(-100%)');
  });

  it('icon child is element', () => {
    instance = mount(
      <Drawer
        handler={
          <div className="a">
            <i>a</i>
          </div>
        }
        level={null}
      />,
    );
    const icon = instance.find('.a');
    console.log('icon.length:', icon.length);
    expect(icon.length).toBe(1);
  });

  it('default open drawer', () => {
    instance = mount(
      <Drawer handler={<i className="a">a</i>} defaultOpen level={[]} />,
    );
    const drawer = instance.find('.drawer-content-wrapper').instance() as any;
    const content = instance.find('.drawer-content');
    content.simulate(
      'touchStart',
      createStartTouchEventObject({ x: 100, y: 0 }),
    );
    content.simulate(
      'touchMove',
      createMoveTouchEventObject({ x: 150, y: 10 }),
    );
    content.simulate('touchEnd', createMoveTouchEventObject({ x: 200, y: 0 }));
    content.simulate('touchStart', createStartTouchEventObject({ x: 0, y: 0 }));
    content.simulate('touchMove', createMoveTouchEventObject({ x: 0, y: 10 }));
    content.simulate('touchEnd', createMoveTouchEventObject({ x: 0, y: 10 }));
    console.log('transform is empty:', drawer.style.transform);
    expect(drawer.style.transform).toEqual('');
  });

  it('handler is null，open=true', () => {
    instance = mount(<Drawer handler={null} open level={null} />);
    expect(toJson(instance.render())).toMatchSnapshot();
  });
  it('handler is null，open=false', () => {
    instance = mount(<Drawer handler={false} open={false} level={null} />);
    expect(toJson(instance.render())).toMatchSnapshot();
  });
  it('switch open drawer', () => {
    instance = mount(<DrawerComp />);
    jest.useFakeTimers();
    const drawer = instance.find('.drawer-content-wrapper').instance() as any;
    console.log('第一次：', drawer.style.transform);
    expect(drawer.style.transform).toBe('translateX(-100%)');
    expect(toJson(instance.render())).toMatchSnapshot();
    instance.setProps({
      open: true,
    });
    jest.runAllTimers();
    expect(toJson(instance.render())).toMatchSnapshot();
    console.log(drawer.style.transform);
    expect(drawer.style.transform).toEqual('');
    instance.setProps({
      open: false,
    });
    console.log('第二次：', drawer.style.transform);
    jest.runAllTimers();
    expect(drawer.style.transform).toBe('translateX(-100%)');
    expect(toJson(instance.render())).toMatchSnapshot();
    jest.useRealTimers();
  });
  it('getContainer is null', () => {
    instance = mount(
      <div className="react-wrapper">
        <div
          id="a"
          className="a"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          test1
        </div>
        <Drawer
          getContainer={null}
          defaultOpen
          level="#a"
          wrapperClassName="drawer-wrapper"
        />
      </div>,
    );
    const drawer = instance.find('.drawer').instance() as any;
    const a = instance.find('#a').instance() as any;
    console.log('a transform:', a.style.transform);
    expect(a.style.transform).toBe('');
    console.log(drawer.parentNode.parentNode.className);
    expect(drawer.parentNode.className).toBe('drawer-wrapper');
    expect(drawer.parentNode.parentNode.className).toBe('react-wrapper');
    expect(toJson(instance.render())).toMatchSnapshot();
  });
  it('click open close', () => {
    instance = mount(<Drawer level="b" levelMove={200} />);
    const content = instance.find('.drawer-content-wrapper').instance() as any;
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
    const divWrapper = instance.find('.div-wrapper').instance() as any;
    const content = instance.find('.drawer-content-wrapper').instance() as any;
    console.log(content.style.transform);
    expect(content.style.transform).toBe('');
    instance.setProps({
      show: false,
    });
    expect(divWrapper.children.length).toBe(0);
  });
  it('placement change', () => {
    instance = mount(<Drawer level={null} />);
    const content = instance.find('.drawer-content-wrapper').instance() as any;
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
    instance = mount(<Drawer handler={null} levelMove={[200, 0]} />);
    expect(toJson(instance.render())).toMatchSnapshot();
    instance.setProps({
      open: true,
    });
    instance.setProps({
      open: false,
      levelMove: () => 200,
    });
    instance.setProps({
      open: true,
      levelMove: [200],
    });
    expect(toJson(instance.render())).toMatchSnapshot();
  });
  it('handler is null, render is null', () => {
    instance = mount(<Drawer handler={null} levelMove={200} />);
    expect(toJson(instance.render())).toMatchSnapshot();
  });

  it('getContainer', () => {
    instance = mount(<Div show getContainer={false} />);
    instance.setProps({
      show: false,
    });
    expect(toJson(instance.render())).toMatchSnapshot();
  });

  it('contentWrapperStyle', () => {
    instance = mount(
      <Drawer contentWrapperStyle={{ background: '#f00' }} level={null} />,
    );
    const content = instance.find('.drawer-content-wrapper').instance() as any;
    expect(content.style.background).toBe('rgb(255, 0, 0)');
  });

  it('autoFocus:false', () => {
    instance = mount(
      <div>
        <Drawer
          autoFocus={false}
          open={true}
          getContainer={false}
          wrapperClassName="autofocus-test-wrapper-class-name"
        >
          <p className="text">Here is content of Drawer</p>
        </Drawer>
      </div>,
    );

    expect(
      instance.find('.autofocus-test-wrapper-class-name').is(':focus'),
    ).toBe(false);
  });
});

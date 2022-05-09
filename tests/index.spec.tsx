import { cleanup, fireEvent, render } from '@testing-library/react';
import React from 'react';
import Drawer from '../src';
import type { IDrawerProps } from '../src/IDrawerPropTypes';

interface Point {
  x: number;
  y: number;
}

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

function createMultiStartTouchEventObject(points: Point[]) {
  return { touches: points.map(point => createClientXY(point.x, point.y)) };
}

function createMultiMoveTouchEventObject(points: Point[]) {
  const touches = points.map(point => createClientXY(point.x, point.y));
  return {
    touches,
    changedTouches: touches,
  };
}

describe('rc-drawer-menu', () => {
  afterEach(() => {
    cleanup();
  });
  it('single drawer', () => {
    render(<Drawer onHandleClick={() => {}} />);
    const drawer = document.querySelector('.drawer');
    expect(drawer).toBeTruthy();
    expect(drawer.parentNode.parentNode.nodeName).toBe('BODY');
    expect(
      document.querySelector('.drawer-content-wrapper').getAttribute('style'),
    ).toBe('transform: translateX(-100%);');
  });

  it('icon child is element', () => {
    render(
      <Drawer
        handler={
          <div className="a">
            <i>a</i>
          </div>
        }
        level={null}
      />,
    );
    expect(document.querySelector('.a')).toBeTruthy();
  });

  it('default open drawer', () => {
    render(<Drawer handler={<i className="a">a</i>} defaultOpen level={[]} />);
    const drawer = document.querySelector('.drawer-content-wrapper');
    const content = document.querySelector('.drawer-content');
    fireEvent.touchStart(
      content,
      createStartTouchEventObject({ x: 100, y: 0 }),
    );
    fireEvent.touchMove(content, createMoveTouchEventObject({ x: 150, y: 10 }));
    fireEvent.touchEnd(content, createMoveTouchEventObject({ x: 200, y: 0 }));
    fireEvent.touchStart(content, createStartTouchEventObject({ x: 0, y: 0 }));
    fireEvent.touchMove(content, createMoveTouchEventObject({ x: 0, y: 10 }));
    fireEvent.touchEnd(content, createMoveTouchEventObject({ x: 0, y: 10 }));
    fireEvent.touchStart(
      content,
      createMultiStartTouchEventObject([
        { x: 0, y: 0 },
        { x: 100, y: 100 },
      ]),
    );
    fireEvent.touchMove(
      content,
      createMultiMoveTouchEventObject([
        { x: 0, y: 10 },
        { x: 100, y: 120 },
      ]),
    );
    fireEvent.touchEnd(
      content,
      createMultiMoveTouchEventObject([
        { x: 0, y: 10 },
        { x: 100, y: 120 },
      ]),
    );
    expect(drawer.getAttribute('style')).toEqual('');
  });

  it('handler is null，open=true', () => {
    const { container } = render(<Drawer handler={null} open level={null} />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it('handler is null，open=false', () => {
    const { container } = render(
      <Drawer handler={false} open={false} level={null} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it('switch open drawer', () => {
    const { container, rerender } = render(<DrawerComp />);
    jest.useFakeTimers();
    const drawer = document.querySelector(
      '.drawer-content-wrapper',
    ) as HTMLElement;
    // console.log('第一次：', drawer.style.transform);
    expect(drawer.style.transform).toBe('translateX(-100%)');
    expect(container.firstChild).toMatchSnapshot();
    rerender(<DrawerComp open />);
    expect(container.firstChild).toMatchSnapshot();
    console.log(drawer.style.transform);
    expect(drawer.style.transform).toEqual('');
    rerender(<DrawerComp />);
    // console.log('第二次：', drawer.style.transform);
    expect(drawer.style.transform).toBe('translateX(-100%)');
    expect(container.firstChild).toMatchSnapshot();
    jest.useRealTimers();
  });
  it('getContainer is null', () => {
    const { container } = render(
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
    const drawer = document.querySelector('.drawer') as HTMLElement;
    const a = document.querySelector('#a') as HTMLElement;
    expect(a.style.transform).toBe('');
    // console.log(drawer.parentNode.parentElement.className);
    expect(drawer.parentElement.className).toBe('drawer-wrapper');
    expect(drawer.parentNode.parentElement.className).toBe('react-wrapper');
    expect(container.firstChild).toMatchSnapshot();
  });
  it('click open close', () => {
    render(<Drawer level="b" levelMove={200} />);
    const content = document.querySelector(
      '.drawer-content-wrapper',
    ) as HTMLElement;
    // console.log(content.style.transform);
    expect(content.style.transform).toBe('translateX(-100%)');
    const handle = document.querySelector('.drawer-handle');
    fireEvent.click(handle);
    // console.log(content.style.transform);
    expect(content.style.transform).toBe('');
    const mask = document.querySelector('.drawer-mask');
    fireEvent.click(mask);
    // console.log(content.style.transform);
    expect(content.style.transform).toBe('translateX(-100%)');
  });
  it('will unmount', () => {
    const { rerender } = render(<Div show />);
    const divWrapper = document.querySelector('.div-wrapper') as HTMLElement;
    const content = document.querySelector(
      '.drawer-content-wrapper',
    ) as HTMLElement;
    console.log(content.style.transform);
    expect(content.style.transform).toBe('');
    rerender(<Div />);
    expect(divWrapper.children.length).toBe(0);
  });
  it('placement change', () => {
    const { rerender } = render(<Drawer level={null} />);
    const content = document.querySelector(
      '.drawer-content-wrapper',
    ) as HTMLElement;
    // console.log(content.style.transform);
    expect(content.style.transform).toBe('translateX(-100%)');
    rerender(<Drawer level={['a', 'b']} placement="top" />);

    // console.log(content.style.transform);
    expect(content.style.transform).toBe('translateY(-100%)');
  });
  it('levelMove is Array', () => {
    const { rerender, container } = render(
      <Drawer handler={null} levelMove={[200, 0]} />,
    );
    expect(container.firstChild).toMatchSnapshot();
    rerender(<Drawer handler={null} levelMove={[200, 0]} open />);
    rerender(<Drawer handler={null} levelMove={() => 200} open={false} />);
    rerender(<Drawer handler={null} levelMove={[200]} open />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it('handler is null, render is null', () => {
    const { container } = render(<Drawer handler={null} levelMove={200} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('getContainer', () => {
    const { container, rerender } = render(<Div show getContainer={false} />);
    rerender(<Div getContainer={false} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('contentWrapperStyle', () => {
    render(
      <Drawer contentWrapperStyle={{ background: '#f00' }} level={null} />,
    );
    const content = document.querySelector(
      '.drawer-content-wrapper',
    ) as HTMLElement;
    expect(content.style.background).toBe('rgb(255, 0, 0)');
  });

  it('autoFocus', () => {
    let cache: IDrawerProps = {};
    const getDom = (props: IDrawerProps) => {
      cache = { ...cache, ...props };
      return (
        <Drawer
          autoFocus={false}
          open={true}
          getContainer={null}
          wrapperClassName="auto-focus-test-wrapper"
          {...cache}
        >
          <p className="text">Here is content of Drawer</p>
        </Drawer>
      );
    };
    const { rerender } = render(getDom({}));

    // In case { autoFocus: false }, default activeElement shouldn't be drawer node
    expect(document.activeElement).not.toBe(
      document.querySelector('.auto-focus-test-wrapper .drawer'),
    );

    // autofocus should not treat as dom attribute when {autofocus: false}
    expect(document.body.innerHTML.indexOf('autofocus')).toBe(-1);

    // Close and reopen drawer with props {autoFocus: true}
    rerender(getDom({ open: false, autoFocus: true }));
    rerender(getDom({ open: true }));

    // In case { autoFocus: true }, by which is also <Drawer />'s default, the activeElement will be drawer by itself
    expect(document.activeElement).toBe(
      document.querySelector('.auto-focus-test-wrapper .drawer'),
    );

    // autofocus should not treat as dom attribute when {autofocus: true}
    expect(document.body.innerHTML.indexOf('autofocus')).toBe(-1);
  });
});

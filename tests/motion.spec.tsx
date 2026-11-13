import { render, fireEvent, act } from '@testing-library/react';
import React from 'react';
import Drawer from '../src';

jest.mock('@rc-component/motion', () => {
  const { genCSSMotion } = jest.requireActual(
    '@rc-component/motion/lib/CSSMotion',
  );
  const CSSMotion = genCSSMotion(true);
  return CSSMotion;
});

describe('motion', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // zombieJ: Do not modify patch dom since user use `styles.wrapper` for override style
  it('motion patch on the correct element', () => {
    const { container } = render(
      <Drawer
        width="93%"
        open
        getContainer={false}
        motion={{ motionName: 'bamboo', motionAppear: true }}
        styles={{ wrapper: { background: 'red' } }}
      />,
    );

    expect(container.querySelector('.rc-drawer-content-wrapper')).toHaveClass(
      'bamboo-appear',
    );
    expect(container.querySelector('.rc-drawer-content-wrapper')).toHaveStyle({
      background: 'red',
    });
  });

  it('mask close should only trigger once', () => {
    let closeCount = 0;

    const Demo = () => {
      const [open, setOpen] = React.useState(true);
      const onClose = () => {
        closeCount += 1;
        setOpen(false);
      };

      const sharedMotion = {
        motionName: 'bamboo',
        motionAppear: false,
        motionEnter: false,
        motionLeave: true,
      };

      return (
        <Drawer
          motion={sharedMotion}
          maskMotion={sharedMotion}
          open={open}
          onClose={onClose}
          getContainer={false}
        />
      );
    };

    const { container } = render(<Demo />);

    for (let i = 0; i < 10; i += 1) {
      fireEvent.click(container.querySelector('.rc-drawer-mask'));
    }

    expect(closeCount).toBe(1);
  });

  it('ends the leave motion on the transition end of the content wrapper', () => {
    const afterOpenChange = jest.fn();
    const motion = { motionName: 'bamboo' };

    const renderDrawer = (open: boolean, destroyOnHidden?: boolean) => (
      <Drawer
        open={open}
        destroyOnHidden={destroyOnHidden}
        getContainer={false}
        motion={motion}
        afterOpenChange={afterOpenChange}
      />
    );

    const { container, rerender } = render(renderDrawer(true));
    rerender(renderDrawer(false));

    // Wait for the active step, the only phase which binds the motion events
    act(() => {
      jest.runAllTimers();
    });

    const wrapper = container.querySelector('.rc-drawer-content-wrapper');
    expect(wrapper).toHaveClass('bamboo-leave-active');

    // No `motionDeadline` here: only the transition end of the wrapper can settle it
    fireEvent.transitionEnd(wrapper);

    expect(afterOpenChange).toHaveBeenCalledTimes(1);
    expect(afterOpenChange).toHaveBeenCalledWith(false);

    act(() => {
      jest.runAllTimers();
    });

    expect(container.querySelector('.rc-drawer-content-wrapper')).toHaveClass(
      'rc-drawer-content-wrapper-hidden',
    );
  });
});

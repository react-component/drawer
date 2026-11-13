import { act, fireEvent, render } from '@testing-library/react';
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

  it('runs the leave motion when closed before the enter motion finishes', () => {
    const motion = { motionName: 'bamboo' };

    const { container, rerender } = render(
      <Drawer destroyOnHidden open getContainer={false} motion={motion} />,
    );

    // Close right away, while the enter motion is still running.
    rerender(<Drawer destroyOnHidden getContainer={false} motion={motion} />);

    // The drawer should play the leave motion instead of unmounting immediately.
    expect(container.querySelector('.rc-drawer')).toBeTruthy();
    expect(container.querySelector('.rc-drawer-content-wrapper')).toHaveClass(
      'bamboo-leave',
    );
  });
});

describe('motion lifecycle', () => {
  const originalRaf = window.requestAnimationFrame;
  const originalCancelRaf = window.cancelAnimationFrame;

  beforeEach(() => {
    jest.useFakeTimers();
    // jsdom never fires `transitionend`, so drive the rAF steps manually.
    window.requestAnimationFrame = ((cb: FrameRequestCallback) =>
      setTimeout(
        () => cb(Date.now()),
        16,
      )) as unknown as typeof window.requestAnimationFrame;
    window.cancelAnimationFrame = ((id: number) =>
      clearTimeout(id)) as unknown as typeof window.cancelAnimationFrame;
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    window.requestAnimationFrame = originalRaf;
    window.cancelAnimationFrame = originalCancelRaf;
  });

  it('unmounts after the leave motion finishes', async () => {
    const motion = { motionName: 'bamboo', motionDeadline: 100 };
    const afterOpenChange = jest.fn();

    const { container, rerender } = render(
      <Drawer
        destroyOnHidden
        open
        getContainer={false}
        motion={motion}
        afterOpenChange={afterOpenChange}
      />,
    );

    // Close before the enter motion finishes.
    rerender(
      <Drawer
        destroyOnHidden
        getContainer={false}
        motion={motion}
        afterOpenChange={afterOpenChange}
      />,
    );

    await act(async () => {
      jest.advanceTimersByTime(50);
    });
    expect(container.querySelector('.rc-drawer-content-wrapper')).toHaveClass(
      'bamboo-leave',
    );

    // Once the motion ends the drawer is destroyed and notified exactly once.
    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    expect(container.querySelector('.rc-drawer')).toBeFalsy();
    expect(afterOpenChange).toHaveBeenCalledTimes(1);
    expect(afterOpenChange).toHaveBeenCalledWith(false);
  });

  it('keeps the portal mounted after the leave motion by default', async () => {
    const motion = { motionName: 'bamboo', motionDeadline: 100 };

    const { container, rerender } = render(
      <Drawer open getContainer={false} motion={motion} />,
    );

    await act(async () => {
      jest.advanceTimersByTime(150);
    });

    rerender(<Drawer getContainer={false} motion={motion} />);

    await act(async () => {
      jest.advanceTimersByTime(50);
    });
    expect(container.querySelector('.rc-drawer-content-wrapper')).toHaveClass(
      'bamboo-leave',
    );

    // Without `destroyOnHidden` the portal has to stay mounted so that the leave
    // motion can finish.
    await act(async () => {
      jest.advanceTimersByTime(200);
    });
    expect(container.querySelector('.rc-drawer')).toBeTruthy();
  });
});

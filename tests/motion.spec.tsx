import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import Drawer from '../src';

jest.mock('rc-motion', () => {
  const { genCSSMotion } = jest.requireActual('rc-motion/lib/CSSMotion');
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

  // zombieJ: Do not modify patch dom since user use `contentWrapperStyle` for override style
  it('motion patch on the correct element', () => {
    const { container } = render(
      <Drawer
        width="93%"
        open
        getContainer={false}
        motion={{ motionName: 'bamboo', motionAppear: true }}
        contentWrapperStyle={{ background: 'red' }}
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
});

import { render } from '@testing-library/react';
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
});

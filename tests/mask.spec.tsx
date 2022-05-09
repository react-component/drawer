import { cleanup, render } from '@testing-library/react';
import React from 'react';
import Drawer from '../src';

describe('Drawer Mask', () => {
  afterEach(() => {
    cleanup();
  });
  it('show mask', () => {
    const { rerender } = render(<Drawer open />);

    expect(document.body.className).toBe('ant-scrolling-effect');

    rerender(<Drawer />);
    expect(document.body.className).toBe('');
  });

  it('no mask', () => {
    const { rerender } = render(<Drawer open showMask={false} />);

    expect(document.body.className).toBe('');

    rerender(<Drawer open={false} showMask={false} />);

    expect(document.body.className).toBe('');
  });
});

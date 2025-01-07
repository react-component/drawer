import { act, cleanup, render } from '@testing-library/react';
import React from 'react';
import Drawer from '../src';

describe('Drawer.ref', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('support panelRef', () => {
    const panelRef = React.createRef<HTMLDivElement>();
    render(<Drawer open panelRef={panelRef} />);

    act(() => {
      jest.runAllTimers();
    });

    expect(panelRef.current).toHaveClass('rc-drawer-section');
  });
});

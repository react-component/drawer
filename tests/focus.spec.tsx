import { cleanup, render, act } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import Drawer from '../src';

// Mock useLockFocus to track calls
jest.mock('@rc-component/util/lib/Dom/focus', () => {
  const actual = jest.requireActual('@rc-component/util/lib/Dom/focus');

  const useLockFocus = (visible: boolean, ...rest: any[]) => {
    (globalThis as any).__useLockFocusVisible = visible;
    const hooks = actual.useLockFocus(visible, ...rest);
    const hooksArray = Array.isArray(hooks) ? hooks : [hooks];
    const proxyIgnoreElement = (ele: HTMLElement) => {
      (globalThis as any).__ignoredElement = ele;
      hooksArray[0](ele);
    };
    return [proxyIgnoreElement, ...hooksArray.slice(1)] as ReturnType<
      typeof actual.useLockFocus
    >;
  };

  return {
    ...actual,
    useLockFocus,
  };
});

describe('Drawer.Focus', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should call ignoreElement when input in portal is focused', () => {
    render(
      <Drawer open>
        <input type="text" id="drawer-input" />
        {ReactDOM.createPortal(
          <input type="text" id="portal-input" />,
          document.body,
        )}
      </Drawer>,
    );

    act(() => {
      jest.runAllTimers();
    });

    const input = document.getElementById('portal-input') as HTMLElement;
    act(() => {
      input.focus();
    });

    expect((globalThis as any).__ignoredElement).toBe(input);
  });
});

import { cleanup, render, act, fireEvent } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import Drawer from '../src';

// Mock useLockFocus to track calls
jest.mock('@rc-component/util', () => {
  const actual = jest.requireActual('@rc-component/util');

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

  describe('focusTriggerAfterClose', () => {
    afterEach(() => {
      document.body.innerHTML = '';
    });

    function createTrigger(id: string) {
      const trigger = document.createElement('button');
      trigger.id = id;
      document.body.appendChild(trigger);
      trigger.focus();
      return trigger;
    }

    it('restores focus to the trigger when the drawer stays mounted', () => {
      const trigger = createTrigger('trigger-keep');

      const { container, rerender } = render(
        <Drawer open getContainer={false} motion={{ motionName: 'bamboo' }} />,
      );
      act(() => {
        jest.runAllTimers();
      });

      rerender(
        <Drawer
          open={false}
          getContainer={false}
          motion={{ motionName: 'bamboo' }}
        />,
      );
      act(() => {
        jest.runAllTimers();
      });
      fireEvent.transitionEnd(
        container.querySelector('.rc-drawer-content-wrapper')!,
      );
      act(() => {
        jest.runAllTimers();
      });

      expect(document.activeElement).toBe(trigger);
    });

    it('restores focus to the trigger when destroyOnHidden unmounts the panel', () => {
      const trigger = createTrigger('trigger-destroy');

      const { rerender } = render(
        <Drawer open destroyOnHidden getContainer={false} />,
      );
      act(() => {
        jest.runAllTimers();
      });

      rerender(<Drawer open={false} destroyOnHidden getContainer={false} />);
      act(() => {
        jest.runAllTimers();
      });

      expect(document.activeElement).toBe(trigger);
    });

    it('restores focus to the element focused right before opening', () => {
      const first = createTrigger('trigger-first');
      const second = document.createElement('button');
      second.id = 'trigger-second';
      document.body.appendChild(second);

      const { rerender } = render(
        <Drawer open={false} destroyOnHidden getContainer={false} />,
      );

      // The drawer is closed here, so this is what should get the focus back.
      second.focus();

      rerender(<Drawer open destroyOnHidden getContainer={false} />);
      act(() => {
        jest.runAllTimers();
      });

      rerender(<Drawer open={false} destroyOnHidden getContainer={false} />);
      act(() => {
        jest.runAllTimers();
      });

      expect(document.activeElement).toBe(second);
      expect(document.activeElement).not.toBe(first);
    });

    it('does not move focus when focusTriggerAfterClose is false', () => {
      createTrigger('trigger-disabled');

      const { rerender } = render(
        <Drawer
          open
          destroyOnHidden
          getContainer={false}
          focusTriggerAfterClose={false}
        />,
      );
      act(() => {
        jest.runAllTimers();
      });

      rerender(
        <Drawer
          open={false}
          destroyOnHidden
          getContainer={false}
          focusTriggerAfterClose={false}
        />,
      );
      act(() => {
        jest.runAllTimers();
      });

      expect(document.getElementById('trigger-disabled')).not.toBe(
        document.activeElement,
      );
    });
  });
});

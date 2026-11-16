import { cleanup, render, act } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import Drawer from '../src';

jest.mock('@rc-component/motion', () => {
  const { genCSSMotion } = jest.requireActual(
    '@rc-component/motion/lib/CSSMotion',
  );
  return genCSSMotion(true);
});

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
    useLayoutEffect: jest.requireActual('react').useLayoutEffect,
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
      cleanup();
      document.body
        .querySelectorAll('[id^=trigger-]')
        .forEach(node => node.remove());
    });

    function createTrigger(id: string) {
      const trigger = document.createElement('button');
      trigger.id = id;
      document.body.appendChild(trigger);
      trigger.focus();
      return trigger;
    }

    function finishMotion() {
      act(() => {
        jest.runAllTimers();
      });
      act(() => {
        jest.runAllTimers();
      });
    }

    it('restores focus to the trigger when the drawer stays mounted', () => {
      const trigger = createTrigger('trigger-keep');

      const motion = { motionName: 'bamboo', motionDeadline: 100 };
      const { rerender } = render(
        <Drawer open getContainer={false} motion={motion} />,
      );
      finishMotion();

      rerender(<Drawer open={false} getContainer={false} motion={motion} />);
      finishMotion();

      expect(document.activeElement).toBe(trigger);
    });

    it('restores focus to the trigger when destroyOnHidden unmounts the panel', () => {
      const trigger = createTrigger('trigger-destroy');

      const { rerender } = render(
        <Drawer open destroyOnHidden getContainer={false} />,
      );
      finishMotion();

      rerender(<Drawer open={false} destroyOnHidden getContainer={false} />);
      finishMotion();

      expect(document.activeElement).toBe(trigger);
    });

    it('restores focus to the trigger that reopens the drawer during leave', () => {
      createTrigger('trigger-first-open');
      const motion = { motionName: 'bamboo', motionDeadline: 100 };
      const renderDrawer = (open: boolean) => (
        <Drawer open={open} getContainer={false} motion={motion} />
      );

      const { container, rerender } = render(renderDrawer(true));
      finishMotion();

      rerender(renderDrawer(false));
      expect(container.querySelector('.rc-drawer-content-wrapper')).toHaveClass(
        'bamboo-leave',
      );
      const second = createTrigger('trigger-reopen');
      expect(document.activeElement).toBe(second);
      rerender(renderDrawer(true));
      finishMotion();

      rerender(renderDrawer(false));
      finishMotion();

      expect(document.activeElement).toBe(second);
    });

    it('restores focus when closing during enter with focus in a child portal', () => {
      const trigger = createTrigger('trigger-interrupted-enter');
      const motion = { motionName: 'bamboo', motionDeadline: 100 };
      const renderDrawer = (open: boolean) => (
        <Drawer open={open} getContainer={false} motion={motion}>
          {ReactDOM.createPortal(
            <input aria-label="Portal input" />,
            document.body,
          )}
        </Drawer>
      );

      const { container, getByRole, rerender } = render(renderDrawer(true));
      expect(container.querySelector('.rc-drawer-content-wrapper')).toHaveClass(
        'bamboo-appear',
      );
      const input = getByRole('textbox', { name: 'Portal input' });
      act(() => {
        input.focus();
      });
      expect(document.activeElement).toBe(input);

      rerender(renderDrawer(false));
      finishMotion();

      expect(document.activeElement).toBe(trigger);
    });

    it('restores focus after closing with focus in a child portal', () => {
      const trigger = createTrigger('trigger-portal');
      const content = ReactDOM.createPortal(
        <input aria-label="Portal input" />,
        document.body,
      );
      const renderDrawer = (open: boolean) => (
        <Drawer open={open} destroyOnHidden getContainer={false}>
          {content}
        </Drawer>
      );

      const { getByRole, queryByRole, rerender } = render(renderDrawer(true));
      act(() => {
        jest.runAllTimers();
      });

      const input = getByRole('textbox', { name: 'Portal input' });
      act(() => {
        input.focus();
      });
      expect(document.activeElement).toBe(input);

      rerender(renderDrawer(false));
      act(() => {
        jest.runAllTimers();
      });

      expect(queryByRole('textbox', { name: 'Portal input' })).toBeNull();
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

    it('restores focus to the last outside element focused while open', () => {
      createTrigger('trigger-open');
      const outside = document.createElement('button');
      outside.id = 'trigger-outside';
      document.body.appendChild(outside);
      const renderDrawer = (open: boolean) => (
        <Drawer
          open={open}
          getContainer={false}
          mask={false}
          focusTrap={false}
          autoFocus={false}
        >
          <input aria-label="Drawer input" />
        </Drawer>
      );

      const { getByRole, rerender } = render(renderDrawer(true));
      outside.focus();
      getByRole('textbox', { name: 'Drawer input' }).focus();

      rerender(renderDrawer(false));
      finishMotion();

      expect(document.activeElement).toBe(outside);
    });

    it.each([true, false])(
      'falls back after a sibling drawer closes (destroyOnHidden: %s)',
      destroyOnHidden => {
        const trigger = createTrigger('trigger-outer');
        const renderDrawers = (firstOpen: boolean, secondOpen: boolean) => (
          <>
            <Drawer open={firstOpen} getContainer={false}>
              <button>Open second drawer</button>
            </Drawer>
            <Drawer
              open={secondOpen}
              destroyOnHidden={destroyOnHidden}
              getContainer={false}
              styles={{ wrapper: { display: secondOpen ? undefined : 'none' } }}
            >
              <input aria-label="Second drawer input" />
            </Drawer>
          </>
        );

        const { getByRole, rerender } = render(renderDrawers(true, false));
        const secondTrigger = getByRole('button', {
          name: 'Open second drawer',
        });
        secondTrigger.focus();

        rerender(renderDrawers(true, true));
        const input = getByRole('textbox', { name: 'Second drawer input' });
        input.focus();

        rerender(renderDrawers(true, false));
        if (destroyOnHidden) {
          expect(input).not.toBeInTheDocument();
        } else {
          expect(input).toBeInTheDocument();
          expect(input).not.toBeVisible();
        }
        expect(document.activeElement).toBe(secondTrigger);

        rerender(renderDrawers(false, false));
        expect(document.activeElement).toBe(trigger);
      },
    );

    it('records an outside trigger that stops focus propagation', () => {
      createTrigger('trigger-before-stopped-focus');
      const renderDrawer = (open: boolean) => (
        <>
          <button onFocus={event => event.stopPropagation()}>Trigger</button>
          <Drawer open={open} getContainer={false} />
        </>
      );

      const { getByRole, rerender } = render(renderDrawer(false));
      const trigger = getByRole('button', { name: 'Trigger' });
      trigger.focus();

      rerender(renderDrawer(true));
      expect(document.activeElement).not.toBe(trigger);
      rerender(renderDrawer(false));

      expect(document.activeElement).toBe(trigger);
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

import { cleanup, fireEvent, render, act } from '@testing-library/react';
import KeyCode from 'rc-util/lib/KeyCode';
import React from 'react';
import type { DrawerProps } from '../src';
import Drawer from '../src';

describe('rc-drawer-menu', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('single drawer', () => {
    const { unmount } = render(<Drawer open />);
    const drawer = document.querySelector('.rc-drawer');
    expect(drawer).toBeTruthy();
    expect(document.body.contains(drawer)).toBeTruthy();
    unmount();
  });

  it('switch open drawer', () => {
    const { rerender } = render(<Drawer />);
    expect(document.querySelector('.rc-drawer')).toBeFalsy();

    rerender(<Drawer open />);
    expect(document.querySelector('.rc-drawer')).toBeTruthy();

    rerender(<Drawer />);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelector('.rc-drawer-content-hidden')).toBeTruthy();
  });

  describe('push', () => {
    const placementList: {
      placement: DrawerProps['placement'];
      transform: string;
    }[] = [
      {
        placement: 'left',
        transform: 'translateX(903px)',
      },
      {
        placement: 'right',
        transform: 'translateX(-903px)',
      },
      {
        placement: 'top',
        transform: 'translateY(903px)',
      },
      {
        placement: 'bottom',
        transform: 'translateY(-903px)',
      },
    ];

    placementList.forEach(({ placement, transform }) => {
      it(placement, () => {
        const { unmount } = render(
          <Drawer
            push={{ distance: 903 }}
            rootClassName="outer"
            open
            placement={placement}
          >
            <Drawer open />
          </Drawer>,
        );

        expect(
          document.body
            .querySelector('.outer')
            .querySelector('.rc-drawer-content-wrapper'),
        ).toHaveStyle({
          transform,
        });

        expect(document.body).toHaveStyle({
          overflow: 'hidden',
        });

        unmount();

        expect(document.body).not.toHaveStyle({
          overflow: 'hidden',
        });
      });
    });

    it('disable push', () => {
      const { container } = render(
        <Drawer push={false} open getContainer={false}>
          <Drawer open />
        </Drawer>,
      );

      expect(container.querySelector('.rc-drawer-content-wrapper')).toHaveStyle(
        {
          transform: '',
        },
      );
    });
  });

  describe('mask', () => {
    it('mask false not lock body scroll', () => {
      const { unmount } = render(<Drawer open mask={false} />);
      const drawer = document.querySelector('.rc-drawer');
      expect(drawer).toBeTruthy();
      expect(document.body.contains(drawer)).toBeTruthy();
      expect(document.body.style.overflow).toBe('');
      unmount();
    });

    it('maskClosable', () => {
      const onClose = jest.fn();
      const { container } = render(
        <Drawer open onClose={onClose} getContainer={false} />,
      );
      fireEvent.click(container.querySelector('.rc-drawer-mask'));
      expect(onClose).toHaveBeenCalled();
    });

    it('maskClosable false', () => {
      const onClose = jest.fn();
      const { container } = render(
        <Drawer
          open
          onClose={onClose}
          getContainer={false}
          maskClosable={false}
        />,
      );
      fireEvent.click(container.querySelector('.rc-drawer-mask'));
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  it('forceRender', () => {
    render(<Drawer forceRender />);
    expect(document.querySelector('.rc-drawer')).toBeTruthy();
  });
  it('destroyOnClose', () => {
    const { rerender } = render(<Drawer destroyOnClose open />);
    expect(document.querySelector('.rc-drawer')).toBeTruthy();
    rerender(<Drawer destroyOnClose />);
    expect(document.querySelector('.rc-drawer')).toBeFalsy();
  });

  describe('placement', () => {
    (['left', 'right', 'top', 'bottom'] as const).forEach(placement => {
      it(placement, () => {
        render(<Drawer placement={placement} open />);
        expect(document.querySelector(`.rc-drawer-${placement}`)).toBeTruthy();
      });
    });

    it('change placement', () => {
      const { rerender } = render(<Drawer placement="left" open />);
      expect(document.querySelector(`.rc-drawer-left`)).toBeTruthy();

      rerender(<Drawer placement="right" open />);
      expect(document.querySelector(`.rc-drawer-right`)).toBeTruthy();
    });
  });

  describe('getContainer', () => {
    it('element', () => {
      const holder = document.createElement('div');
      render(<Drawer open getContainer={holder} />);
      expect(holder.querySelector('.rc-drawer')).toBeTruthy();
    });

    it('false', () => {
      const { container } = render(
        <div className="holder">
          <Drawer getContainer={false} open />
        </div>,
      );

      expect(
        container.querySelector('.holder').querySelector('.rc-drawer'),
      ).toBeTruthy();
    });

    it('function', () => {
      const holder = document.createElement('div');
      render(<Drawer open getContainer={() => holder} />);
      expect(holder.querySelector('.rc-drawer')).toBeTruthy();
    });
  });

  it('contentWrapperStyle', () => {
    render(<Drawer contentWrapperStyle={{ background: '#f00' }} open />);

    expect(document.querySelector('.rc-drawer-content-wrapper')).toHaveStyle({
      background: '#f00',
    });
  });

  it('autoFocus', async () => {
    const { container } = render(
      <Drawer autoFocus open getContainer={false} />,
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(container.contains(document.activeElement)).toBeTruthy();
  });

  it('tab should always in the content', () => {
    const { container } = render(
      <Drawer open getContainer={false}>
        <div>Hello World</div>
      </Drawer>,
    );

    const list = Array.from(
      container.querySelector('.rc-drawer-content').children,
    ) as HTMLElement[];

    const firstSentinel = list[0];
    const lastSentinel = list[2];

    // First shift to last
    firstSentinel.focus();
    fireEvent.keyDown(firstSentinel, {
      shiftKey: true,
      keyCode: KeyCode.TAB,
      which: KeyCode.TAB,
    });
    expect(document.activeElement).toBe(lastSentinel);

    // Last tab to first
    fireEvent.keyDown(lastSentinel, {
      keyCode: KeyCode.TAB,
      which: KeyCode.TAB,
    });
    expect(document.activeElement).toBe(firstSentinel);
  });

  describe('keyboard', () => {
    it('ESC to exit', () => {
      const onClose = jest.fn();
      const { container } = render(
        <Drawer open getContainer={false} onClose={onClose} />,
      );
      fireEvent.keyDown(container.querySelector('.rc-drawer-content'), {
        keyCode: KeyCode.ESC,
      });
      expect(onClose).toHaveBeenCalled();
    });

    it('disable ESC to exit', () => {
      const onClose = jest.fn();
      const { container } = render(
        <Drawer open getContainer={false} onClose={onClose} keyboard={false} />,
      );
      fireEvent.keyDown(container.querySelector('.rc-drawer-content'), {
        keyCode: KeyCode.ESC,
      });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  it('zIndex', () => {
    const { container } = render(
      <Drawer zIndex={93} open getContainer={false} />,
    );

    expect(container.querySelector('.rc-drawer-mask')).toHaveStyle({
      zIndex: 93,
    });
    expect(container.querySelector('.rc-drawer-content-wrapper')).toHaveStyle({
      zIndex: 93,
    });
  });
});

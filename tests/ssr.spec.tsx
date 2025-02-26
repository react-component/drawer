import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import React from 'react';
import Drawer from '../src';
// import canUseDom from '@rc-component/util/lib/Dom/canUseDom'

global.canUseDom = true;

jest.mock('@rc-component/util/lib/Dom/canUseDom', () => {
  // const canUseDom = jest.requireActual('@rc-component/util/lib/Dom/canUseDom');
  return () => global.canUseDom;
});

describe('SSR', () => {
  beforeEach(() => {
    global.canUseDom = true;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('hydrate should not crash', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const Demo = () => (
      <Drawer open>
        <div className="bamboo" />
      </Drawer>
    );

    global.canUseDom = false;
    const html = renderToString(<Demo />);

    expect(html).toBeFalsy();

    global.canUseDom = true;

    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    render(<Demo />, { container, hydrate: true });

    expect(errSpy).toHaveBeenCalledWith(
      "Warning: Drawer with 'open' in SSR is not work since no place to createPortal. Please move to 'useEffect' instead.",
    );
    expect(errSpy).toBeCalledTimes(1);

    errSpy.mockRestore();
  });

  // Since we use `useLayoutEffect` to avoid SSR warning.
  // This may affect ref call. Let's check this also.
  it('should not block ref', done => {
    const Demo = ({ open }: any = {}) => {
      const ref = React.useRef<HTMLDivElement>(null);

      React.useEffect(() => {
        if (open) {
          expect(ref.current).toBeTruthy();
          done();
        }
      }, [open]);

      return (
        <Drawer open={open}>
          <div ref={ref} className="bamboo" />
        </Drawer>
      );
    };

    const { rerender } = render(<Demo />);

    rerender(<Demo open />);
  });
});

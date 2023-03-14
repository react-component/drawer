import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import React from 'react';
import Drawer from '../src';
// import canUseDom from 'rc-util/lib/Dom/canUseDom'

global.canUseDom = true;

jest.mock('rc-util/lib/Dom/canUseDom', () => {
  // const canUseDom = jest.requireActual('rc-util/lib/Dom/canUseDom');
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

    expect(errSpy).not.toHaveBeenCalled();

    errSpy.mockRestore();
  });
});

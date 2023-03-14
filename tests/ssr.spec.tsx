import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom';
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
    const Demo = () => (
      <Drawer open>
        <div className="bamboo" />
      </Drawer>
    );

    global.canUseDom = false;
    const html = renderToString(<Demo />);

    console.log(html);

    global.canUseDom = true;

    const container = document.createElement('div');
    hydrateRoot(container, <Demo />);
  });
});

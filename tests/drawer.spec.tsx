import React, { useRef } from 'react';
import Drawer from '../src/';
import type { IDrawerProps } from '../src/IDrawerPropTypes';
import { cleanup, render } from '@testing-library/react';

const DrawerTesterRef = (props: IDrawerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div>
      <div ref={containerRef} className="main" />
      <Drawer getContainer={() => containerRef.current} {...props}>
        <p className="text">Here is content of Drawer</p>
      </Drawer>
    </div>
  );
};

const DrawerTesterDom = (props: IDrawerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div>
      <div ref={containerRef} className="main" />
      {open && (
        <Drawer getContainer={() => containerRef.current} {...props}>
          <p className="text">Here is content of Drawer</p>
        </Drawer>
      )}
    </div>
  );
};

describe('Drawer', () => {
  afterEach(() => {
    cleanup();
  });
  it('render function', () => {
    render(<DrawerTesterRef open />);
    expect(document.body.children[0]).toMatchSnapshot();
  });

  it('render dom', () => {
    const { rerender } = render(<DrawerTesterDom />);
    rerender(<DrawerTesterDom open />);
    expect(document.body.children[0]).toMatchSnapshot();
  });

  it('render boolean', () => {
    render(<DrawerTesterRef open getContainer={false} />);
    expect(document.body.children[0]).toMatchSnapshot();
  });
});

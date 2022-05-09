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

const DrawerTesterBoolean = props => (
  <div>
    <Drawer {...props} open={true} getContainer={false}>
      <p className="text">Here is content of Drawer</p>
    </Drawer>
  </div>
);

describe('Drawer', () => {
  afterEach(() => {
    cleanup();
  });
  it('render function', () => {
    const { container } = render(<DrawerTesterRef open />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('render dom', () => {
    const { container, rerender } = render(<DrawerTesterDom />);
    rerender(<DrawerTesterDom open />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('render boolean', () => {
    const { container } = render(
      <DrawerTesterBoolean open getContainer={false} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

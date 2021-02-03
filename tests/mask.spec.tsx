import { mount } from 'enzyme';
import * as React from 'react';
import Drawer from '../src';

describe('Drawer Mask', () => {
  it('show mask', () => {
    const wrapper = mount(<Drawer open />);

    expect(document.body.className).toBe('ant-scrolling-effect');

    wrapper.setProps({
      open: false,
    });

    expect(document.body.className).toBe('');
  });

  it('no mask', () => {
    const wrapper = mount(<Drawer open showMask={false} />);

    expect(document.body.className).toBe('');

    wrapper.setProps({
      open: false,
    });

    expect(document.body.className).toBe('');
  });
});

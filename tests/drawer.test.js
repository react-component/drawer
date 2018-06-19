// eslint-disable react/no-multi-comp
import React from 'react';
import { mount } from 'enzyme';
import Drawer from '../src';

jest.mock('rc-util/lib/Portal');

class DrawerTesterRef extends React.Component {
  getContainer = () => {
    return this.container;
  };
  saveContainer = container => {
    this.container = container;
  };
  render() {
    return (
      <div>
        <div ref={this.saveContainer} className="main"/>
        <Drawer {...this.props} open getContainer={this.getContainer}>
          <p className="text">Here is content of Drawer</p>
        </Drawer>
      </div>
    );
  }
}
/* eslint react/no-multi-comp: 0 */
class DrawerTesterDom extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }
  componentDidMount() {
    this.setState({ visible: true }); // eslint-disable-line react/no-did-mount-set-state
  }
  getContainer = () => {
    return this.container;
  };
  saveContainer = container => {
    this.container = container;
  };
  render() {
    return (
      <div>
        <div ref={this.saveContainer} className="main"/>
        {this.state.visible ? (
          <Drawer {...this.props} open getContainer={this.getContainer()}>
            <p className="text">Here is content of Drawer</p>
          </Drawer>
        ) : null}
      </div>
    );
  }
}

/* eslint react/no-multi-comp: 0 */
class DrawerTesterString extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }
  componentDidMount() {
    this.setState({ visible: true }); // eslint-disable-line react/no-did-mount-set-state
  }
  getContainer = () => {
    return document.getElementById('test');
  };
  render() {
    return (
      <div>
        <div id="test"/>
        {this.state.visible ? (
          <Drawer {...this.props} open getContainer={this.getContainer()}>
            <p className="text">Here is content of Drawer</p>
          </Drawer>
        ) : null}
      </div>
    );
  }
}

describe('Drawer', () => {
  it('render function', () => {
    const wrapper = mount(<DrawerTesterRef />);
    const text = wrapper.find('.drawer-content .text').getDOMNode();
    expect(text.innerHTML).toBe('Here is content of Drawer');
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('render dom', () => {
    const wrapper = mount(<DrawerTesterDom />);
    const text = wrapper.find('.drawer-content .text').getDOMNode();
    expect(text.innerHTML).toBe('Here is content of Drawer');
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('render string', () => {
    const wrapper = mount(<DrawerTesterString />);
    const drawerContent = wrapper.find('#test .drawer-content-wrapper');
    expect(!!drawerContent).toBe(true);
    const text = wrapper.find('.text').getDOMNode();
    expect(text.innerHTML).toBe('Here is content of Drawer');
    expect(wrapper.render()).toMatchSnapshot();
  });
});

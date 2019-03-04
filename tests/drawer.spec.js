// eslint-disable react/no-multi-comp
import React from 'react';
import { mount } from 'enzyme';
import Drawer from '../src/index';

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
        <div ref={this.saveContainer} className="main" />
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
    const { visible } = this.state;
    return (
      <div>
        <div ref={this.saveContainer} className="main" />
        {visible ? (
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
    const { visible } = this.state;
    return (
      <div>
        {visible ? (
          <Drawer {...this.props} open getContainer={this.getContainer()}>
            <p className="text">Here is content of Drawer</p>
          </Drawer>
        ) : null}
      </div>
    );
  }
}

/* eslint react/no-multi-comp: 0 */
class DrawerTesterBoolean extends React.Component {
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
    const { visible } = this.state;
    return (
      <div>
        {visible ? (
          <Drawer {...this.props} open getContainer={false}>
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
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('render dom', () => {
    const wrapper = mount(<DrawerTesterDom />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('render string', () => {
    const wrapper = mount(<DrawerTesterString />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('render string', () => {
    const wrapper = mount(<DrawerTesterString />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('render boolean', () => {
    const wrapper = mount(<DrawerTesterBoolean />);
    expect(wrapper.render()).toMatchSnapshot();
  });
});

/* eslint-disable max-classes-per-file */
// eslint-disable react/no-multi-comp
import { mount } from 'enzyme';
import * as React from 'react';
import Drawer from '../src/';
import type { IDrawerProps } from '../src/IDrawerPropTypes';
import toJson from 'enzyme-to-json';

class DrawerTesterRef extends React.Component {
  public container: HTMLDivElement;
  public getContainer = () => {
    return this.container;
  };
  public saveContainer = (container: HTMLDivElement) => {
    this.container = container;
  };
  public render() {
    return (
      <div>
        <div ref={this.saveContainer} className="main" />
        <Drawer {...this.props} open={true} getContainer={this.getContainer}>
          <p className="text">Here is content of Drawer</p>
        </Drawer>
      </div>
    );
  }
}
/* eslint react/no-multi-comp: 0 */

interface IState {
  visible: boolean;
}
// tslint:disable-next-line:max-classes-per-file
class DrawerTesterDom extends React.Component<IDrawerProps, IState> {
  public container: HTMLDivElement;
  constructor(props: IDrawerProps) {
    super(props);
    this.state = { visible: false };
  }
  public componentDidMount() {
    this.setState({ visible: true }); // eslint-disable-line react/no-did-mount-set-state
  }
  public getContainer = () => {
    return this.container;
  };
  public saveContainer = (container: HTMLDivElement) => {
    this.container = container;
  };
  public render() {
    return (
      <div>
        <div ref={this.saveContainer} className="main" />
        {this.state.visible ? (
          <Drawer
            {...this.props}
            open={true}
            getContainer={this.getContainer()}
          >
            <p className="text">Here is content of Drawer</p>
          </Drawer>
        ) : null}
      </div>
    );
  }
}

/* eslint react/no-multi-comp: 0 */
// tslint:disable-next-line:max-classes-per-file
const DrawerTesterBoolean = props => (
  <div>
    <Drawer {...props} open={true} getContainer={false}>
      <p className="text">Here is content of Drawer</p>
    </Drawer>
  </div>
);

describe('Drawer', () => {
  it('render function', () => {
    const wrapper = mount(<DrawerTesterRef />);
    expect(toJson(wrapper.render())).toMatchSnapshot();
  });

  it('render dom', () => {
    const wrapper = mount(<DrawerTesterDom />);
    expect(toJson(wrapper.render())).toMatchSnapshot();
  });

  it('render boolean', () => {
    const wrapper = mount(<DrawerTesterBoolean />);
    expect(toJson(wrapper.render())).toMatchSnapshot();
  });
});

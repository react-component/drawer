interface IGlobal extends NodeJS.Global {
  requestAnimationFrame: (time: number) => void;
}
(global as IGlobal).requestAnimationFrame =
  (global as IGlobal).requestAnimationFrame ||
  function requestAnimationFrame(cb: () => void) {
    return setTimeout(cb, 0);
  };

const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });

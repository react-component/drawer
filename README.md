# rc-drawer-menu
---

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rc-drawer-menu.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-drawer-menu
[travis-image]: https://img.shields.io/travis/ant-motion/drawer-menu.svg?style=flat-square
[travis-url]: https://travis-ci.org/ant-motion/drawer-menu
[coveralls-image]: https://img.shields.io/coveralls/ant-motion/drawer-menu.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/ant-motion/drawer-menu?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/ant-motion/drawer-menu.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/ant-motion/drawer-menu
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rc-drawer-menu.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-drawer-menu

## Example

http://ant-motion.github.io/drawer-menu/examples/

## Usage

```js
import Drawer from 'rc-drawer-menu';
import React from 'react';
import ReactDom from 'react-dom';

ReactDom.render(
  <Drawer>
    {menu children}
  </Drawer>
, mountNode);
```

## Install

[![rc-drawer-menu](https://nodei.co/npm/rc-drawer-menu.png)](https://npmjs.org/package/rc-drawer-menu)

## Browser Support

|![IE](https://github.com/alrra/browser-logos/blob/master/src/edge/edge_48x48.png?raw=true) | ![Chrome](https://github.com/alrra/browser-logos/blob/master/src/chrome/chrome_48x48.png?raw=true) | ![Firefox](https://github.com/alrra/browser-logos/blob/master/src/firefox/firefox_48x48.png?raw=true) | ![Opera](https://github.com/alrra/browser-logos/blob/master/src/opera/opera_48x48.png?raw=true) | ![Safari](https://github.com/alrra/browser-logos/blob/master/src/safari/safari_48x48.png?raw=true)|
| --- | --- | --- | --- | --- |
| IE 10+ ✔ | Chrome 31.0+ ✔ | Firefox 31.0+ ✔ | Opera 30.0+ ✔ | Safari 7.0+ ✔ |

## API

| props      | type           | default | description    |
|------------|----------------|---------|----------------|
| className       | string | `drawer` | - |
| openClassName | string | `drawer-open` | open className |
| wrapperClassName | string | null | wrapper class name |
| iconChild   | boolean / ReactElement / Array | true | true or false or ReactElement or Array(ReactElement, ReactElement) => [ close, open ] |
| open        | boolean  | false |  open or close menu  |
| defaultOpen | boolean  | false | default open menu |
| width       |  string   |  `60vw` | children width |
| placement  | string   |  `left` | `left` or `right` |
| level     | string or array | `all` | With the drawer level element. `all`/ null / className / id / tagName / array |
| levelTransition | string | `transform .3s cubic-bezier(0.78, 0.14, 0.15, 0.86)` | level css transition |
| parent    | string | `body` | parent element. if is `null` use React.creactElement  | 
| onChange  | func | null | change callback(open) |
| onMaskClick | func | null | mask close click function |
| onIconClick | func | nul  | icon click function |

> 0.5 onSwitch split into `onMaskClick` `onIconClick`;

## Development

```
npm install
npm start
```

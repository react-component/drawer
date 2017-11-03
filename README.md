# rc-drawer
---

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rc-drawer.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-drawer
[travis-image]: https://img.shields.io/travis/ant-motion/drawer.svg?style=flat-square
[travis-url]: https://travis-ci.org/ant-motion/drawer
[coveralls-image]: https://img.shields.io/coveralls/ant-motion/drawer.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/ant-motion/drawer?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/ant-motion/drawer.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/ant-motion/drawer
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rc-drawer.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-drawer

## Example

http://ant-motion.github.io/drawer/examples/

## Usage

```js
import Drawer from 'rc-drawer';
import React from 'react';
import ReactDom from 'react-dom';

ReactDom.render(
  <Drawer>
    {menu children}
  </Drawer>
, mountNode);
```

## Install

[![rc-drawer](https://nodei.co/npm/rc-drawer.png)](https://npmjs.org/package/rc-drawer)

## Browser Support

|![IE](https://raw.github.com/alrra/browser-logos/master/internet-explorer/internet-explorer_48x48.png) | ![Chrome](https://raw.github.com/alrra/browser-logos/master/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/firefox/firefox_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/safari/safari_48x48.png)|
| --- | --- | --- | --- | --- |
| IE 8+ ✔ | Chrome 31.0+ ✔ | Firefox 31.0+ ✔ | Opera 30.0+ ✔ | Safari 7.0+ ✔ |

## API

| props      | type           | default | description    |
|------------|----------------|---------|----------------|
| className       | string | `drawer` | - |
| openClassName | string | `drawer-open` | open className |
| wrapperClassName | string | null | wrapper class name |
| width       |  string   |  `60vw` | children width |
| placement  | string   |  `left` | `left` or `right` |
| level     | string or array | `all` | With the drawer level element. `all` / className / id / tagName / array |
| levelTransition | string | `transform .3s cubic-bezier(0.78, 0.14, 0.15, 0.86)` | level css transition |
| parent    | string | `body` | parent element. | 


## Development

```
npm install
npm start
```

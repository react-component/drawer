<div align="center">
  <h1>@rc-component/drawer</h1>
  <img alt="Ant Design" height="32" src="https://gw.alipayobjects.com/zos/bmw-prod/ae669a89-0c24-40ff-a91d-2b83497170f6.svg" />
  <p>🚪 Accessible React drawer component with portal rendering, masks, nested push behavior, keyboard close handling, focus management, and optional resizable panels.</p>

  <p>
    <a href="https://npmjs.org/package/@rc-component/drawer"><img alt="NPM version" src="https://img.shields.io/npm/v/@rc-component/drawer.svg?style=flat-square"></a>
    <a href="https://npmjs.org/package/@rc-component/drawer"><img alt="npm downloads" src="https://img.shields.io/npm/dm/@rc-component/drawer.svg?style=flat-square"></a>
    <a href="https://github.com/react-component/drawer/actions/workflows/react-component-ci.yml"><img alt="build status" src="https://github.com/react-component/drawer/actions/workflows/react-component-ci.yml/badge.svg"></a>
    <a href="https://codecov.io/gh/react-component/drawer"><img alt="codecov" src="https://codecov.io/gh/react-component/drawer/branch/master/graph/badge.svg"></a>
    <a href="https://bundlephobia.com/package/@rc-component/drawer"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@rc-component/drawer?style=flat-square"></a>
    <a href="https://github.com/umijs/dumi"><img alt="dumi" src="https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square"></a>
  </p>
</div>

<p align="center">
  <sub>
    <a href="https://ant.design">
      <img alt="Ant Design" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" height="16">
    </a>
    Part of the <a href="https://ant.design">Ant Design</a> ecosystem.
  </sub>
</p>

## Highlights

| Area        | Support                                                |
| ----------- | ------------------------------------------------------ |
| Placement   | Left, right, top, and bottom drawers                   |
| Interaction | Mask click, keyboard close, focus management           |
| Composition | Nested drawers with push behavior                      |
| Layout      | Fixed drawer size, resizable panels, custom containers |
| Motion      | Configurable open and close transitions                |

## Install

```bash
npm install @rc-component/drawer
```

## Usage

```tsx | pure
import Drawer from '@rc-component/drawer';
import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <Drawer open={open} onClose={() => setOpen(false)}>
        Drawer content
      </Drawer>
    </>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
```

## Examples

Visit the [online examples](https://drawer-react-component.vercel.app/) for placement, container, nested drawer, mask, force render, and resizable demos.

## API

| Property               | Type                                                                                                     | Default              | Description                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------- |
| afterOpenChange        | `(open: boolean) => void`                                                                                | -                    | Called after the open or close animation ends.                                  |
| autoFocus              | boolean                                                                                                  | true                 | Whether to focus the drawer after it opens.                                     |
| children               | ReactNode                                                                                                | -                    | Drawer content.                                                                 |
| className              | string                                                                                                   | -                    | Class name for the drawer panel.                                                |
| classNames             | `{ mask?: string; wrapper?: string; section?: string; dragger?: string }`                                | -                    | Semantic class names for internal drawer elements.                              |
| defaultSize            | number \| string                                                                                         | -                    | Default size for uncontrolled resizable drawer.                                 |
| destroyOnHidden        | boolean                                                                                                  | false                | Unmount the drawer after it is fully closed.                                    |
| drawerRender           | `(node: ReactNode) => ReactNode`                                                                         | -                    | Customize rendered drawer panel content.                                        |
| focusTrap              | boolean                                                                                                  | -                    | Whether to trap focus inside the drawer.                                        |
| focusTriggerAfterClose | boolean                                                                                                  | true                 | Whether to return focus to the trigger after closing.                           |
| forceRender            | boolean                                                                                                  | false                | Render the drawer before it is opened.                                          |
| getContainer           | HTMLElement \| `() => HTMLElement` \| string \| false                                                    | `body`               | Return the mount node. Set to `false` to render inline.                         |
| height                 | number \| string                                                                                         | -                    | Deprecated. Use `size` for top or bottom placement.                             |
| keyboard               | boolean                                                                                                  | true                 | Whether pressing Esc closes the drawer.                                         |
| mask                   | boolean                                                                                                  | true                 | Whether to show the mask.                                                       |
| maskClassName          | string                                                                                                   | -                    | Class name for the mask.                                                        |
| maskClosable           | boolean                                                                                                  | true                 | Whether clicking the mask closes the drawer.                                    |
| maskMotion             | CSSMotionProps                                                                                           | -                    | Motion config for the mask.                                                     |
| maskStyle              | CSSProperties                                                                                            | -                    | Style for the mask.                                                             |
| maxSize                | number                                                                                                   | -                    | Maximum size for a resizable drawer.                                            |
| motion                 | CSSMotionProps \| `(placement: Placement) => CSSMotionProps`                                             | -                    | Motion config for the drawer panel.                                             |
| onClose                | `(event: MouseEvent \| KeyboardEvent) => void`                                                           | -                    | Called when the drawer requests to close.                                       |
| open                   | boolean                                                                                                  | false                | Whether the drawer is open.                                                     |
| panelRef               | Ref<HTMLDivElement>                                                                                      | -                    | Ref for the drawer panel.                                                       |
| placement              | `left` \| `right` \| `top` \| `bottom`                                                                   | `right`              | Drawer placement.                                                               |
| prefixCls              | string                                                                                                   | `rc-drawer`          | Class name prefix.                                                              |
| push                   | boolean \| `{ distance?: number \| string }`                                                             | -                    | Push parent drawers when nested.                                                |
| resizable              | boolean \| `{ onResize?: (size: number) => void; onResizeStart?: () => void; onResizeEnd?: () => void }` | false                | Enable resizing and optional resize callbacks.                                  |
| rootClassName          | string                                                                                                   | -                    | Class name for the root wrapper.                                                |
| rootStyle              | CSSProperties                                                                                            | -                    | Style for the root wrapper.                                                     |
| size                   | number \| string                                                                                         | `378` for left/right | Drawer size. Controls width for left/right and height for top/bottom placement. |
| style                  | CSSProperties                                                                                            | -                    | Style for the drawer panel.                                                     |
| styles                 | `{ mask?: CSSProperties; wrapper?: CSSProperties; section?: CSSProperties; dragger?: CSSProperties }`    | -                    | Semantic styles for internal drawer elements.                                   |
| width                  | number \| string                                                                                         | -                    | Deprecated. Use `size` for left or right placement.                             |
| zIndex                 | number                                                                                                   | -                    | Root wrapper z-index.                                                           |

Mouse and keyboard event handlers such as `onClick`, `onMouseEnter`, `onMouseLeave`, `onKeyDown`, and `onKeyUp` are passed to the drawer panel.

## Development

```bash
npm install
npm start
```

Common commands:

```bash
npm run lint
npm test
npm run tsc
npm run compile
```

## Release

This package uses `prepublishOnly` to run the compile and release checks before publishing:

```bash
npm publish
```

The publish lifecycle runs:

```bash
npm run compile && rc-np
```

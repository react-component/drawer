<div align="center">
  <h1>@rc-component/drawer</h1>
  <p><sub><a href="https://ant.design"><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /></a> Ant Design 生态的一部分。</sub></p>
  <p>🚪 React 抽屉组件，支持遮罩、动画、自定义容器和语义化样式。</p>

  <p>
    <a href="https://npmjs.org/package/@rc-component/drawer"><img alt="NPM version" src="https://img.shields.io/npm/v/@rc-component/drawer.svg?style=flat-square"></a>
    <a href="https://npmjs.org/package/@rc-component/drawer"><img alt="npm downloads" src="https://img.shields.io/npm/dm/@rc-component/drawer.svg?style=flat-square"></a>
    <a href="https://github.com/react-component/drawer/actions/workflows/react-component-ci.yml"><img alt="build status" src="https://github.com/react-component/drawer/actions/workflows/react-component-ci.yml/badge.svg"></a>
    <a href="https://app.codecov.io/gh/react-component/drawer"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/react-component/drawer/master.svg?style=flat-square"></a>
    <a href="https://bundlephobia.com/package/@rc-component/drawer"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@rc-component/drawer?style=flat-square"></a>
    <a href="https://github.com/umijs/dumi"><img alt="dumi" src="https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square"></a>
  </p>
</div>

<p align="center"><a href="./README.md">English</a> | 简体中文</p>

## 特性

| 范围 | 支持                                     |
| ---- | ---------------------------------------- |
| 位置 | 左、右、上、下四个方向的抽屉             |
| 交互 | 遮罩点击、键盘关闭和焦点管理             |
| 组合 | 支持带 push 行为的嵌套抽屉               |
| 布局 | 固定抽屉尺寸、可调整大小面板和自定义容器 |
| 运动 | 可配置打开和关闭动画                     |

## 安装

```bash
npm install @rc-component/drawer
```

## 使用

```tsx | pure
import Drawer from '@rc-component/drawer';

export default () => (
  <Drawer open onClose={() => {}}>
    Drawer content
  </Drawer>
);
```

## 示例

运行本地 dumi 站点：

```bash
npm install
npm start
```

然后打开 `http://localhost:8000`。

## API

| 参数                   | 类型                                                                                                     | 默认值               | 说明                                             |
| ---------------------- | -------------------------------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------ |
| afterOpenChange        | `(open: boolean) => void`                                                                                | -                    | 打开或关闭动画结束后调用。                       |
| autoFocus              | boolean                                                                                                  | true                 | 抽屉打开后是否聚焦。                             |
| children               | ReactNode                                                                                                | -                    | 抽屉内容。                                       |
| className              | string                                                                                                   | -                    | 抽屉面板的 className。                           |
| classNames             | `{ mask?: string; wrapper?: string; section?: string; dragger?: string }`                                | -                    | 内部抽屉元素的语义 className。                   |
| defaultSize            | number \| string                                                                                         | -                    | 非受控可调整大小抽屉的默认尺寸。                 |
| destroyOnHidden        | boolean                                                                                                  | false                | 抽屉完全关闭后将其卸下。                         |
| drawerRender           | `(node: ReactNode) => ReactNode`                                                                         | -                    | 自定义渲染的抽屉面板内容。                       |
| focusTrap              | boolean                                                                                                  | -                    | 是否将焦点限制在抽屉内。                         |
| focusTriggerAfterClose | boolean                                                                                                  | true                 | 关闭后是否将焦点返回到触发器。                   |
| forceRender            | boolean                                                                                                  | false                | 在抽屉打开之前对其进行渲染。                     |
| getContainer           | HTMLElement \| `() => HTMLElement` \| string \| false                                                    | `body`               | 返回挂载节点。设置为 `false` 时内联渲染。        |
| height                 | number \| string                                                                                         | -                    | 已废弃。顶部或底部位置请使用 `size`。            |
| keyboard               | boolean                                                                                                  | true                 | 按 Esc 是否关闭抽屉。                            |
| mask                   | boolean                                                                                                  | true                 | 是否显示遮罩。                                   |
| maskClassName          | string                                                                                                   | -                    | 掩码的 className。                               |
| maskClosable           | boolean                                                                                                  | true                 | 单击蒙版是否会关闭抽屉。                         |
| maskMotion             | CSSMotionProps                                                                                           | -                    | 遮罩动画配置。                                   |
| maskStyle              | CSSProperties                                                                                            | -                    | 遮罩样式。                                       |
| maxSize                | number                                                                                                   | -                    | 可调整大小的抽屉的最大尺寸。                     |
| motion                 | CSSMotionProps \| `(placement: Placement) => CSSMotionProps`                                             | -                    | 抽屉面板动画配置。                               |
| onClose                | `(event: MouseEvent \| KeyboardEvent) => void`                                                           | -                    | 当抽屉请求关闭时调用。                           |
| open                   | boolean                                                                                                  | false                | 抽屉是否打开。                                   |
| panelRef               | Ref<HTMLDivElement>                                                                                      | -                    | 抽屉面板参考。                                   |
| placement              | `left` \| `right` \| `top` \| `bottom`                                                                   | `right`              | 抽屉位置。                                       |
| prefixCls              | string                                                                                                   | `rc-drawer`          | className 前缀。                                 |
| push                   | boolean \| `{ distance?: number \| string }`                                                             | -                    | 嵌套时推动父抽屉。                               |
| resizable              | boolean \| `{ onResize?: (size: number) => void; onResizeStart?: () => void; onResizeEnd?: () => void }` | false                | 启用调整大小和可选的调整大小回调。               |
| rootClassName          | string                                                                                                   | -                    | 根包装器的 className。                           |
| rootStyle              | CSSProperties                                                                                            | -                    | 根包装器的样式。                                 |
| size                   | number \| string                                                                                         | `378` for left/right | 抽屉尺寸。控制左/右的宽度和顶部/底部放置的高度。 |
| style                  | CSSProperties                                                                                            | -                    | 抽屉面板的样式。                                 |
| styles                 | `{ mask?: CSSProperties; wrapper?: CSSProperties; section?: CSSProperties; dragger?: CSSProperties }`    | -                    | 内部抽屉元素的语义样式。                         |
| width                  | number \| string                                                                                         | -                    | 已废弃。请使用 `size` 进行左侧或右侧放置。       |
| zIndex                 | number                                                                                                   | -                    | 根包装器 z 索引。                                |

鼠标和键盘事件处理程序（例如 `onClick` 、 `onMouseEnter` 、 `onMouseLeave` 、 `onKeyDown` 和 `onKeyUp`）将传递到抽屉面板。

## 本地开发

```bash
npm install
npm start
```

dumi 站点默认运行在 `http://localhost:8000`。

Common commands:

```bash
npm run lint
npm test
npm run tsc
npm run compile
```

## 发布

```bash
npm run prepublishOnly
```

包构建完成后，发布流程由 `@rc-component/np` 通过 `rc-np` 命令处理。

## 许可证

@rc-component/drawer 基于 [MIT](./LICENSE) 许可证发布。

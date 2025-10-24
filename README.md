# rc-drawer

[![NPM version][npm-image]][npm-url] [![dumi](https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square)](https://github.com/umijs/dumi) [![build status][github-actions-image]][github-actions-url] [![codecov](https://codecov.io/gh/react-component/drawer/branch/master/graph/badge.svg)](https://codecov.io/gh/react-component/drawer) [![node version][node-image]][node-url] [![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rc-drawer.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-drawer
[github-actions-image]: https://github.com/react-component/drawer/workflows/CI/badge.svg
[github-actions-url]: https://github.com/react-component/drawer/actions
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rc-drawer.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-drawer

## Example

https://drawer-react-component.vercel.app/

## Usage

### Basic Usage

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

### Advanced JavaScript Examples

#### State Management with Hooks

```js
import React, { useState, useCallback } from 'react';
import Drawer from 'rc-drawer';

const MyDrawerComponent = () => {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState('left');

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handlePlacementChange = useCallback((newPlacement) => {
    setPlacement(newPlacement);
    setOpen(true);
  }, []);

  return (
    <div>
      <button onClick={handleOpen}>Open Drawer</button>
      <div>
        {['left', 'right', 'top', 'bottom'].map(pos => (
          <button
            key={pos}
            onClick={() => handlePlacementChange(pos)}
          >
            {pos}
          </button>
        ))}
      </div>
      
      <Drawer
        open={open}
        onClose={handleClose}
        placement={placement}
        width={400}
        height={300}
        maskClosable
        keyboard
        autoFocus
      >
        <div style={{ padding: 20 }}>
          <h2>Drawer Content</h2>
          <p>This is the drawer content for {placement} placement.</p>
          <button onClick={handleClose}>Close</button>
        </div>
      </Drawer>
    </div>
  );
};

export default MyDrawerComponent;
```

#### Dynamic Content Loading

```js
import React, { useState, useEffect } from 'react';
import Drawer from 'rc-drawer';

const DynamicContentDrawer = () => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadContent = useCallback(async (contentType) => {
    setLoading(true);
    try {
      // Simulate API call
      const response = await fetch(`/api/content/${contentType}`);
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error('Failed to load content:', error);
      setContent({ error: 'Failed to load content' });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOpenWithContent = useCallback((contentType) => {
    setOpen(true);
    loadContent(contentType);
  }, [loadContent]);

  return (
    <div>
      <button onClick={() => handleOpenWithContent('user-profile')}>
        Open User Profile
      </button>
      <button onClick={() => handleOpenWithContent('settings')}>
        Open Settings
      </button>
      
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        width={500}
        afterOpenChange={(isOpen) => {
          console.log('Drawer state changed:', isOpen);
          if (!isOpen) {
            setContent(null); // Clear content when closing
          }
        }}
      >
        <div style={{ padding: 20 }}>
          {loading ? (
            <div>Loading...</div>
          ) : content ? (
            content.error ? (
              <div style={{ color: 'red' }}>{content.error}</div>
            ) : (
              <div>
                <h2>{content.title}</h2>
                <div>{content.body}</div>
              </div>
            )
          ) : null}
        </div>
      </Drawer>
    </div>
  );
};
```

#### Form Integration

```js
import React, { useState } from 'react';
import Drawer from 'rc-drawer';

const FormDrawer = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = useCallback((field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    console.log('Form submitted:', formData);
    
    // Process form data
    // Example: API call, validation, etc.
    
    setOpen(false);
    setFormData({ name: '', email: '', message: '' });
  }, [formData]);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Contact Form</button>
      
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement="right"
        width={400}
        maskClosable={false} // Prevent accidental closure during form filling
      >
        <div style={{ padding: 20 }}>
          <h2>Contact Form</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange('name')}
                style={{ width: '100%', padding: 8 }}
                required
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                style={{ width: '100%', padding: 8 }}
                required
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                value={formData.message}
                onChange={handleInputChange('message')}
                style={{ width: '100%', padding: 8, height: 100 }}
                required
              />
            </div>
            
            <div>
              <button type="submit" style={{ marginRight: 8 }}>
                Submit
              </button>
              <button type="button" onClick={() => setOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Drawer>
    </div>
  );
};
```

#### Resizable Drawer with Custom Handlers

```js
import React, { useState, useCallback } from 'react';
import Drawer from 'rc-drawer';

const ResizableDrawer = () => {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);

  const handleResize = useCallback((size) => {
    setWidth(size);
    console.log('Drawer resized to:', size);
  }, []);

  const handleResizeStart = useCallback(() => {
    setIsResizing(true);
    console.log('Resize started');
  }, []);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    console.log('Resize ended, final width:', width);
    
    // Save width to localStorage
    localStorage.setItem('drawerWidth', width.toString());
  }, [width]);

  // Load saved width on component mount
  React.useEffect(() => {
    const savedWidth = localStorage.getItem('drawerWidth');
    if (savedWidth) {
      setWidth(parseInt(savedWidth, 10));
    }
  }, []);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Resizable Drawer</button>
      <p>Current width: {width}px {isResizing ? '(resizing...)' : ''}</p>
      
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        width={width}
        resizable={{
          onResize: handleResize,
          onResizeStart: handleResizeStart,
          onResizeEnd: handleResizeEnd
        }}
      >
        <div style={{ padding: 20 }}>
          <h2>Resizable Drawer</h2>
          <p>Drag the edge to resize this drawer!</p>
          <p>The width will be saved in localStorage.</p>
          <button onClick={() => setWidth(400)}>Reset to 400px</button>
        </div>
      </Drawer>
    </div>
  );
};
```

### TypeScript Integration

```typescript
import React, { useState, useCallback } from 'react';
import Drawer from 'rc-drawer';
import type { DrawerProps } from 'rc-drawer';

interface CustomDrawerProps extends Omit<DrawerProps, 'children'> {
  title?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const TypedDrawer: React.FC<CustomDrawerProps> = ({
  title,
  footer,
  children,
  ...drawerProps
}) => {
  return (
    <Drawer {...drawerProps}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {title && (
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
            <h3 style={{ margin: 0 }}>{title}</h3>
          </div>
        )}
        
        <div style={{ flex: 1, padding: 20, overflow: 'auto' }}>
          {children}
        </div>
        
        {footer && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #f0f0f0' }}>
            {footer}
          </div>
        )}
      </div>
    </Drawer>
  );
};

// Usage example
const TypeScriptExample: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Typed Drawer</button>
      
      <TypedDrawer
        open={open}
        onClose={handleClose}
        title="User Settings"
        width={500}
        footer={
          <div>
            <button onClick={handleClose}>Cancel</button>
            <button style={{ marginLeft: 8 }}>Save</button>
          </div>
        }
      >
        <p>This is a typed drawer component with custom header and footer.</p>
      </TypedDrawer>
    </div>
  );
};
```

## Install

[![rc-drawer](https://nodei.co/npm/rc-drawer.png)](https://npmjs.org/package/rc-drawer)

## Browser Support

| ![IE](https://github.com/alrra/browser-logos/blob/master/src/edge/edge_48x48.png?raw=true) | ![Chrome](https://github.com/alrra/browser-logos/blob/master/src/chrome/chrome_48x48.png?raw=true) | ![Firefox](https://github.com/alrra/browser-logos/blob/master/src/firefox/firefox_48x48.png?raw=true) | ![Opera](https://github.com/alrra/browser-logos/blob/master/src/opera/opera_48x48.png?raw=true) | ![Safari](https://github.com/alrra/browser-logos/blob/master/src/safari/safari_48x48.png?raw=true) |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| IE 10+ ✔                                                                                  | Chrome 31.0+ ✔                                                                                    | Firefox 31.0+ ✔                                                                                      | Opera 30.0+ ✔                                                                                  | Safari 7.0+ ✔                                                                                     |

## API

| props              | type                                                                        | default                                | description                                                                   |
| ------------------ | --------------------------------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------- |
| className          | string                                                                      | null                                   | -                                                                             |
| classNames         | { mask?: string; content?: string; wrapper?: string; }                      | -                                      | pass className to target area                                                 |
| styles             | { mask?: CSSProperties; content?: CSSProperties; wrapper?: CSSProperties; } | -                                      | pass style to target area                                                     |
| prefixCls          | string                                                                      | 'drawer'                               | prefix class                                                                  |
| width              | string \| number                                                            | null                                   | drawer content wrapper width, drawer level transition width                   |
| height             | string \| number                                                            | null                                   | drawer content wrapper height, drawer level transition height                 |
| defaultWidth       | string \| number                                                            | null                                   | default width for uncontrolled resizable drawer                               |
| defaultHeight      | string \| number                                                            | null                                   | default height for uncontrolled resizable drawer                              |
| open               | boolean                                                                     | false                                  | open or close menu                                                            |
| defaultOpen        | boolean                                                                     | false                                  | default open menu                                                             |
| placement          | string                                                                      | `left`                                 | `left` `top` `right` `bottom`                                                 |
| level              | string \| array                                                             | `all`                                  | With the drawer level element. `all`/ null / className / id / tagName / array |
| levelMove          | number \| array \| func                                                     | null                                   | level move value. default is drawer width                                     |
| duration           | string                                                                      | `.3s`                                  | level animation duration                                                      |
| ease               | string                                                                      | `cubic-bezier(0.78, 0.14, 0.15, 0.86)` | level animation timing function                                               |
| getContainer       | string \| func \| HTMLElement                                               | `body`                                 | Return the mount node for Drawer. if is `null` use React.creactElement        |
| showMask           | boolean                                                                     | true                                   | mask is show                                                                  |
| maskClosable       | boolean                                                                     | true                                   | Clicking on the mask (area outside the Drawer) to close the Drawer or not.    |
| maskStyle          | CSSProperties                                                               | null                                   | mask style                                                                    |
| afterOpenChange    | func                                                                        | null                                   | transition end callback(open)                                                 |
| onClose            | func                                                                        | null                                   | close click function                                                          |
| keyboard           | boolean                                                                     | true                                   | Whether support press esc to close                                            |
| autoFocus          | boolean                                                                     | true                                   | Whether focusing on the drawer after it opened                                |
| resizable          | { onResize?: (size: number) => void; onResizeStart?: () => void; onResizeEnd?: () => void; } | -                                      | Resizable configuration with optional callbacks                                |
| onMouseEnter       | React.MouseEventHandler\<HTMLDivElement\>                                   | -                                      | Trigger when mouse enter drawer panel                                         |
| onMouseOver        | React.MouseEventHandler\<HTMLDivElement\>                                   | -                                      | Trigger when mouse over drawer panel                                          |
| onMouseLeave       | React.MouseEventHandler\<HTMLDivElement\>                                   | -                                      | Trigger when mouse leave drawer panel                                         |
| onClick            | React.MouseEventHandler\<HTMLDivElement\>                                   | -                                      | Trigger when mouse click drawer panel                                         |
| onKeyDown          | React.MouseEventHandler\<HTMLDivElement\>                                   | -                                      | Trigger when mouse keydown on drawer panel                                    |
| onKeyUp            | React.MouseEventHandler\<HTMLDivElement\>                                   | -                                      | Trigger when mouse keyup on drawer panel                                      |

> 2.0 Rename `onMaskClick` -> `onClose`, add `maskClosable`.

## Development

```
npm install
npm start
```

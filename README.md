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

## JavaScript Development Best Practices

### Performance Optimization

#### Lazy Loading and Code Splitting

```js
import React, { lazy, Suspense } from 'react';
import Drawer from 'rc-drawer';

// Lazy load drawer content components
const UserProfile = lazy(() => import('./components/UserProfile'));
const Settings = lazy(() => import('./components/Settings'));
const Dashboard = lazy(() => import('./components/Dashboard'));

const LazyLoadedDrawer = ({ contentType, ...props }) => {
  const getComponent = () => {
    switch (contentType) {
      case 'profile':
        return <UserProfile />;
      case 'settings':
        return <Settings />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <div>Select a content type</div>;
    }
  };

  return (
    <Drawer {...props}>
      <Suspense fallback={<div>Loading...</div>}>
        {getComponent()}
      </Suspense>
    </Drawer>
  );
};
```

#### Memoization for Performance

```js
import React, { memo, useMemo, useCallback } from 'react';
import Drawer from 'rc-drawer';

const OptimizedDrawerContent = memo(({ data, onAction }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: true,
      timestamp: Date.now()
    }));
  }, [data]);

  const handleItemClick = useCallback((itemId) => {
    onAction(itemId);
  }, [onAction]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id} onClick={() => handleItemClick(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
});

// Usage with memoized props
const PerformantDrawer = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);

  const handleAction = useCallback((itemId) => {
    console.log('Action on item:', itemId);
  }, []);

  const memoizedData = useMemo(() => data, [data]);

  return (
    <Drawer open={open} onClose={() => setOpen(false)}>
      <OptimizedDrawerContent 
        data={memoizedData} 
        onAction={handleAction} 
      />
    </Drawer>
  );
};
```

### Event Handling and Interaction

#### Custom Event Handlers

```js
import React, { useState, useRef } from 'react';
import Drawer from 'rc-drawer';

const InteractiveDrawer = () => {
  const [open, setOpen] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const drawerRef = useRef(null);

  const logInteraction = useCallback((type, event) => {
    setInteractions(prev => [...prev, {
      type,
      timestamp: Date.now(),
      target: event.target.tagName
    }]);
  }, []);

  const handleMouseEnter = useCallback((event) => {
    logInteraction('mouseenter', event);
    console.log('Mouse entered drawer');
  }, [logInteraction]);

  const handleMouseLeave = useCallback((event) => {
    logInteraction('mouseleave', event);
    console.log('Mouse left drawer');
  }, [logInteraction]);

  const handleKeyDown = useCallback((event) => {
    logInteraction('keydown', event);
    
    // Custom keyboard shortcuts
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      console.log('Save shortcut triggered');
    }
    
    if (event.key === 'F1') {
      event.preventDefault();
      console.log('Help shortcut triggered');
    }
  }, [logInteraction]);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Interactive Drawer</button>
      
      <Drawer
        ref={drawerRef}
        open={open}
        onClose={() => setOpen(false)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        width={500}
      >
        <div style={{ padding: 20 }}>
          <h2>Interactive Drawer</h2>
          <p>Try moving your mouse and pressing keys (Ctrl+S, F1)</p>
          
          <div style={{ marginTop: 20 }}>
            <h3>Interaction Log:</h3>
            <div style={{ maxHeight: 200, overflow: 'auto' }}>
              {interactions.slice(-10).map((interaction, index) => (
                <div key={index}>
                  {new Date(interaction.timestamp).toLocaleTimeString()}: 
                  {interaction.type} on {interaction.target}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
```

### Accessibility and Internationalization

#### ARIA Support and Screen Reader Compatibility

```js
import React, { useState, useId } from 'react';
import Drawer from 'rc-drawer';

const AccessibleDrawer = ({ title, children, ...props }) => {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <Drawer
      {...props}
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-modal="true"
    >
      <div style={{ padding: 20 }}>
        <h2 id={titleId} style={{ margin: 0, marginBottom: 16 }}>
          {title}
        </h2>
        <div id={descriptionId}>
          {children}
        </div>
        
        {/* Focus trap example */}
        <div style={{ marginTop: 20 }}>
          <button>First focusable element</button>
          <input placeholder="Focusable input" style={{ margin: '0 8px' }} />
          <button>Last focusable element</button>
        </div>
      </div>
    </Drawer>
  );
};

// Internationalization example
const i18nTexts = {
  en: {
    title: 'Settings',
    close: 'Close',
    save: 'Save Changes',
    cancel: 'Cancel'
  },
  es: {
    title: 'Configuración',
    close: 'Cerrar',
    save: 'Guardar Cambios',
    cancel: 'Cancelar'
  },
  fr: {
    title: 'Paramètres',
    close: 'Fermer',
    save: 'Enregistrer',
    cancel: 'Annuler'
  }
};

const InternationalizedDrawer = () => {
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useState('en');

  const texts = i18nTexts[locale];

  return (
    <div>
      <div>
        Language: 
        {Object.keys(i18nTexts).map(lang => (
          <button 
            key={lang} 
            onClick={() => setLocale(lang)}
            style={{ 
              margin: '0 4px',
              fontWeight: locale === lang ? 'bold' : 'normal'
            }}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
      
      <button onClick={() => setOpen(true)}>
        Open {texts.title}
      </button>
      
      <AccessibleDrawer
        open={open}
        onClose={() => setOpen(false)}
        title={texts.title}
        width={400}
      >
        <p>This drawer supports multiple languages and accessibility features.</p>
        
        <div style={{ marginTop: 20 }}>
          <button style={{ marginRight: 8 }}>
            {texts.save}
          </button>
          <button onClick={() => setOpen(false)}>
            {texts.close}
          </button>
        </div>
      </AccessibleDrawer>
    </div>
  );
};
```

### Error Handling and Testing

#### Error Boundaries and Graceful Degradation

```js
import React, { Component } from 'react';
import Drawer from 'rc-drawer';

class DrawerErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Drawer Error:', error, errorInfo);
    
    // Log to error reporting service
    if (typeof window !== 'undefined' && window.errorReporter) {
      window.errorReporter.captureException(error, { extra: errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Drawer {...this.props}>
          <div style={{ padding: 20, textAlign: 'center' }}>
            <h3>Something went wrong</h3>
            <p>We apologize for the inconvenience. Please try again.</p>
            <button onClick={() => this.setState({ hasError: false, error: null })}>
              Retry
            </button>
          </div>
        </Drawer>
      );
    }

    return this.props.children;
  }
}

// Usage with error boundary
const SafeDrawer = ({ children, ...props }) => (
  <DrawerErrorBoundary {...props}>
    {children}
  </DrawerErrorBoundary>
);
```

#### Testing Examples

```js
// Jest + React Testing Library example
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Drawer from 'rc-drawer';

describe('Drawer Component', () => {
  test('should open and close drawer', () => {
    const onClose = jest.fn();
    
    render(
      <Drawer open={true} onClose={onClose}>
        <div>Test content</div>
      </Drawer>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
    
    // Test ESC key functionality
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  test('should handle mask click', () => {
    const onClose = jest.fn();
    
    render(
      <Drawer open={true} onClose={onClose} maskClosable={true}>
        <div>Test content</div>
      </Drawer>
    );

    const mask = document.querySelector('.drawer-mask');
    fireEvent.click(mask);
    expect(onClose).toHaveBeenCalled();
  });

  test('should apply custom styles', () => {
    const customStyles = {
      mask: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
      content: { backgroundColor: 'white' }
    };

    render(
      <Drawer open={true} styles={customStyles}>
        <div>Styled content</div>
      </Drawer>
    );

    const mask = document.querySelector('.drawer-mask');
    expect(mask).toHaveStyle('background-color: rgba(0, 0, 0, 0.8)');
  });
});
```

## Development

### Local Development Setup

```bash
npm install
npm start
```

### Build and Testing Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Type checking (if using TypeScript)
npm run type-check
```

### Project Structure and Architecture

The rc-drawer project follows modern JavaScript development practices:

```text
src/
├── index.ts              # Main entry point
├── Drawer.tsx            # Main drawer component
├── DrawerPanel.tsx       # Drawer panel component
├── DrawerPopup.tsx       # Popup implementation
├── context.ts            # React context for drawer state
├── inter.ts              # Internal utilities
├── util.ts               # Utility functions
└── hooks/
    └── useDrag.ts        # Custom drag functionality hook
```

### Development Workflow

#### 1. Component Development

When developing new features:

```js
// Example: Adding a new drawer variant
import React from 'react';
import { BaseDrawer } from './Drawer';

export const ModalDrawer = ({ 
  confirmOnClose = false, 
  onConfirm,
  ...props 
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClose = useCallback(() => {
    if (confirmOnClose) {
      setShowConfirm(true);
    } else {
      props.onClose?.();
    }
  }, [confirmOnClose, props.onClose]);

  return (
    <>
      <BaseDrawer {...props} onClose={handleClose} />
      {showConfirm && (
        <div className="confirm-modal">
          <p>Are you sure you want to close?</p>
          <button onClick={() => { onConfirm?.(); setShowConfirm(false); }}>
            Yes
          </button>
          <button onClick={() => setShowConfirm(false)}>
            No
          </button>
        </div>
      )}
    </>
  );
};
```

#### 2. Custom Hooks Development

Creating reusable drawer logic:

```js
// hooks/useDrawer.js
import { useState, useCallback, useEffect } from 'react';

export const useDrawer = (initialOpen = false) => {
  const [open, setOpen] = useState(initialOpen);
  const [loading, setLoading] = useState(false);

  const openDrawer = useCallback(() => {
    setOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setOpen(false);
  }, []);

  const toggleDrawer = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  // Auto-close on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && open) {
        closeDrawer();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, closeDrawer]);

  return {
    open,
    loading,
    setLoading,
    openDrawer,
    closeDrawer,
    toggleDrawer
  };
};

// Usage
const MyComponent = () => {
  const { open, openDrawer, closeDrawer } = useDrawer();

  return (
    <div>
      <button onClick={openDrawer}>Open</button>
      <Drawer open={open} onClose={closeDrawer}>
        <div>Content</div>
      </Drawer>
    </div>
  );
};
```

#### 3. Styling and Theming

```js
// themes/drawer.js
export const drawerThemes = {
  light: {
    mask: {
      backgroundColor: 'rgba(0, 0, 0, 0.45)'
    },
    content: {
      backgroundColor: '#ffffff',
      color: '#000000',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    }
  },
  dark: {
    mask: {
      backgroundColor: 'rgba(0, 0, 0, 0.65)'
    },
    content: {
      backgroundColor: '#1f1f1f',
      color: '#ffffff',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.45)'
    }
  }
};

// ThemeProvider component
export const ThemedDrawer = ({ theme = 'light', ...props }) => {
  const themeStyles = drawerThemes[theme];
  
  return (
    <Drawer
      {...props}
      styles={{
        ...themeStyles,
        ...props.styles
      }}
    />
  );
};
```

### Debugging and Development Tools

#### Debug Mode Implementation

```js
// utils/debug.js
export const createDebugLogger = (componentName) => {
  const isDebug = process.env.NODE_ENV === 'development' && 
                  localStorage.getItem('rc-drawer-debug') === 'true';

  return {
    log: (...args) => {
      if (isDebug) {
        console.log(`[${componentName}]`, ...args);
      }
    },
    warn: (...args) => {
      if (isDebug) {
        console.warn(`[${componentName}]`, ...args);
      }
    },
    error: (...args) => {
      console.error(`[${componentName}]`, ...args);
    }
  };
};

// Usage in components
const DebugDrawer = (props) => {
  const logger = createDebugLogger('Drawer');
  
  useEffect(() => {
    logger.log('Drawer props changed:', props);
  }, [props, logger]);

  const handleOpen = useCallback(() => {
    logger.log('Drawer opening');
    props.onOpen?.();
  }, [props.onOpen, logger]);

  return <Drawer {...props} afterOpenChange={handleOpen} />;
};
```

### Performance Monitoring

```js
// utils/performance.js
export const withPerformanceMonitoring = (WrappedComponent) => {
  return function PerformanceMonitoredComponent(props) {
    const renderStartTime = useRef(performance.now());

    useEffect(() => {
      const renderEndTime = performance.now();
      const renderTime = renderEndTime - renderStartTime.current;
      
      if (renderTime > 16) { // More than one frame (60fps)
        console.warn(`Component rendered slowly: ${renderTime.toFixed(2)}ms`);
      }
    });

    const measureInteraction = useCallback((interactionName) => {
      performance.mark(`${interactionName}-start`);
      
      return () => {
        performance.mark(`${interactionName}-end`);
        performance.measure(
          interactionName,
          `${interactionName}-start`,
          `${interactionName}-end`
        );
      };
    }, []);

    return (
      <WrappedComponent 
        {...props} 
        measureInteraction={measureInteraction}
      />
    );
  };
};
```

### Contributing Guidelines

#### Code Style and Standards

```js
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    'react/prop-types': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'prefer-const': 'error',
    'no-var': 'error'
  }
};

// prettier.config.js
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false
};
```

#### Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "src/**/*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ],
    "src/**/*.{css,less,scss}": [
      "prettier --write",
      "git add"
    ]
  }
}
```

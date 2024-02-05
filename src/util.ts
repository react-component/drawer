import warning from 'rc-util/lib/warning';
import canUseDom from 'rc-util/lib/Dom/canUseDom';
import type { DrawerProps } from './Drawer';

export function parseWidthHeight(value?: number | string) {
  if (typeof value === 'string' && String(Number(value)) === value) {
    warning(
      false,
      'Invalid value type of `width` or `height` which should be number type instead.',
    );
    return Number(value);
  }

  return value;
}

export function warnCheck(props: DrawerProps) {
  warning(
    !('wrapperClassName' in props),
    `'wrapperClassName' is removed. Please use 'rootClassName' instead.`,
  );

  warning(
    canUseDom() || !props.open,
    `Drawer with 'open' in SSR is not work since no place to createPortal. Please move to 'useEffect' instead.`,
  );
}

export function getAriaProps<TProps extends Record<string, any>>(
  props: TProps,
) {
  return Object.keys(props || {}).reduce((props, key) => {
    if (key.toLowerCase().startsWith('aria-')) {
      props[key] = props[key];
    }
    return props;
  }, {} as Partial<React.AriaAttributes>);
}

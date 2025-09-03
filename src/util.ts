import warning from '@rc-component/util/lib/warning';
import canUseDom from '@rc-component/util/lib/Dom/canUseDom';
import type { DrawerProps } from './Drawer';

export function parseWidthHeight(value?: number | string) {
  if (typeof value === 'string') {
    const num = Number(value.replace(/px$/i, ''));
    const floatNum = parseFloat(value);

    if (floatNum === num) {
      warning(
        false,
        'Invalid value type of `width` or `height` which should be number type instead.',
      );
    }

    if (!Number.isNaN(num)) {
      return num;
    }
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

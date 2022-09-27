import warning from 'rc-util/lib/warning';
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
}

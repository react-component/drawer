import React from 'react';
import { useLockFocus } from '@rc-component/util';

export default function useFocusable(
  getContainer: () => HTMLElement,
  open: boolean,
  autoFocus?: boolean,
  focusTrap?: boolean,
  mask?: boolean,
) {
  const mergedFocusTrap = focusTrap ?? mask !== false;

  // Focus lock
  const [ignoreElement] = useLockFocus(open && mergedFocusTrap, getContainer);

  // Auto Focus
  React.useEffect(() => {
    if (open && autoFocus === true) {
      getContainer()?.focus({ preventScroll: true });
    }
  }, [open]);

  return ignoreElement;
}

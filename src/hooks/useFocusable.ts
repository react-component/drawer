import React from 'react';
import type { FocusableConfig } from '../DrawerPopup';
import { useLockFocus } from '@rc-component/util/lib/Dom/focus';

export default function useFocusable(
  getContainer: () => HTMLElement,
  open: boolean,
  focusable?: FocusableConfig,
  autoFocus?: boolean,
  mask?: boolean,
) {
  // Parse config
  const config = React.useMemo<FocusableConfig>(() => {
    const merged: FocusableConfig = {
      trap: mask !== false,
      focusTriggerAfterClose: true,
      ...focusable,
    };

    if (autoFocus !== undefined) {
      merged.autoFocus = autoFocus;
    }

    return merged;
  }, [focusable, autoFocus, mask]);

  // Focus lock
  useLockFocus(open && config.trap, getContainer);

  // Auto Focus
  React.useEffect(() => {
    if (open && config.autoFocus === true) {
      getContainer()?.focus({ preventScroll: true });
    }
  }, [open]);
}

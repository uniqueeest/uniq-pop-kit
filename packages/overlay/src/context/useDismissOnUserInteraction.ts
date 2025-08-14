import { useEffect } from 'react';

import { overlayStore } from './store';

const DEFAULT_EVENTS = ['mousedown', 'touchstart', 'keydown', 'wheel'];

export const useDismissOnUserInteraction = () => {
  useEffect(() => {
    const onInteract = (e: Event) => {
      const current = overlayStore.getCurrentOverlay();

      if (!current) return;

      const { props } = current;

      if (props.dismissOnInteraction === false) return;

      overlayStore.remove(current.overlayKey);
    };

    DEFAULT_EVENTS.forEach((ev) => document.addEventListener(ev, onInteract, { capture: true }));

    return () => {
      DEFAULT_EVENTS.forEach((ev) =>
        document.removeEventListener(ev, onInteract, { capture: true }),
      );
    };
  }, []);
};

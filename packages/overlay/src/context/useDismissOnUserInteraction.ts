import { useEffect } from 'react';

import { overlayStore } from './store';

const DEFAULT_EVENTS = ['mousedown', 'touchstart', 'keydown'];

export const useDismissOnUserInteraction = () => {
  useEffect(() => {
    const onInteract = (e: Event) => {
      const current = overlayStore.getCurrentOverlay();

      if (!current) return;

      const { props } = current;

      if (props.dismissOnInteraction === false) return;

      if (e.type === 'keydown') {
        const ke = e as KeyboardEvent;

        if (!(ke.key === 'Escape' || ke.code === 'Escape'))  return;
      }

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

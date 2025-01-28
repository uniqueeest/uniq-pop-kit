import { useEffect } from 'react';

const OVERLAY_ID = 'overlay-container';

export const useCreateOverlayContainer = () => {
  useEffect(() => {
    if (document.getElementById(OVERLAY_ID)) {
      return;
    }
    const modalEl = document.createElement('div');
    modalEl.id = OVERLAY_ID;
    modalEl.style.zIndex = '9999';
    document.body.append(modalEl);

    return () => {
      document.getElementById(OVERLAY_ID)?.remove();
    };
  }, []);

  return null;
};

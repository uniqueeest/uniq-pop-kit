import { cloneElement, isValidElement } from 'react';

import { overlayStore } from './context/store';
import { randomId } from './utils';
import { OverlayProps, ReactOverlayElement } from './context/types';

function open<T>(element: ReactOverlayElement, options?: { duration?: number; dismissOnInteraction?: boolean; }): Promise<T> {
  if (!isValidElement(element)) {
    throw new Error('Invalid React element provided to overlay.open');
  }

  const { overlayKey = randomId(), ...props } = element.props;

  const OverlayComponent = (overlayProps: OverlayProps) => {
    return cloneElement(element, { ...overlayProps, ...props });
  };

  return overlayStore.push(overlayKey, OverlayComponent, {
    ...props,
    duration: options?.duration,
    dismissOnInteraction: options?.dismissOnInteraction ?? false,
  }) as Promise<T>;
}

export const overlay = {
  open,
  close: () => overlayStore.pop(),
  remove: (overlayKey: string) => overlayStore.remove(overlayKey),
  clear: () => overlayStore.clear(),
};

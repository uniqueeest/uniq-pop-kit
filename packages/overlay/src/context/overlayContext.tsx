import { ReactNode } from 'react';

import { useCreateOverlayContainer } from './useCreateOverlayContainer';
import { useDismissOnUserInteraction } from './useDismissOnUserInteraction';
import { OverlayRenderer } from './OverlayRenderer';

export const OverlayContext = ({ children }: { children: ReactNode }) => {
  useCreateOverlayContainer();
  useDismissOnUserInteraction();

  return (
    <>
      {children}
      <OverlayRenderer />
    </>
  );
};

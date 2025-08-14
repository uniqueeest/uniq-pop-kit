import * as ReactDOM from 'react-dom';

import { useOverlay } from './useOverlay';
import { OVERLAY_ID } from './constants';

export const OverlayRenderer = () => {
  const overlays = useOverlay();

  if (overlays.length === 0) return null;

  return ReactDOM.createPortal(
    <>
      {overlays.map((overlay) => {
        const OverlayComponent = overlay.overlay;
        const props = overlay.props;
        
        return (
          <OverlayComponent
            key={overlay.overlayKey}
            overlayKey={overlay.overlayKey}
            resolve={overlay.resolve}
            {...props}
          />
        );
      })}
    </>,
    window.document.getElementById(OVERLAY_ID)!
  );
};

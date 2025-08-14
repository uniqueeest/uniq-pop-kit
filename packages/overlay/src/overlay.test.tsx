import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, cleanup, fireEvent } from '@testing-library/react';

import { overlay } from './overlay';
import { OverlayContext, OverlayProps } from './context';
import { overlayStore } from './context/store';

interface TestOverlayProps extends OverlayProps {
  message: string;
}

const TestOverlay = ({ overlayKey, resolve, message }: TestOverlayProps) => (
  <div data-testid={`overlay-${overlayKey}`}>
    {message}
    <button onClick={() => resolve?.('confirmed')}>Confirm</button>
  </div>
);

const OverlayTestComponent = () => {
  const handleOpenOverlay = () => {
    overlay.open(<TestOverlay overlayKey="test-overlay" message="Test Message" />);
  };

  const handleOpenDuplicateOverlay = async () => {
    try {
      await overlay.open(<TestOverlay overlayKey="duplicate-key" message="First Overlay" />);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenTimedOverlay = () => {
    overlay.open(<TestOverlay overlayKey="timed-overlay" message="Timed Message" />, { duration: 1000 });
  };

  const handleOpenMultipleOverlays = () => {
    overlay.open(<TestOverlay overlayKey="first-overlay" message="First Overlay" />);
    overlay.open(<TestOverlay overlayKey="second-overlay" message="Second Overlay" />);
  };

  return (
    <div>
      <button onClick={handleOpenOverlay} data-testid="open-button">
        Open Overlay
      </button>
      <button onClick={handleOpenDuplicateOverlay} data-testid="open-duplicate-1">
        Open Duplicate
      </button>
      <button onClick={handleOpenDuplicateOverlay} data-testid="open-duplicate-2">
        Open Duplicate2
      </button>
      <button onClick={handleOpenTimedOverlay} data-testid="open-timed">
        Open Timed
      </button>
      <button onClick={handleOpenMultipleOverlays} data-testid="open-multiple">
        Open Multiple
      </button>
    </div>
  );
};

describe('Overlay System', () => {
  beforeEach(() => {
    const overlayContainer = document.createElement('div');
    overlayContainer.id = 'uniq-overlay-container';
    document.body.appendChild(overlayContainer);
  });

  afterEach(() => {
    cleanup();
    overlayStore.clear();
    const container = document.getElementById('uniq-overlay-container');
    if (container) {
      document.body.removeChild(container);
    }
  });

  describe('overlay.open', () => {
    it('should open an overlay when button is clicked', async () => {
      render(
        <OverlayContext>
          <OverlayTestComponent />
        </OverlayContext>
      );

      const openButton = screen.getByTestId('open-button');
      fireEvent.click(openButton);

      const overlayElement = await screen.findByText('Test Message');
      expect(overlayElement).toBeInTheDocument();

      const container = document.getElementById('uniq-overlay-container');
      expect(container).toContainElement(overlayElement);

      await act(async () => {
        overlay.close();
      });
    });

    it('should handle duplicate overlay keys', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn');

      render(
        <OverlayContext>
          <OverlayTestComponent />
        </OverlayContext>
      );

      const openDuplicateButton1 = screen.getByTestId('open-duplicate-1');
      await act(async () => {
        fireEvent.click(openDuplicateButton1);
      });

      await new Promise((resolve) => setTimeout(resolve, 0));

      const openDuplicateButton2 = screen.getByTestId('open-duplicate-2');
      await act(async () => {
        fireEvent.click(openDuplicateButton2);
      });

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Overlay with key "duplicate-key" already exists. Not adding a duplicate.'
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('overlay with duration', () => {
    it('should auto-close after specified duration', async () => {
      vi.useFakeTimers();

      render(
        <OverlayContext>
          <OverlayTestComponent />
        </OverlayContext>
      );

      const openTimedButton = screen.getByTestId('open-timed');
      fireEvent.click(openTimedButton);

      const overlayElement = screen.getByText('Timed Message');
      expect(overlayElement).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.queryByText('Timed Message')).not.toBeInTheDocument();

      vi.useRealTimers();
    });
  });

  describe('overlayStore', () => {
    it('should maintain correct stack order', async () => {
      render(
        <OverlayContext>
          <OverlayTestComponent />
        </OverlayContext>
      );

      const openMultipleButton = screen.getByTestId('open-multiple');
      fireEvent.click(openMultipleButton);

      const firstOverlay = await screen.findByText('First Overlay');
      const secondOverlay = await screen.findByText('Second Overlay');

      expect(firstOverlay).toBeInTheDocument();
      expect(secondOverlay).toBeInTheDocument();

      const overlays = overlayStore.getAllOverlays();
      expect(overlays).toHaveLength(2);

      await act(async () => {
        overlayStore.clear();
      });
    });

    it('should handle remove operation correctly', async () => {
      render(
        <OverlayContext>
          <OverlayTestComponent />
        </OverlayContext>
      );

      const openButton = screen.getByTestId('open-button');
      fireEvent.click(openButton);

      const overlayElement = await screen.findByText('Test Message');
      expect(overlayElement).toBeInTheDocument();

      await act(async () => {
        overlay.remove('test-overlay');
      });

      expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
    });
  });

  describe('dismissOnInteraction', () => {
    beforeEach(() => {
      const overlayContainer = document.createElement('div');
      overlayContainer.id = 'overlay-container';
      
      document.body.appendChild(overlayContainer);
    });

    afterEach(() => {
      cleanup();
      overlayStore.clear();
      const el = document.getElementById('overlay-container');
      if (el) document.body.removeChild(el);
    });

    it('default (false): should NOT close on user interaction', async () => {
      render(
        <OverlayContext>
          <div />
        </OverlayContext>
      );

      act(() => {
        overlay.open(<TestOverlay overlayKey="keep" message="Should stay" />);
      });

      expect(await screen.findByText('Should stay')).toBeInTheDocument();

      fireEvent.mouseDown(document.body);
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

      await act(async () => { await Promise.resolve(); });

      expect(screen.getByText('Should stay')).toBeInTheDocument();
    });

    it('dismissOnInteraction=true: should close on click', async () => {
      render(
        <OverlayContext>
          <div />
        </OverlayContext>
      );

      let resolved: unknown = undefined;
      act(() => {
        overlay
          .open(<TestOverlay overlayKey="click-close" message="Close me" />, {
            dismissOnInteraction: true,
          })
          .then((v) => {
            resolved = v;
          });
      });

      expect(await screen.findByText('Close me')).toBeInTheDocument();

      fireEvent.mouseDown(document.body);

      await act(async () => { await Promise.resolve(); });

      expect(screen.queryByText('Close me')).not.toBeInTheDocument();
      expect(resolved).toBe('Overlay removed');
    });

    it('dismissOnInteraction=true: should close on keyboard input', async () => {
      render(
        <OverlayContext>
          <div />
        </OverlayContext>
      );

      act(() => {
        overlay.open(<TestOverlay overlayKey="key-close" message="Close key" />, {
          dismissOnInteraction: true,
        });
      });

      expect(await screen.findByText('Close key')).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

      await act(async () => { await Promise.resolve(); });

      expect(screen.queryByText('Close key')).not.toBeInTheDocument();
    });

    it('dismissOnInteraction=true: should close only the top-most overlay when multiple are open', async () => {
      render(
        <OverlayContext>
          <div />
        </OverlayContext>
      );

      act(() => {
        overlay.open(<TestOverlay overlayKey="first" message="First" />);
        overlay.open(<TestOverlay overlayKey="second" message="Second" />, {
          dismissOnInteraction: true,
        });
      });

      expect(await screen.findByText('First')).toBeInTheDocument();
      expect(await screen.findByText('Second')).toBeInTheDocument();

      fireEvent.mouseDown(document.body);

      await act(async () => { await Promise.resolve(); });

      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.queryByText('Second')).not.toBeInTheDocument();
    });
  });
});

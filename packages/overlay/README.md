# uniq-overlay-kit

A library for easily managing overlays in React applications.

[한국어 문서](./README-ko.md)

## Key Features

- Simple overlay control based on Promises
- Multiple overlay stack management
- Custom overlay component support
- Auto-close timer support
- Duplicate overlay key detection

## Installation

```bash
npm install uniq-overlay-kit
# or
yarn add uniq-overlay-kit
# or
pnpm add uniq-overlay-kit
```

## Usage

### 1. Add OverlayContext to your application

```tsx
import { OverlayContext } from 'uniq-overlay-kit';

function App() {
  return (
    <OverlayContext>
      <YourApp />
    </OverlayContext>
  );
}
```

### 2. Create an overlay component

```tsx
import { OverlayProps } from 'uniq-overlay-kit';

const BasicOverlay = ({ resolve }: OverlayProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-white">
        <h1>Overlay</h1>
        <div className="flex gap-3">
          <button onClick={() => resolve?.('Confirm')}>Confirm</button>
          <button onClick={() => resolve?.('Cancel')}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
```

### 3. Using the overlay

```tsx
import { overlay } from 'uniq-overlay-kit';

function YourComponent() {
  const handleOpenOverlay = async () => {
    const result = await overlay.open(<BasicOverlay overlayKey="unique-key" />);

    if (result === 'Confirm') {
      console.log('User selected confirm');
    }
  };

  return <button onClick={handleOpenOverlay}>Open Overlay</button>;
}
```

## API

### overlay.open(component, options?)

Opens an overlay and returns a Promise.

```tsx
const result = await overlay.open(<YourOverlay overlayKey="unique-key" />, {
  duration: 3000, // Automatically closes after 3 seconds (optional)
  dismissOnInteraction: true, // Closes when user clicks outside or presses ESC (optional, default: false)
});
```

### overlay.close(overlayKey)

Closes a specific overlay.

```tsx
overlay.close('unique-key');
```

### overlay.closeAll()

Closes all overlays.

```tsx
overlay.closeAll();
```

### useOverlay Hook

Gets the list of currently displayed overlays.

```tsx
const overlays = useOverlay();
```

## Props

The `OverlayProps` type includes the following properties:

- `overlayKey` (required): Unique identifier for the overlay
- `resolve`: Function to return the overlay result and close it
- `duration`: Time in milliseconds before auto-closing
- `dismissOnInteraction`: Whether to close overlay on user interaction (click/touch outside or ESC key)

## Important Notes

- Each overlay must have a unique `overlayKey`
- `OverlayContext` should be placed at the top level of your application
- Overlay components must handle the `resolve` function

## Requirements

- React 18 or higher
- React DOM 18 or higher

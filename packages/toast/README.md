# uniq-toast-kit

A library for easily managing toast messages in React applications.

[한국어 문서](./README-ko.md)

## Key Features

- Direct toast calls from within components
- External toast calls via API
- Auto-dismiss timer support
- Custom duration settings
- Multiple toast stack management

## Installation

```bash
npm install uniq-toast-kit
# or
yarn add uniq-toast-kit
# or
pnpm add uniq-toast-kit
```

## Usage

### 1. Add ToastProvider to your application

```tsx
import { ToastProvider, ToastInitializer } from 'uniq-toast-kit';

function App() {
  return (
    <ToastProvider>
      <ToastInitializer />
      <YourApp />
    </ToastProvider>
  );
}
```

### 2. Implement a Toast component

This library only provides toast state management logic and does not include a UI component. You need to implement your own Toast component:

```tsx
import { useToast } from 'uniq-toast-kit';

export const Toast = () => {
  const { overlayList, hideToast } = useToast();

  return (
    <section className="fixed top-4 right-4 z-50 flex flex-col gap-4">
      {overlayList.map((overlay) => {
        const { id, title, description } = overlay;

        return (
          <div key={id} className="bg-white rounded-lg shadow p-4 flex items-center" role="alert">
            {/* Icon area */}
            <div className={`w-8 h-8 rounded-lg ${title === 'Error' ? 'bg-red-100' : 'bg-blue-100'}`}>
              {/* Icon content */}
            </div>

            {/* Text area */}
            <div className="ml-3">
              <h3 className="text-[16px]">{title}</h3>
              <p className="text-[14px]">{description}</p>
            </div>

            {/* Close button */}
            <button type="button" className="ml-auto p-1.5" onClick={() => hideToast(id)}>
              {/* Close icon */}
            </button>
          </div>
        );
      })}
    </section>
  );
};
```

Add your implemented Toast component to your application:

```tsx
import { ToastProvider, ToastInitializer } from 'uniq-toast-kit';
import { Toast } from './Toast';

function App() {
  return (
    <ToastProvider>
      <ToastInitializer />
      <Toast />
      <YourApp />
    </ToastProvider>
  );
}
```

### 3. Using within components

```tsx
import { useToast } from 'uniq-toast-kit';

function YourComponent() {
  const { showToast } = useToast();

  const handleClick = () => {
    showToast({
      title: 'Success',
      description: 'Operation completed',
      duration: 3000, // optional, default is 3000ms
    });
  };

  return <button onClick={handleClick}>Show Toast</button>;
}
```

### 4. Using externally via API

```tsx
import { toastApi } from 'uniq-toast-kit';

// Use in API calls or external functions
const saveData = async (data: any) => {
  try {
    const response = await fetch('/api/data', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.ok) {
      toastApi.create({
        title: 'Success',
        description: 'Data has been saved',
      });
      return true;
    }
  } catch (error) {
    toastApi.create({
      title: 'Error',
      description: 'An error occurred while saving',
    });
    return false;
  }
};
```

## API

### useToast Hook

```tsx
const { showToast, hideToast, overlayList } = useToast();
```

#### showToast(options)

Displays a toast message.

```tsx
showToast({
  title: string,       // Toast title
  description: string, // Toast content
  duration?: number    // Display duration (ms, default: 3000)
});
```

#### hideToast(id)

Hides a specific toast.

```tsx
hideToast('toast-id');
```

#### overlayList

Returns the list of currently displayed toasts. Each toast object has the following properties:

```tsx
{
  id: string,       // Unique toast ID
  title: string,    // Toast title
  description: string, // Toast content
}
```

### toastApi

Provides an API for showing toasts from outside components.

```tsx
toastApi.create({
  title: string, // Toast title
  description: string, // Toast content
});
```

## Important Notes

- `ToastProvider` must be placed at the top level of your application
- `ToastInitializer` must be inside the `ToastProvider`
- `ToastInitializer` is required for external API usage
- This library does not provide toast UI components, so you need to implement your own UI component

## Requirements

- React 18 or higher
- React DOM 18 or higher

## Example

```tsx
function Demo() {
  const { showToast } = useToast();

  return (
    <div>
      <button
        onClick={() =>
          showToast({
            title: 'Notification',
            description: 'You have a new message',
            duration: 5000,
          })
        }
      >
        Send Notification
      </button>
    </div>
  );
}
```

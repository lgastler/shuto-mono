# @shuto-img/react

A React library for integrating Shuto image processing capabilities into your React applications, providing components and hooks for easy image optimization and delivery.

## Installation

```bash
npm install @shuto-img/react
```

## Usage

> **Important Security Note:** Be cautious about using API keys and signer keys in client-side code. Exposing these secrets in your frontend application makes them publicly accessible and could compromise your application's security. Consider implementing a secure backend service to handle sensitive operations.

### Basic Setup

First, wrap your application with the `ShutoProvider` to configure the Shuto client:

```tsx
import { ShutoProvider } from '@shuto-img/react';

function App() {
  return (
    <ShutoProvider
      config={{
        baseUrl: 'https://api.shuto.example.com',
        apiKey: 'your-api-key', // Optional, required only for list endpoint
      }}
      signerConfig={{
        keys: [
          {
            id: 'key1',
            secret: 'your-secret-key',
          },
        ],
        validityWindow: 3600, // 1 hour in seconds
      }}
    >
      <YourApp />
    </ShutoProvider>
  );
}
```

### Using the ShutoImage Component

> **Note:** Server-focused components that help manage these security concerns more effectively are currently in development. These will provide a more secure way to handle sensitive operations while maintaining the ease of use of the React server-components.

The `ShutoImage` component provides an easy way to display optimized images:

```tsx
import { ShutoImage } from '@shuto-img/react';

function MyComponent() {
  return (
    <ShutoImage
      path="folder/image.jpg"
      params={{
        w: 800,
        h: 600,
        fit: 'crop',
        fm: 'webp',
        q: 80,
      }}
      alt="My optimized image"
      className="my-image-class"
    />
  );
}
```

### Using the useShutoClient Hook

For more advanced use cases, you can use the `useShutoClient` hook to access the Shuto client directly:

```tsx
import { useShutoClient } from '@shuto-img/react';

function MyComponent() {
  const client = useShutoClient();

  const handleImageUrl = async () => {
    const imageUrl = await client.getImageUrl({
      path: 'folder/image.jpg',
      w: 800,
      h: 600,
    });
    // Use the generated URL
  };

  return (
    // Your component JSX
  );
}
```

## Components

### ShutoProvider

The `ShutoProvider` component initializes the Shuto client and makes it available throughout your React application.

#### Props

```typescript
interface ShutoProviderProps {
  children: ReactNode;
  config: ShutoConfig;
  signerConfig: SignerConfig;
}
```

### ShutoImage

The `ShutoImage` component renders an optimized image using Shuto's image processing capabilities.

#### Props

```typescript
interface ShutoImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  path: string;
  params?: {
    w?: number;
    h?: number;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    fm?: 'webp' | 'jpeg' | 'png';
    q?: number;
    // ... other image parameters
  };
  alt?: string;
}
```

## Hooks

### useShutoClient

A hook that provides access to the Shuto client instance. Must be used within a `ShutoProvider`.

```typescript
const client = useShutoClient();
```

## Running unit tests

Run `nx test @shuto-img/react` to execute the unit tests via [Vitest](https://vitest.dev/).

## License

MIT

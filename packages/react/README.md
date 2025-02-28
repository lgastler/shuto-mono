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

The `ShutoImage` component provides an easy way to display optimized images:

```tsx
import { ShutoImage } from '@shuto-img/react';

function MyComponent() {
  return (
    <ShutoImage
      path="folder/image.jpg" // Path relative to your storage root
      w={800} // Width
      h={600} // Height
      fit="crop" // Resize mode
      fm="webp" // Output format
      q={80} // Quality
      alt="My optimized image"
      className="my-image-class"
      loading="lazy" // Enable lazy loading
      responsive // Enable responsive sizing
      fallback={<Placeholder />} // Fallback component for errors
      onError={(error) => console.error(error)}
    />
  );
}
```

### Using with useListContents

The `useListContents` hook and `ShutoImage` component work together seamlessly:

```tsx
import { useListContents, ShutoImage } from '@shuto-img/react';

function Gallery() {
  const { data: files, isLoading, error } = useListContents('images/gallery');

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;

  return (
    <div className="grid">
      {files?.map((file) => (
        <ShutoImage
          key={file.fullPath}
          path={file.fullPath} // fullPath is already properly formatted
          alt={file.path}
          w={800}
          responsive
        />
      ))}
    </div>
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
  signerConfig?: SignerConfig;
}
```

### ShutoImage

The `ShutoImage` component renders an optimized image using Shuto's image processing capabilities.

#### Props

```typescript
interface ShutoImageProps {
  path: string; // Path to the image, relative to storage root
  w?: number; // Width
  h?: number; // Height
  fit?: 'clip' | 'crop' | 'fill'; // Resize mode
  fm?: 'jpg' | 'jpeg' | 'png' | 'webp'; // Output format
  q?: number; // Quality (1-100)
  dpr?: number; // Device pixel ratio
  blur?: number; // Blur amount
  alt: string; // Alt text for accessibility
  className?: string; // CSS class name
  loading?: 'lazy' | 'eager'; // Image loading behavior
  responsive?: boolean; // Enable responsive image sizing
  fallback?: ReactNode; // Component to show on error
  onError?: (error: Error) => void; // Error callback
}
```

## Hooks

### useShutoClient

A hook that provides access to the Shuto client instance. Must be used within a `ShutoProvider`.

```typescript
const client = useShutoClient();
```

### useListContents

A hook for listing contents of a directory.

```typescript
interface UseListContentsOptions {
  filter?: string | RegExp; // Filter files by path
}

const { data, isLoading, error, refetch } = useListContents(
  'folder/path',
  options
);
```

## Running unit tests

Run `nx test @shuto-img/react` to execute the unit tests via [Vitest](https://vitest.dev/).

## License

MIT

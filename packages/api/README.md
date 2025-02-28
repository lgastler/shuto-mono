# @shuto-img/api

A TypeScript/JavaScript client for interacting with the Shuto API, including URL signing capabilities.

## Installation

```bash
npm install @shuto-img/api
```

## Usage

### Basic Setup

```typescript
import { ShutoClient, ShutoURLSigner } from '@shuto-img/api';

// Initialize the client with signer configuration
const client = new ShutoClient(
  {
    baseUrl: 'https://api.shuto.example.com',
    apiKey: 'your-api-key', // Required only for list endpoint
  },
  {
    keys: [
      {
        id: 'key1',
        secret: 'your-secret-key',
      },
    ],
    validityWindow: 3600, // 1 hour in seconds
  }
);

// Or initialize the URL signer separately if needed
const signer = new ShutoURLSigner({
  keys: [
    {
      id: 'key1',
      secret: 'your-secret-key',
    },
  ],
  validityWindow: 3600, // 1 hour in seconds
});
```

### Image Processing

```typescript
// Generate a signed URL for image processing
const imageUrl = await client.getImageUrl({
  path: 'folder/image.jpg', // Path relative to your storage root
  w: 800,
  h: 600,
  fit: 'crop',
  fm: 'webp',
  q: 80,
});
```

### File Downloads

```typescript
// Generate a signed URL for file download
const downloadUrl = await client.getDownloadUrl({
  path: 'folder/document.pdf',
});
```

### Listing Contents

```typescript
// List contents of a directory (requires API key)
const files = await client.listContents('folder/path', {
  filter: 'jpg', // Optional filter for file paths
});

// The returned files will have the following structure:
interface File {
  path: string; // File path from the API
  fullPath: string; // Combined path, ready for use with getImageUrl
  size: number;
  mimeType: string;
  isDir: boolean;
  // For image files only:
  width?: number;
  height?: number;
}
```

### Manual URL Signing

```typescript
// Generate a signed URL manually
const signedUrl = await signer.generateSignedURL('/v2/image/folder/image.jpg', {
  endpoint: 'image',
  params: {
    w: 800,
    h: 600,
  },
});

// Validate a signed URL
const isValid = await signer.validateSignedURL(signedUrl);
```

## API Reference

### ShutoClient

The main client for interacting with the Shuto API.

#### Configuration

```typescript
interface ShutoConfig {
  baseUrl: string;
  apiKey?: string; // Required only for list endpoint
}

interface SignerConfig {
  keys: SigningKey[];
  validityWindow?: number; // in seconds, 0 means indefinite
  defaultKeyId?: string; // defaults to first key if not specified
}

interface SigningKey {
  id: string;
  secret: string;
}

interface ListContentsOptions {
  filter?: string | RegExp; // Filter files by path
}

interface ImageParams {
  path: string; // Path to the image, relative to storage root
  w?: number; // Width
  h?: number; // Height
  fit?: 'clip' | 'crop' | 'fill'; // Resize mode
  fm?: 'jpg' | 'jpeg' | 'png' | 'webp'; // Output format
  q?: number; // Quality (1-100)
  dpr?: number; // Device pixel ratio
  blur?: number; // Blur amount
  dl?: boolean; // Force download
  excludeBaseUrl?: boolean; // Exclude baseUrl from the returned URL
}
```

## Error Handling

All methods may throw errors with the following structure:

```typescript
interface ErrorResponse {
  code: string;
  error: string;
  details?: string;
}
```

## License

MIT

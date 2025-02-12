# @shuto-img/api

A TypeScript/JavaScript client for interacting with the Shuto API, including URL signing capabilities.

## Installation

```bash
npm install @shuto-img/api
```

## Usage

### Basic Setup

```typescript
import { ShutoClient, ShutoURLSigner } from '-img/api';

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
  path: 'folder/image.jpg',
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
const files = await client.listContents('folder/path');
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

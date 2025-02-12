import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ShutoURLSigner } from './signer.js';
import type { SignerConfig } from './types.js';

describe('ShutoURLSigner', () => {
  let signer: ShutoURLSigner;
  const mockConfig: SignerConfig = {
    keys: [
      { id: 'key1', secret: 'secret1' },
      { id: 'key2', secret: 'secret2' },
    ],
    validityWindow: 3600,
    defaultKeyId: 'key1',
  };

  beforeEach(() => {
    // Mock the Date.now() function
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));

    signer = new ShutoURLSigner(mockConfig);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('generateSignedURL', () => {
    it('should generate a signed URL with timestamp for image endpoint', async () => {
      const url = await signer.generateSignedURL('/v2/image/test.jpg', {
        endpoint: 'image',
        params: { w: 100, h: 100 },
      });

      expect(url).toContain('/v2/image/test.jpg');
      expect(url).toContain('kid=key1');
      expect(url).toContain('ts=1704067200');
      expect(url).toContain('sig=');
      expect(url).toContain('w=100');
      expect(url).toContain('h=100');
    });

    it('should generate a signed URL without timestamp when validityWindow is undefined', async () => {
      signer = new ShutoURLSigner({ ...mockConfig, validityWindow: undefined });
      const url = await signer.generateSignedURL('/v2/download/test.pdf', {
        endpoint: 'download',
      });

      expect(url).toContain('/v2/download/test.pdf');
      expect(url).toContain('kid=key1');
      expect(url).not.toContain('ts=');
      expect(url).toContain('sig=');
    });

    it('should use the specified key when provided', async () => {
      signer = new ShutoURLSigner({
        ...mockConfig,
        defaultKeyId: 'key2',
      });

      const url = await signer.generateSignedURL('/v2/image/test.jpg', {
        endpoint: 'image',
      });

      expect(url).toContain('kid=key2');
    });

    it('should throw error when no valid signing key is found', async () => {
      signer = new ShutoURLSigner({
        keys: [],
        validityWindow: 3600,
      });

      await expect(
        signer.generateSignedURL('/v2/image/test.jpg', { endpoint: 'image' })
      ).rejects.toThrow('No valid signing key found');
    });
  });

  describe('validateSignedURL', () => {
    it('should validate a correctly signed URL', async () => {
      const url = await signer.generateSignedURL('/v2/image/test.jpg', {
        endpoint: 'image',
        params: { w: 100 },
      });

      const isValid = await signer.validateSignedURL(url);
      expect(isValid).toBe(true);
    });

    it('should reject an expired URL', async () => {
      const url = await signer.generateSignedURL('/v2/image/test.jpg', {
        endpoint: 'image',
      });

      // Move time forward beyond validity window
      vi.setSystemTime(new Date('2024-01-01T02:00:00Z'));

      const isValid = await signer.validateSignedURL(url);
      expect(isValid).toBe(false);
    });

    it('should reject a URL with invalid signature', async () => {
      const url = await signer.generateSignedURL('/v2/image/test.jpg', {
        endpoint: 'image',
      });

      const tamperedUrl = url.replace(/sig=[^&]+/, 'sig=invalid');
      const isValid = await signer.validateSignedURL(tamperedUrl);
      expect(isValid).toBe(false);
    });

    it('should reject a URL with missing parameters', async () => {
      const isValid = await signer.validateSignedURL('/v2/image/test.jpg');
      expect(isValid).toBe(false);
    });

    it('should reject a malformed URL', async () => {
      const isValid = await signer.validateSignedURL('not-a-url');
      expect(isValid).toBe(false);
    });
  });
});

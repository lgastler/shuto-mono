import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ShutoClient } from './client.js';
import type { ShutoConfig, SignerConfig, RcloneFile } from './types.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ShutoClient', () => {
  let client: ShutoClient;
  const mockConfig: ShutoConfig = {
    baseUrl: 'https://api.example.com',
    apiKey: 'test-api-key',
  };

  const mockSignerConfig: SignerConfig = {
    keys: [{ id: 'key1', secret: 'secret1' }],
    validityWindow: 3600,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    client = new ShutoClient(mockConfig, mockSignerConfig);
  });

  describe('getImageUrl', () => {
    it('should generate a signed URL for image processing', async () => {
      const url = await client.getImageUrl({
        path: 'test.jpg',
        w: 100,
        h: 100,
        fit: 'crop',
      });

      expect(url).toContain('/v2/image/test.jpg');
      expect(url).toContain('w=100');
      expect(url).toContain('h=100');
      expect(url).toContain('fit=crop');
      expect(url).toContain('kid=key1');
      expect(url).toContain('sig=');
    });
  });

  describe('getDownloadUrl', () => {
    it('should generate a signed URL for file download', async () => {
      const url = await client.getDownloadUrl({
        path: 'test.pdf',
      });

      expect(url).toContain('/v2/download/test.pdf');
      expect(url).toContain('kid=key1');
      expect(url).toContain('sig=');
    });

    it('should properly encode download path', async () => {
      const url = await client.getDownloadUrl({
        path: 'folder/test file.pdf',
      });

      expect(url).toContain('/v2/download/folder%2Ftest%20file.pdf');
    });
  });

  describe('listContents', () => {
    const mockResponse: RcloneFile[] = [
      {
        isDir: false,
        mimeType: 'image/jpeg',
        name: 'test.jpg',
        path: 'folder/test.jpg',
        size: 1024,
      },
    ];

    it('should fetch directory contents with API key', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.listContents('folder');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/v2/list/folder',
        {
          headers: {
            Authorization: 'Bearer test-api-key',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when API key is missing', async () => {
      client = new ShutoClient(
        { ...mockConfig, apiKey: undefined },
        mockSignerConfig
      );

      await expect(client.listContents('folder')).rejects.toThrow(
        'API key is required for listing contents'
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      const errorResponse = {
        code: 'ERROR_CODE',
        error: 'Error message',
        details: 'Error details',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve(errorResponse),
      });

      await expect(client.listContents('folder')).rejects.toThrow(
        JSON.stringify(errorResponse)
      );
    });

    it('should handle non-JSON error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(client.listContents('folder')).rejects.toThrow(
        JSON.stringify({
          code: '500',
          error: 'Internal Server Error',
        })
      );
    });

    it('should properly encode list path', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await client.listContents('folder/sub folder');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/v2/list/folder%2Fsub%20folder',
        expect.any(Object)
      );
    });
  });
});

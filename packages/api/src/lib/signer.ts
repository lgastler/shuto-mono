/// <reference lib="dom" />
import { SignerConfig, SigningKey, SignUrlOptions } from './types.js';

// Use the global crypto API
declare const crypto: Crypto;

export class ShutoURLSigner {
  private readonly config: SignerConfig;
  private readonly endpoint: string;

  constructor(config: SignerConfig, endpoint = 'image') {
    this.config = config;
    if (endpoint !== 'image' && endpoint !== 'download') {
      throw new Error("endpoint must be either 'image' or 'download'");
    }
    this.endpoint = endpoint;
  }

  private getKey(keyId?: string): SigningKey {
    const targetKeyId = keyId || this.config.defaultKeyId;
    const key = targetKeyId
      ? this.config.keys.find((k: SigningKey) => k.id === targetKeyId)
      : this.config.keys[0];

    if (!key) {
      throw new Error('No valid signing key found');
    }

    return key;
  }

  private async generateSignature(
    message: string,
    secret: string
  ): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(message)
    );

    return Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private encodeParams(
    params: Record<string, string | number | boolean | undefined>
  ): string {
    const urlParams = new URLSearchParams();
    const entries = Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .sort(([a], [b]) => a.localeCompare(b));

    for (const [key, value] of entries) {
      urlParams.append(key, value!.toString());
    }

    return urlParams.toString();
  }

  private normalizePath(path: string): string {
    // Remove leading slashes
    let normalizedPath = path.replace(/^\/+/, '');

    // Remove /v2/{endpoint}/ prefix if it exists
    const prefix = `v2/${this.endpoint}/`;
    if (normalizedPath.startsWith(prefix)) {
      normalizedPath = normalizedPath.substring(prefix.length);
    }

    return normalizedPath;
  }

  async generateSignedURL(
    path: string,
    options: SignUrlOptions
  ): Promise<string> {
    // Normalize the path
    const normalizedPath = this.normalizePath(path);

    // Create and sort parameters
    const params: Record<string, string | number | boolean | undefined> =
      options.params ? { ...options.params } : {};

    const key = this.getKey();
    const encodedParams = this.encodeParams(params);
    const timestamp = this.config.validityWindow
      ? Math.floor(Date.now() / 1000)
      : undefined;

    // Create the message exactly as in Go
    const message = timestamp
      ? `${normalizedPath}|${timestamp}|${encodedParams}`
      : `${normalizedPath}|${encodedParams}`;

    const signature = await this.generateSignature(message, key.secret);

    // Add signature parameters to the URL parameters
    const urlParams = new URLSearchParams(encodedParams);
    urlParams.set('kid', key.id);
    urlParams.set('sig', signature);
    if (timestamp) {
      urlParams.set('ts', timestamp.toString());
    }

    // Construct the final URL
    const finalPath = `/v2/${this.endpoint}/${normalizedPath}`;
    return `${finalPath}${
      urlParams.toString() ? '?' + urlParams.toString() : ''
    }`;
  }

  async validateSignedURL(url: string): Promise<boolean> {
    try {
      const urlObj = new URL(
        url.startsWith('http') ? url : `http://example.com${url}`
      );
      const path = this.normalizePath(urlObj.pathname);
      const params = new URLSearchParams(urlObj.search);

      const signature = params.get('sig');
      const keyId = params.get('kid');
      const timestamp = params.get('ts');

      if (!signature || !keyId) {
        return false;
      }

      // Create a copy of parameters without signature fields
      const validationParams: Record<string, string> = {};
      for (const [key, value] of params.entries()) {
        if (key !== 'sig' && key !== 'kid' && key !== 'ts') {
          validationParams[key] = value;
        }
      }

      const encodedParams = this.encodeParams(validationParams);
      const key = this.getKey(keyId);

      // Create the message exactly as in Go
      const message = timestamp
        ? `${path}|${timestamp}|${encodedParams}`
        : `${path}|${encodedParams}`;

      if (this.config.validityWindow && timestamp) {
        const ts = parseInt(timestamp, 10);
        const now = Math.floor(Date.now() / 1000);
        if (now - ts > this.config.validityWindow) {
          return false;
        }
      }

      const computedSignature = await this.generateSignature(
        message,
        key.secret
      );
      return computedSignature === signature;
    } catch {
      return false;
    }
  }
}

/// <reference lib="dom" />
import { SignerConfig, SigningKey, SignUrlOptions } from './types.js';

// Use the global crypto API
declare const crypto: Crypto;

export class ShutoURLSigner {
  private readonly config: SignerConfig;

  constructor(config: SignerConfig) {
    this.config = config;
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

  private sortParams(
    params: Record<string, string | number | boolean | undefined>
  ): string {
    return Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [key, value!.toString()])
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&');
  }

  private isAlreadyEncoded(path: string): boolean {
    try {
      return path !== decodeURIComponent(path);
    } catch {
      return false;
    }
  }

  private encodePath(path: string): string {
    if (this.isAlreadyEncoded(path)) {
      return path;
    }
    // Split on forward slashes, but keep leading/trailing slashes
    const parts = path.split(/(?=\/)|(?<=\/)/);
    return parts
      .map((part) => (part === '/' ? part : encodeURIComponent(part)))
      .join('');
  }

  private buildUrl(
    path: string,
    params: Record<string, string | number | boolean | undefined>,
    signatureParams: Record<string, string>
  ): string {
    const encodedPath = this.encodePath(path);
    const allParams = { ...params, ...signatureParams };
    const queryString = this.sortParams(allParams);
    return `${encodedPath}${queryString ? '?' + queryString : ''}`;
  }

  async generateSignedURL(
    path: string,
    options: SignUrlOptions
  ): Promise<string> {
    const timestamp = this.config.validityWindow
      ? Math.floor(Date.now() / 1000)
      : undefined;
    const key = this.getKey();
    const sortedParams = this.sortParams(options.params || {});

    const message = timestamp
      ? `${path}|${timestamp}|${sortedParams}`
      : `${path}|${sortedParams}`;

    const signature = await this.generateSignature(message, key.secret);

    const signatureParams: Record<string, string> = {
      kid: key.id,
      sig: signature,
    };

    if (timestamp) {
      signatureParams.ts = timestamp.toString();
    }

    return this.buildUrl(path, options.params || {}, signatureParams);
  }

  async validateSignedURL(url: string): Promise<boolean> {
    try {
      const fullUrl = url.startsWith('http') ? url : `http://example.com${url}`;
      const urlObj = new URL(fullUrl);
      const path = decodeURIComponent(urlObj.pathname);
      const params = Object.fromEntries(urlObj.searchParams);

      const { kid, sig, ts, ...otherParams } = params;

      if (!kid || !sig) {
        return false;
      }

      const key = this.getKey(kid);
      const sortedParams = this.sortParams(otherParams);

      const message = ts
        ? `${path}|${ts}|${sortedParams}`
        : `${path}|${sortedParams}`;

      if (this.config.validityWindow && ts) {
        const timestamp = parseInt(ts, 10);
        const now = Math.floor(Date.now() / 1000);
        if (now - timestamp > this.config.validityWindow) {
          return false;
        }
      }

      const computedSignature = await this.generateSignature(
        message,
        key.secret
      );
      return computedSignature === sig;
    } catch {
      return false;
    }
  }
}

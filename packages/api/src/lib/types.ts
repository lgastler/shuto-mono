export interface ShutoConfig {
  baseUrl: string;
  apiKey?: string;
}

export interface ErrorResponse {
  code: string;
  error: string;
  details?: string;
}

export interface ImageParams {
  path: string;
  w?: number;
  h?: number;
  fit?: 'clip' | 'crop' | 'fill';
  fm?: 'jpg' | 'jpeg' | 'png' | 'webp';
  q?: number;
  dpr?: number;
  blur?: number;
  dl?: boolean;
  excludeBaseUrl?: boolean;
}

export interface DownloadParams {
  path: string;
}

export interface RcloneFile {
  isDir: boolean;
  mimeType: string;
  name: string;
  path: string;
  size: number;
}

export interface SigningKey {
  id: string;
  secret: string;
}

export interface SignerConfig {
  keys: SigningKey[];
  validityWindow?: number;
  defaultKeyId?: string;
}

export interface SignedParams {
  kid: string;
  ts?: string;
  sig: string;
}

export type ShutoEndpoint = 'image' | 'download';

export interface SignUrlOptions {
  endpoint: ShutoEndpoint;
  params?: Record<string, string | number | boolean | undefined>;
}

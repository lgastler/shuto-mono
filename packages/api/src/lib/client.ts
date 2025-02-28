import {
  ShutoConfig,
  ImageParams,
  DownloadParams,
  File,
  ErrorResponse,
  SignerConfig,
  NonImageFile,
  ImageFile,
  ListContentsOptions,
} from './types.js';
import { ShutoURLSigner } from './signer.js';

export class ShutoClient {
  private readonly config: ShutoConfig;
  private readonly signer?: ShutoURLSigner;

  constructor(config: ShutoConfig, signerConfig?: SignerConfig) {
    this.config = config;
    if (signerConfig) {
      this.signer = new ShutoURLSigner(signerConfig);
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: ErrorResponse;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          code: response.status.toString(),
          error: response.statusText,
        };
      }
      throw new Error(JSON.stringify(errorData));
    }

    return response.json();
  }

  async getImageUrl(params: ImageParams): Promise<string> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      ...params,
    };
    delete queryParams.path;
    delete queryParams.excludeBaseUrl;

    const path = `/v2/image/${params.path}`;
    let signedUrl: string;

    if (this.signer) {
      signedUrl = await this.signer.generateSignedURL(path, {
        endpoint: 'image',
        params: queryParams,
      });
    } else {
      const searchParams = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
      const query = searchParams.toString();
      signedUrl = `${path}${query ? `?${query}` : ''}`;
    }

    return params.excludeBaseUrl
      ? signedUrl
      : `${this.config.baseUrl}${signedUrl}`;
  }

  async getDownloadUrl(params: DownloadParams): Promise<string> {
    const path = `/v2/download/${encodeURIComponent(params.path)}`;
    if (this.signer) {
      return this.signer.generateSignedURL(path, {
        endpoint: 'download',
        params: {},
      });
    }
    return path;
  }

  private isImageFile(file: File): file is ImageFile {
    return (
      'width' in file &&
      'height' in file &&
      typeof file.width === 'number' &&
      typeof file.height === 'number'
    );
  }

  async listContents(
    path: string,
    options: ListContentsOptions = {}
  ): Promise<(NonImageFile | ImageFile)[]> {
    if (!this.config.apiKey) {
      throw new Error('API key is required for listing contents');
    }

    const url = `${this.config.baseUrl}/v2/list/${encodeURIComponent(path)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
      },
    });

    const files = await this.handleResponse<File[]>(response);
    return files
      .map((file) => ({
        ...file,
        fullPath: `${path}/${file.path}`.replace(/\/+/g, '/'),
      }))
      .filter((file) => {
        if (!options.filter) return true;
        if (typeof options.filter === 'string') {
          return file.path.includes(options.filter);
        }
        return options.filter.test(file.path);
      })
      .map((file) => {
        if (this.isImageFile(file)) {
          return file;
        }
        return file as NonImageFile;
      });
  }
}

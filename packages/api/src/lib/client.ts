import {
  ShutoConfig,
  ImageParams,
  DownloadParams,
  File,
  ErrorResponse,
  SignerConfig,
  NonImageFile,
  ImageFile,
} from './types.js';
import { ShutoURLSigner } from './signer.js';

export class ShutoClient {
  private readonly config: ShutoConfig;
  private readonly signer: ShutoURLSigner;

  constructor(config: ShutoConfig, signerConfig: SignerConfig) {
    this.config = config;
    this.signer = new ShutoURLSigner(signerConfig);
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
    const signedUrl = await this.signer.generateSignedURL(path, {
      endpoint: 'image',
      params: queryParams,
    });

    return params.excludeBaseUrl
      ? signedUrl
      : `${this.config.baseUrl}${signedUrl}`;
  }

  async getDownloadUrl(params: DownloadParams): Promise<string> {
    const path = `/v2/download/${encodeURIComponent(params.path)}`;
    return this.signer.generateSignedURL(path, {
      endpoint: 'download',
      params: {},
    });
  }

  async listContents(path: string): Promise<(NonImageFile | ImageFile)[]> {
    if (!this.config.apiKey) {
      throw new Error('API key is required for listing contents');
    }

    const response = await fetch(
      `${this.config.baseUrl}/v2/list/${encodeURIComponent(path)}`,
      {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      }
    );

    const files = await this.handleResponse<File[]>(response);
    const resultFiles = files.map((file) => {
      if ('width' in file && 'height' in file) {
        return file as ImageFile;
      }
      return file as NonImageFile;
    });

    return resultFiles;
  }
}

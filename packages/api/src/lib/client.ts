import {
  ShutoConfig,
  ImageParams,
  DownloadParams,
  RcloneFile,
  ErrorResponse,
  SignerConfig,
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

    const path = `/v2/image/${encodeURIComponent(params.path)}`;
    return this.signer.generateSignedURL(path, {
      endpoint: 'image',
      params: queryParams,
    });
  }

  async getDownloadUrl(params: DownloadParams): Promise<string> {
    const path = `/v2/download/${encodeURIComponent(params.path)}`;
    return this.signer.generateSignedURL(path, {
      endpoint: 'download',
      params: {},
    });
  }

  async listContents(path: string): Promise<RcloneFile[]> {
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

    return this.handleResponse<RcloneFile[]>(response);
  }
}

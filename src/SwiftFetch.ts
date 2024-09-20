type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface SwiftFetchConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

interface RequestConfig extends SwiftFetchConfig {
  url: string;
  method: Method;
  data?: any;
  params?: Record<string, string | number>;
}

interface SwiftFetchResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

class SwiftFetch {
  private config: SwiftFetchConfig;

  constructor(config: SwiftFetchConfig = {}) {
    this.config = config;
  }

  private async request<T = any>(config: RequestConfig): Promise<SwiftFetchResponse<T>> {
    const { url, method, data, params, headers, timeout } = config;
    const fullUrl = this.buildUrl(url, params);

    const controller = new AbortController();
    const timeoutId = timeout ? setTimeout(() => controller.abort(), timeout) : null;

    try {
      const response = await fetch(fullUrl, {
        method,
        headers: { ...this.config.headers, ...headers },
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      if (timeoutId) clearTimeout(timeoutId);

      const responseData = await this.parseResponse<T>(response);

      return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: this.parseHeaders(response.headers),
      };
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      throw this.handleError(error);
    }
  }

  private parseHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  private buildUrl(url: string, params?: Record<string, string | number>): string {
    const fullUrl = this.config.baseURL ? `${this.config.baseURL}${url}` : url;
    if (!params) return fullUrl;

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => searchParams.append(key, String(value)));
    return `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}${searchParams.toString()}`;
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json();
    }
    return response.text() as unknown as T;
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error.name === 'AbortError'
        ? new Error('Request timed out')
        : new Error(`SwiftFetch Error: ${error.message}`);
    }
    return new Error('An unknown error occurred');
  }

  get<T = any>(url: string, config?: Omit<RequestConfig, 'url' | 'method'>): Promise<SwiftFetchResponse<T>> {
    return this.request<T>({ ...config, url, method: 'GET' });
  }

  post<T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>): Promise<SwiftFetchResponse<T>> {
    return this.request<T>({ ...config, url, method: 'POST', data });
  }

  put<T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>): Promise<SwiftFetchResponse<T>> {
    return this.request<T>({ ...config, url, method: 'PUT', data });
  }

  delete<T = any>(url: string, config?: Omit<RequestConfig, 'url' | 'method'>): Promise<SwiftFetchResponse<T>> {
    return this.request<T>({ ...config, url, method: 'DELETE' });
  }

  patch<T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>): Promise<SwiftFetchResponse<T>> {
    return this.request<T>({ ...config, url, method: 'PATCH', data });
  }
}

export default SwiftFetch;
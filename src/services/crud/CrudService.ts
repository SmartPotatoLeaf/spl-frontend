// Generic CRUD service base class
// Provides:
// - public: getAll(), getById(id)
// - protected: httpGet, httpPost, httpPut, httpDelete (usable by subclasses)
// - automatic Authorization header using a token from localStorage or a provided tokenProvider
// - limited retry logic for transient errors (network failures, 5xx, 429) with exponential backoff

export type TokenProvider = () => string | null | undefined;

export interface CrudServiceOptions {
  maxRetries?: number; // total attempts (default 3)
  retryDelayMs?: number; // base delay for backoff in ms (default 300)
  tokenKey?: string; // localStorage key to read token from (default: 'authToken')
  tokenProvider?: TokenProvider; // optional function to provide token (used before localStorage)
  defaultHeaders?: Record<string, string>;
}

export abstract class CrudService<T, CreateDto = any, UpdateDto = any> {
  protected baseUrl: string;
  protected maxRetries: number;
  protected retryDelayMs: number;
  protected tokenKey: string;
  protected tokenProvider?: TokenProvider;
  protected defaultHeaders: Record<string, string>;

  protected constructor(baseUrl: string, options: CrudServiceOptions = {}) {
    this.baseUrl = baseUrl;
    this.maxRetries = options.maxRetries ?? 3;
    this.retryDelayMs = options.retryDelayMs ?? 300;
    this.tokenKey = options.tokenKey ?? 'authToken';
    this.tokenProvider = options.tokenProvider;
    this.defaultHeaders = options.defaultHeaders ?? {};
  }

  // Public methods expected by callers/services
  protected async fetchAll(query?: Record<string, string | number | boolean>): Promise<T[]> {
    const qp = query ? `?${new URLSearchParams(StringObjectMap(query)).toString()}` : '';
    return await this.httpGet(`${qp}`) as Promise<T[]>;
  }

  protected async fetchById(id: string | number): Promise<T> {
    return await this.httpGet(`/${id}`) as Promise<T>;
  }

  // Protected HTTP helpers for subclasses
  protected async httpGet(path = ''): Promise<any> {
    return this.request(path, {method: 'GET'});
  }

  protected async httpPost(path = '', body?: any): Promise<any> {
    const init: RequestInit = {method: 'POST'};
    if (body !== undefined) {
      init.body = JSON.stringify(body);
      init.headers = {'Content-Type': 'application/json'};
    }
    return this.request(path, init);
  }

  protected async httpPut(path = '', body?: any): Promise<any> {
    const init: RequestInit = {method: 'PUT'};
    if (body !== undefined) {
      init.body = JSON.stringify(body);
      init.headers = {'Content-Type': 'application/json'};
    }
    return this.request(path, init);
  }

  protected async httpDelete(path = ''): Promise<any> {
    return this.request(path, {method: 'DELETE'});
  }

  // Core request with retry and auth
  protected async request(path: string, init: RequestInit = {}, attempt = 1): Promise<any> {
    const url = this.buildUrl(path);

    // Merge headers (preserve existing init.headers)
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...(init.headers as Record<string, string> | undefined),
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Attach headers back to init
    const finalInit: RequestInit = {...init, headers};

    try {
      const response = await fetch(url, finalInit);

      if (!response.ok) {
        // Retry on transient server errors (5xx) and rate limiting (429)
        if (attempt < this.maxRetries && (response.status >= 500 || response.status === 429)) {
          await this.delay(this.retryDelayMs * Math.pow(2, attempt - 1));
          return this.request(path, init, attempt + 1);
        }

        // Try to extract error body
        let errText = '';
        try {
          const ct = response.headers.get('content-type') || '';
          if (ct.includes('application/json')) {
            const json = await response.json();
            errText = JSON.stringify(json);
          } else {
            errText = await response.text();
          }
        } catch (e) {
          errText = response.statusText;
        }

        throw new Error(`Request failed ${response.status} ${response.statusText}: ${errText}`);
      }

      // Successful response: try to parse JSON, fallback to text
      if (response.status === 204) return undefined;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) return response.json();
      return response.text();
    } catch (err: any) {
      // Network or other error
      if (attempt < this.maxRetries) {
        await this.delay(this.retryDelayMs * Math.pow(2, attempt - 1));
        return this.request(path, init, attempt + 1);
      }
      throw err;
    }
  }

  // Helpers
  protected getAuthToken(): string | null | undefined {
    // tokenProvider has priority
    if (this.tokenProvider) {
      try {
        const token = this.tokenProvider();
        if (token) return token;
      } catch (_) {
        // ignore provider errors
      }
    }

    // Fallback to localStorage (only available in browser)
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return window.localStorage.getItem(this.tokenKey);
      } catch (_) {
        return null;
      }
    }

    return null;
  }

  protected buildUrl(path: string) {
    // Normalize base and path to avoid duplicate slashes
    const base = this.baseUrl.replace(/\/+$/, '');
    if (!path) return base;
    const p = path.replace(/^\/+/, '');
    return `${base}/${p}`;
  }

  protected delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Utility to convert a Record<string, string|number|boolean> into Record<string,string>
function StringObjectMap(obj: Record<string, string | number | boolean>) {
  const out: Record<string, string> = {};
  for (const k in obj) {
    const v = obj[k];
    out[k] = typeof v === 'string' ? v : String(v);
  }
  return out;
}

export default CrudService;


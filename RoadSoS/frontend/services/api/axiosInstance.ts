import { API_BASE_URL, API_TIMEOUT } from '../../constants/api';
import { storage } from '../../utils/storage';

// ─────────────────────────────────────────────────────────────
// Custom fetch-based API client (no axios needed)
// Using native fetch which is built into React Native
// ─────────────────────────────────────────────────────────────

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const request = async <T = any>(
  method: Method,
  endpoint: string,
  body?: object
): Promise<T> => {
  const token = storage.getItem('token'); // sync read from memory store

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      signal: controller.signal as any,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    clearTimeout(timeoutId);

    const data = await response.json() as any;

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Check your connection.');
    }
    throw err;
  }
};

// ── Exported API client ───────────────────────────────────────
const apiClient = {
  get:    <T = any>(endpoint: string)                  => request<T>('GET',    endpoint),
  post:   <T = any>(endpoint: string, body: object)    => request<T>('POST',   endpoint, body),
  put:    <T = any>(endpoint: string, body: object)    => request<T>('PUT',    endpoint, body),
  delete: <T = any>(endpoint: string)                  => request<T>('DELETE', endpoint),
};

export default apiClient;

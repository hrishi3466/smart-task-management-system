import { getStoredToken, removeStoredToken } from '../utils/storageUtils';

/**
 * Custom ApiError class for structured error handling
 */
export class ApiError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

/**
 * Parse human-readable error messages from an ApiError or generic Error
 */
export const parseApiError = (error) => {
  if (error instanceof ApiError) {
    if (error.errors && error.errors.length > 0) {
      return error.errors.join(', ');
    }
    return error.message || 'An unexpected error occurred';
  }
  return error?.message || 'Network connection failure';
};

const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').trim();
const normalizedBase = rawBaseUrl.replace(/\/+$/, '');
const BASE_URL = normalizedBase.endsWith('/api')
  ? normalizedBase
  : `${normalizedBase}/api`;


/**
 * Core Fetch-based HTTP request wrapper
 */
async function request(endpoint, options = {}) {
  const cleanEndpoint = endpoint.replace(/^\/api(?=\/|$)/, '').replace(/^\/*/, '/');
  const url = `${BASE_URL}${cleanEndpoint}`;

  const token = getStoredToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch (networkError) {
    throw new ApiError(0, 'Unable to connect to backend server. Please check your connection.', []);
  }

  // Handle 401 Unauthorized automatically
  if (response.status === 401) {
    removeStoredToken();
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    let errorMessage = 'Authentication is required';
    try {
      const errJson = await response.json();
      errorMessage = errJson.message || errorMessage;
    } catch {
      // Ignore JSON parse errors on 401
    }
    throw new ApiError(401, errorMessage, []);
  }

  let json = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      json = await response.json();
    } catch {
      json = null;
    }
  }

  if (!response.ok) {
    const errorMsg = json?.message || `Request failed with status ${response.status}`;
    const fieldErrors = json?.errors || [];
    throw new ApiError(response.status, errorMsg, fieldErrors);
  }

  // If response is wrapped in standard ApiResponse { success, data, ... }
  if (json && typeof json === 'object' && 'data' in json) {
    return json.data;
  }

  // Raw response (e.g. GET /api/users/me returning UserResponse directly)
  return json;
}

export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
};

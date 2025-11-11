// API utility using native fetch (NO AXIOS)

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const handleResponse = async (response) => {
  // 204/304 have no body -> don't try to parse JSON
  if (response.status === 204 || response.status === 304) {
    if (!response.ok) {
      throw new Error('Request failed'); // just in case
    }
    return {}; // or return null; callers should handle this
  }

  // Safely parse JSON (some endpoints may return empty string)
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed');
  }
  return data;
};

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store', // <- avoid 304s entirely during dev
      headers: { 'Cache-Control': 'no-cache' },
    });
    return handleResponse(response);
  },

  post: async (endpoint, body) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    return handleResponse(response);
  },

  put: async (endpoint, body) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    return handleResponse(response);
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include',
      cache: 'no-store',
    });
    return handleResponse(response);
  },

  uploadFile: async (endpoint, formData) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
      cache: 'no-store',
    });
    return handleResponse(response);
  },
};

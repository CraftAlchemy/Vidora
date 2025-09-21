const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1';

type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  body?: any;
};

export const apiFetch = async (endpoint: string, options: ApiFetchOptions = {}) => {
  const token = localStorage.getItem('authToken');
  const headers: HeadersInit = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  // Automatically stringify JSON body, unless it's FormData
  if (options.body && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ msg: 'An unknown error occurred.' }));
    throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
  }

  // Handle responses with no content
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  }
};
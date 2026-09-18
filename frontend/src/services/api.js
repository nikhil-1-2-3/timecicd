const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to perform authenticated / unauthenticated API requests
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('timecheck_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(
        data.message || `Request failed with status ${response.status}`
      );
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(
        'Unable to connect to the TimeCheck backend server. Please make sure the backend is running.'
      );
    }
    throw err;
  }
}

// Auth API endpoints
export const authService = {
  register: (userData) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: userData,
    }),

  login: (credentials) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: credentials,
    }),

  getMe: () =>
    apiRequest('/auth/me', {
      method: 'GET',
    }),
};

// Form & Time API endpoints
export const formService = {
  submitForm: (formData) =>
    apiRequest('/forms', {
      method: 'POST',
      body: formData,
    }),

  getMySubmissions: () =>
    apiRequest('/forms/my', {
      method: 'GET',
    }),

  getSubmissionById: (id) =>
    apiRequest(`/forms/${id}`, {
      method: 'GET',
    }),
};

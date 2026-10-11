const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000/api';

export const apiClient = {
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = localStorage.getItem('token');
    const isPublicAuthEndpoint = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');
    
    if (token && !isPublicAuthEndpoint) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        let errorMessage = 'An error occurred while fetching data';
        try {
          const text = await response.text();
          try {
            const errData = JSON.parse(text);
            errorMessage = errData.message || errData.error || text || errorMessage;
          } catch {
            errorMessage = text || errorMessage;
          }
        } catch (e) {
          // not readable
        }
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error(`[API Error] ${endpoint}:`, error);
      throw error;
    }
  },

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  },

  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },
  
  async postFormData(endpoint, formData) {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData
      });
      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errData = await response.json();
          errorMessage = errData.message || errorMessage;
        } catch (e) {}
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error(`[API Error] ${endpoint}:`, error);
      throw error;
    }
  },
  
  async put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  async patch(endpoint, body) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  },

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};

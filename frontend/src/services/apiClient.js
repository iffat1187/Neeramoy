// Basic API Client foundation for future Spring Boot integration
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const apiClient = {
  async get(endpoint) {
    // const response = await fetch(`${BASE_URL}${endpoint}`);
    // return response.json();
    console.log(`[MOCK API] GET ${endpoint}`);
    return null;
  }
};

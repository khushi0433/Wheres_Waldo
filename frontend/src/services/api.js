// API service for backend communication
const FRONTEND_URL = 'http://localhost:5173';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'; // Default base URL
export { FRONTEND_URL };

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method for making API calls
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log('Making API request to:', url);
    console.log('Request options:', options);
    
    const defaultOptions = {
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API error response:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API response data:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Game session management
  async createSession(photoId) {
    return this.makeRequest('/v1/sessions', {
      method: 'POST',
      body: JSON.stringify({ photoId }),
    });
  }

  // Submit a guess
  async submitGuess(characterId, x, y) {
    return this.makeRequest('/v1/guesses', {
      method: 'POST',
      body: JSON.stringify({ characterId, x, y }),
    });
  }

  // Complete the game
  async completeGame(playerName) {
    return this.makeRequest('/v1/completed', {
      method: 'POST',
      body: JSON.stringify({ playerName }),
    });
  }

  // Get leaderboard
  async getLeaderboard(photoId) {
    return this.makeRequest(`/v1/leaderboard?photoId=${photoId}`, {
      method: 'GET',
    });
  }

  // Admin: Create a new photo
  async createPhoto(title, imageUrl, adminSecret) {
    return this.makeRequest('/v1/admin/photos', {
      method: 'POST',
      headers: {
        'x-admin-secret': adminSecret,
      },
      body: JSON.stringify({ title, imageUrl }),
    });
  }

  // Health check
  async healthCheck() {
    return this.makeRequest('/v1/healthz', {
      method: 'GET',
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;


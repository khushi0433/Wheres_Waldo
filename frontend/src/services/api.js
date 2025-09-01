// API service for backend communication
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method for making API calls
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
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
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
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

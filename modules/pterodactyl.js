const axios = require('axios');

class PterodactylPanel {
  /**
   * Creates a new Pterodactyl panel client
   * @param {string} panelUrl - The URL of your Pterodactyl panel
   * @param {string} apiKey - Your Pterodactyl API key
   */
  constructor(panelUrl, apiKey) {
    this.panelUrl = panelUrl.replace(/\/$/, ''); // Remove trailing slash if present
    this.apiKey = apiKey;
    
    // Create axios instance with default configuration
    this.api = axios.create({
      baseURL: `${this.panelUrl}/api/client`,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    });
  }

  /**
   * Get server information
   * @param {string} serverId - The server identifier from Pterodactyl
   * @returns {Promise<Object>} Server information
   */
  async getServerInfo(serverId) {
    try {
      const response = await this.api.get(`/servers/${serverId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get server resource usage
   * @param {string} serverId - The server identifier from Pterodactyl
   * @returns {Promise<Object>} Server resource usage
   */
  async getServerResources(serverId) {
    try {
      const response = await this.api.get(`/servers/${serverId}/resources`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Send command to server
   * @param {string} serverId - The server identifier from Pterodactyl
   * @param {string} command - The command to send to the server
   * @returns {Promise<Object>} Response from the server
   */
  async sendCommand(serverId, command) {
    try {
      const response = await this.api.post(`/servers/${serverId}/command`, {
        command: command
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Power server action (start, stop, restart, kill)
   * @param {string} serverId - The server identifier from Pterodactyl
   * @param {string} action - The power action (start, stop, restart, kill)
   * @returns {Promise<Object>} Response from the server
   */
  async powerAction(serverId, action) {
    const validActions = ['start', 'stop', 'restart', 'kill'];
    
    if (!validActions.includes(action)) {
      throw new Error(`Invalid power action. Must be one of: ${validActions.join(', ')}`);
    }

    try {
      const response = await this.api.post(`/servers/${serverId}/power`, {
        signal: action
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Start the server
   * @param {string} serverId - The server identifier from Pterodactyl
   * @returns {Promise<Object>} Response from the server
   */
  async startServer(serverId) {
    return this.powerAction(serverId, 'start');
  }

  /**
   * Stop the server
   * @param {string} serverId - The server identifier from Pterodactyl
   * @returns {Promise<Object>} Response from the server
   */
  async stopServer(serverId) {
    return this.powerAction(serverId, 'stop');
  }

  /**
   * Restart the server
   * @param {string} serverId - The server identifier from Pterodactyl
   * @returns {Promise<Object>} Response from the server
   */
  async restartServer(serverId) {
    return this.powerAction(serverId, 'restart');
  }

  /**
   * Kill the server (force stop)
   * @param {string} serverId - The server identifier from Pterodactyl
   * @returns {Promise<Object>} Response from the server
   */
  async killServer(serverId) {
    return this.powerAction(serverId, 'kill');
  }

  /**
   * Get server subusers
   * @param {string} serverId - The server identifier from Pterodactyl
   * @returns {Promise<Object>} List of subusers
   */
  async getSubusers(serverId) {
    try {
      const response = await this.api.get(`/servers/${serverId}/users`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get server files
   * @param {string} serverId - The server identifier from Pterodactyl
   * @param {string} directory - The directory to list (default: /)
   * @returns {Promise<Object>} List of files in the directory
   */
  async getFiles(serverId, directory = '/') {
    try {
      const response = await this.api.get(`/servers/${serverId}/files/list`, {
        params: { directory }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get server startup information
   * @param {string} serverId - The server identifier from Pterodactyl
   * @returns {Promise<Object>} Server startup information
   */
  async getStartup(serverId) {
    try {
      const response = await this.api.get(`/servers/${serverId}/startup`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update server startup variables
   * @param {string} serverId - The server identifier from Pterodactyl
   * @param {Object} startup - The new startup configuration
   * @returns {Promise<Object>} Response from the server
   */
  async updateStartup(serverId, startup) {
    try {
      const response = await this.api.put(`/servers/${serverId}/startup`, startup);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Format error for consistent handling
   * @param {Object} error - The error object
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.errors?.[0]?.detail || error.response.statusText || 'Unknown error';
      return new Error(`Pterodactyl API Error (${status}): ${message}`);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('No response received from Pterodactyl panel. Please check your connection and panel URL.');
    } else {
      // Something else happened
      return new Error(`Request error: ${error.message}`);
    }
  }
}

module.exports = PterodactylPanel;
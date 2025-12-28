# Modules Directory

This directory contains specialized modules for the Discord Game Server Bot.

## Available Modules

### Pterodactyl Panel Integration (`pterodactyl.js`)

A comprehensive module for connecting to and controlling game servers hosted on Pterodactyl Panel.

#### Features:
- Server information retrieval
- Server control (start, stop, restart, kill)
- Resource usage monitoring
- Command sending to servers
- File management
- Subuser management
- Startup configuration management

#### Usage:
```javascript
const PterodactylPanel = require('./modules/pterodactyl');

// Initialize the client
const ptero = new PterodactylPanel('https://your-panel.com', 'your-api-key');

// Example: Get server information
try {
  const serverInfo = await ptero.getServerInfo('server-identifier');
  console.log(serverInfo);
} catch (error) {
  console.error('Error:', error.message);
}
```

#### Integration with Main Bot:
The main `index.js` file automatically integrates with this module when Pterodactyl configuration is provided in the `.env` file. The bot will use the Pterodactyl API to control your game server instead of mock functions.

#### Required Environment Variables:
- `PTERODACTYL_URL` - Your Pterodactyl panel URL
- `PTERODACTYL_API_KEY` - Your Pterodactyl API key
- `PTERODACTYL_SERVER_ID` - Your server identifier in Pterodactyl

#### Error Handling:
The module provides comprehensive error handling that returns appropriate error messages for:
- API errors (with status codes)
- Network errors
- Invalid actions
- Connection issues
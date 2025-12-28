# Pterodactyl Panel Module

This module provides a comprehensive interface for interacting with the Pterodactyl Panel API from your Discord bot.

## Features

- Server information retrieval
- Server control (start, stop, restart, kill)
- Resource usage monitoring
- Command sending to servers
- File management
- Subuser management
- Startup configuration management

## Installation

Make sure you have `axios` installed in your project:

```bash
npm install axios
```

## Usage

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

## Methods

### Constructor
- `new PterodactylPanel(panelUrl, apiKey)` - Creates a new Pterodactyl panel client

### Server Management
- `getServerInfo(serverId)` - Get server information
- `getServerResources(serverId)` - Get server resource usage
- `startServer(serverId)` - Start the server
- `stopServer(serverId)` - Stop the server
- `restartServer(serverId)` - Restart the server
- `killServer(serverId)` - Kill the server (force stop)
- `powerAction(serverId, action)` - Power server action (start, stop, restart, kill)

### Server Interaction
- `sendCommand(serverId, command)` - Send command to server

### File Management
- `getFiles(serverId, directory = '/')` - Get server files

### User Management
- `getSubusers(serverId)` - Get server subusers

### Configuration
- `getStartup(serverId)` - Get server startup information
- `updateStartup(serverId, startup)` - Update server startup variables

### Error Handling
- `handleError(error)` - Format error for consistent handling (internal method)

## Integration with Discord Bot

To integrate with your Discord bot, you can use this module in your command handlers:

```javascript
const PterodactylPanel = require('./modules/pterodactyl');

// Initialize with environment variables
const ptero = new PterodactylPanel(
  process.env.PTERODACTYL_URL,
  process.env.PTERODACTYL_API_KEY
);

// Example: Get server status
async function getServerStatus(interaction, serverId) {
  try {
    const resources = await ptero.getServerResources(serverId);
    const status = resources.attributes.current_state;
    const cpu = resources.attributes.resources.cpu_absolute;
    const memory = resources.attributes.resources.memory_bytes / (1024 * 1024); // MB
    
    // Send status embed to Discord
    await interaction.reply({
      embeds: [{
        title: 'Server Status',
        fields: [
          { name: 'Status', value: status, inline: true },
          { name: 'CPU Usage', value: `${cpu}%`, inline: true },
          { name: 'Memory Usage', value: `${memory.toFixed(2)} MB`, inline: true }
        ]
      }]
    });
  } catch (error) {
    await interaction.reply({ content: `Error: ${error.message}`, ephemeral: true });
  }
}
```

## Required Environment Variables

Add these to your `.env` file:
- `PTERODACTYL_URL` - Your Pterodactyl panel URL
- `PTERODACTYL_API_KEY` - Your Pterodactyl API key

## Error Handling

The module provides comprehensive error handling that will return appropriate error messages for:
- API errors (with status codes)
- Network errors
- Invalid actions
- Connection issues
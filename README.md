# Discord Game Server Bot

A Discord bot that provides controls for managing a game server with start, stop, and restart functionality.

## Features

- 🟢 Start the game server
- 🔴 Stop the game server  
- 🔁 Restart the game server
- Real-time server status display
- Uptime tracking
- Active users count
- Server IP address display
- Role-based authorization

## Requirements

- Node.js 16.6.0 or higher
- Discord.js v14
- A Discord bot token

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Discord bot and get your bot token:
   - Go to the [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Create a bot under the application
   - Copy the bot token

4. Configure the bot by editing the `.env` file:
   ```
   DISCORD_TOKEN=your_actual_discord_bot_token_here
   SERVER_IP=your_game_server_ip:port
   ```

5. Update authorized roles in `index.js`:
   ```javascript
   const AUTHORIZED_ROLES = [
       'Owner',  // Replace with your actual role names
       'Admin',
       // Add more roles as needed
   ];
   ```

6. Optionally add specific authorized user IDs in `index.js`:
   ```javascript
   const AUTHORIZED_USER_IDS = [
       '123456789012345678',  // Replace with actual user IDs
       // Add more user IDs as needed
   ];
   ```

7. Make sure your Discord bot has the following permissions:
   - View Channels
   - Send Messages
   - Embed Links
   - Read Message History
   - Use Application Commands
   - Manage Messages (for button interactions)

## Usage

1. Start the bot:
   ```bash
   npm start
   ```

2. Invite the bot to your Discord server

3. In any channel, type `!server` or `!status` to display the server status panel with control buttons

4. Only users with authorized roles or IDs can interact with the control buttons

## Commands

- `!server` or `!status` - Display the game server status panel with control buttons

## Authorization

The bot checks for authorization in this order:
1. User has one of the roles listed in `AUTHORIZED_ROLES`
2. User ID is in the `AUTHORIZED_USER_IDS` array

## Example Messages

When a user with proper authorization performs an action:

- **Start Server**: ✅ Game server has been started successfully!
- **Stop Server**: 🛑 Game server has been stopped successfully!
- **Restart Server**: 🔄 Game server has been restarted successfully!

Unauthorized users will see: ❌ You do not have permission to use these controls!

## Embed Display

The server status embed shows:
- Status (🟢 Active or 🔴 Inactive)
- Uptime (formatted as days, hours, minutes, seconds)
- Active Users count
- Server IP address
- Max Players capacity

## Integration with Real Game Server

To connect this bot to an actual game server, you would need to replace the mock functions (`startServer`, `stopServer`, `restartServer`) with actual implementations that communicate with your game server using appropriate protocols (SSH, RCON, REST API, etc.).

## License

MIT

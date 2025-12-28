# Discord Bot Messages Examples

This document shows how the Discord bot messages will appear in your server when using the game server control bot.

## Initial Status Command

When a user types `!server` or `!status`, they will see:

```
🎮 Game Server Status
Status: 🔴 Inactive
Uptime: Not running
Active Users: 0
Server IP: `192.168.1.100:27015`
Max Players: 32

[Start Server (🟢)] [Stop Server (🔴)] [Restart Server (🔁)]
```

## After Starting the Server

When an authorized user clicks the "Start Server" button, other users will see:

```
🎮 Game Server Status
Status: 🟢 Active
Uptime: 5m 23s
Active Users: 4
Server IP: `192.168.1.100:27015`
Max Players: 32

[Start Server (🟢)] [Stop Server (🔴)] [Restart Server (🔁)]
```

And the authorized user who clicked the button will receive a private notification:

> ✅ Game server has been started successfully!

## After Stopping the Server

When an authorized user clicks the "Stop Server" button, the embed updates to:

```
🎮 Game Server Status
Status: 🔴 Inactive
Uptime: Not running
Active Users: 0
Server IP: `192.168.1.100:27015`
Max Players: 32

[Start Server (🟢)] [Stop Server (🔴)] [Restart Server (🔁)]
```

And the authorized user receives:

> 🛑 Game server has been stopped successfully!

## After Restarting the Server

When an authorized user clicks the "Restart Server" button, the embed updates and the user receives:

> 🔄 Game server has been restarted successfully!

## Unauthorized Access Attempt

When an unauthorized user tries to click any of the control buttons, they receive a private notification:

> ❌ You do not have permission to use these controls!

## Server Already Running

If someone tries to start an already running server:

> ⚠️ Server is already running!

## Server Already Stopped

If someone tries to stop an already stopped server:

> ⚠️ Server is already stopped!

## Error Messages

If there's an error during any operation:

> ❌ An error occurred while processing your request.

## Uptime Formatting Examples

The uptime is displayed in a human-readable format:

- `Not running` - When server is inactive
- `34s` - 34 seconds
- `5m 23s` - 5 minutes and 23 seconds
- `2h 15m 8s` - 2 hours, 15 minutes, and 8 seconds
- `1d 3h 45m 12s` - 1 day, 3 hours, 45 minutes, and 12 seconds

## Embed Colors

- **🟢 Active Status**: Green color (hex: #00ff00)
- **🔴 Inactive Status**: Red color (hex: #ff0000)

The embed also includes a footer with the text "Game Server Control Panel" and a timestamp showing when the status was last updated.
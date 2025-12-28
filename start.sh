#!/bin/bash

# Discord Game Server Bot - Startup Script

echo "==================================="
echo "Discord Game Server Bot"
echo "==================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your Discord token."
    echo "Copy .env.example if available or create your own:"
    echo "  DISCORD_TOKEN=your_discord_bot_token_here"
    echo "  SERVER_IP=your_game_server_ip:port"
    echo ""
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo ""
fi

echo "🚀 Starting Discord Game Server Bot..."
echo ""

# Start the bot
node index.js

echo ""
echo "Bot has stopped."
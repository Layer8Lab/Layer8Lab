const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
require('dotenv').config();

// Initialize the Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Game server configuration
const GAME_SERVER_CONFIG = {
    ip: process.env.SERVER_IP || '192.168.1.100:27015', // Default IP, can be overridden with environment variable
    maxPlayers: 32,
    // Game server state
    status: 'inactive', // 'active' or 'inactive'
    uptime: 0, // in seconds
    activeUsers: 0,
    startTime: null
};

// Authorized roles and user IDs
const AUTHORIZED_ROLES = [
    'Owner', // Role name
    'Admin'  // Role name
    // Add more role IDs or names as needed
];

const AUTHORIZED_USER_IDS = [
    // Add specific user IDs here
    // '123456789012345678', // Example user ID
];

// Function to check if user is authorized
function isUserAuthorized(member) {
    // Check if user has authorized roles
    const hasRole = member.roles.cache.some(role => AUTHORIZED_ROLES.includes(role.name) || AUTHORIZED_ROLES.includes(role.id));
    
    // Check if user is in authorized user IDs
    const isAuthorizedUser = AUTHORIZED_USER_IDS.includes(member.id);
    
    return hasRole || isAuthorizedUser;
}

// Function to format uptime
function formatUptime(uptimeSeconds) {
    if (!uptimeSeconds || uptimeSeconds <= 0) {
        return 'Not running';
    }
    
    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    
    let result = '';
    if (days > 0) result += `${days}d `;
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    if (seconds > 0) result += `${seconds}s`;
    
    return result.trim();
}

// Function to update server status
function updateServerStatus(newStatus) {
    GAME_SERVER_CONFIG.status = newStatus;
    
    if (newStatus === 'active') {
        GAME_SERVER_CONFIG.startTime = new Date();
        // Simulate updating uptime every second
        if (!GAME_SERVER_CONFIG.uptimeInterval) {
            GAME_SERVER_CONFIG.uptimeInterval = setInterval(() => {
                if (GAME_SERVER_CONFIG.status === 'active' && GAME_SERVER_CONFIG.startTime) {
                    GAME_SERVER_CONFIG.uptime = Math.floor((Date.now() - GAME_SERVER_CONFIG.startTime.getTime()) / 1000);
                }
            }, 1000);
        }
    } else {
        GAME_SERVER_CONFIG.uptime = 0;
        if (GAME_SERVER_CONFIG.uptimeInterval) {
            clearInterval(GAME_SERVER_CONFIG.uptimeInterval);
            GAME_SERVER_CONFIG.uptimeInterval = null;
        }
        GAME_SERVER_CONFIG.startTime = null;
    }
}

// Function to simulate server actions (in a real implementation, these would connect to your actual game server)
async function startServer() {
    // Simulate starting the server
    console.log('Starting game server...');
    updateServerStatus('active');
    GAME_SERVER_CONFIG.activeUsers = Math.floor(Math.random() * 10); // Random users for demo
    return true;
}

async function stopServer() {
    // Simulate stopping the server
    console.log('Stopping game server...');
    updateServerStatus('inactive');
    GAME_SERVER_CONFIG.activeUsers = 0;
    return true;
}

async function restartServer() {
    // Simulate restarting the server
    console.log('Restarting game server...');
    await stopServer();
    // Wait a moment before starting again
    await new Promise(resolve => setTimeout(resolve, 2000));
    await startServer();
    return true;
}

// Function to create the server status embed
function createServerStatusEmbed() {
    const statusColor = GAME_SERVER_CONFIG.status === 'active' ? 0x00ff00 : 0xff0000; // Green for active, red for inactive
    
    const embed = new EmbedBuilder()
        .setTitle('🎮 Game Server Status')
        .setColor(statusColor)
        .addFields(
            { name: 'Status', value: GAME_SERVER_CONFIG.status === 'active' ? '🟢 Active' : '🔴 Inactive', inline: true },
            { name: 'Uptime', value: formatUptime(GAME_SERVER_CONFIG.uptime), inline: true },
            { name: 'Active Users', value: GAME_SERVER_CONFIG.activeUsers.toString(), inline: true },
            { name: 'Server IP', value: `\`${GAME_SERVER_CONFIG.ip}\``, inline: false },
            { name: 'Max Players', value: GAME_SERVER_CONFIG.maxPlayers.toString(), inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'Game Server Control Panel' });
    
    return embed;
}

// Function to create the control buttons
function createControlButtons() {
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('start_server')
                .setLabel('Start Server')
                .setStyle(ButtonStyle.Success)
                .setEmoji('🟢'),
            new ButtonBuilder()
                .setCustomId('stop_server')
                .setLabel('Stop Server')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🔴'),
            new ButtonBuilder()
                .setCustomId('restart_server')
                .setLabel('Restart Server')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🔁')
        );
    
    return row;
}

// Event: Bot ready
client.once('ready', () => {
    console.log(`Discord bot ${client.user.tag} is ready!`);
    console.log(`Logged in as ${client.user.tag}`);
    
    // Set bot's status
    client.user.setActivity('Game Server | /status', { type: 2 });
});

// Event: Interaction (button clicks and commands)
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    
    // Check if user is authorized
    if (!isUserAuthorized(interaction.member)) {
        await interaction.reply({ 
            content: '❌ You do not have permission to use these controls!', 
            ephemeral: true 
        });
        return;
    }
    
    try {
        let messageContent = '';
        let success = false;
        
        switch (interaction.customId) {
            case 'start_server':
                if (GAME_SERVER_CONFIG.status === 'active') {
                    await interaction.reply({ 
                        content: '⚠️ Server is already running!', 
                        ephemeral: true 
                    });
                    return;
                }
                
                success = await startServer();
                if (success) {
                    messageContent = '✅ Game server has been started successfully!';
                } else {
                    messageContent = '❌ Failed to start the game server!';
                }
                break;
                
            case 'stop_server':
                if (GAME_SERVER_CONFIG.status === 'inactive') {
                    await interaction.reply({ 
                        content: '⚠️ Server is already stopped!', 
                        ephemeral: true 
                    });
                    return;
                }
                
                success = await stopServer();
                if (success) {
                    messageContent = '🛑 Game server has been stopped successfully!';
                } else {
                    messageContent = '❌ Failed to stop the game server!';
                }
                break;
                
            case 'restart_server':
                success = await restartServer();
                if (success) {
                    messageContent = '🔄 Game server has been restarted successfully!';
                } else {
                    messageContent = '❌ Failed to restart the game server!';
                }
                break;
                
            default:
                return;
        }
        
        // Update the original message with new status
        const updatedEmbed = createServerStatusEmbed();
        const updatedButtons = createControlButtons();
        
        await interaction.update({ 
            embeds: [updatedEmbed], 
            components: [updatedButtons] 
        });
        
        // Send a follow-up message with the action result
        await interaction.followUp({ 
            content: messageContent, 
            ephemeral: true 
        });
        
    } catch (error) {
        console.error('Error handling button interaction:', error);
        await interaction.reply({ 
            content: '❌ An error occurred while processing your request.', 
            ephemeral: true 
        });
    }
});

// Command to display server status
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (message.content.toLowerCase() === '!server' || message.content.toLowerCase() === '!status') {
        const embed = createServerStatusEmbed();
        const buttons = createControlButtons();
        
        await message.channel.send({ 
            embeds: [embed], 
            components: [buttons] 
        });
    }
});

// Login to Discord with your bot token
client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log('Bot logged in successfully'))
    .catch(err => console.error('Error logging in:', err));
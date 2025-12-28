// Example integration of Pterodactyl module with Discord bot
const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const PterodactylPanel = require('./pterodactyl');

// Initialize the Pterodactyl client
const ptero = new PterodactylPanel(
  process.env.PTERODACTYL_URL,
  process.env.PTERODACTYL_API_KEY
);

// Example of how to use the Pterodactyl module in your Discord bot
class GameServerController {
  constructor(discordClient, serverId) {
    this.discordClient = discordClient;
    this.serverId = serverId;
    this.statusMessage = null;
  }

  // Create the control panel embed
  async createStatusEmbed() {
    try {
      const resources = await ptero.getServerResources(this.serverId);
      const serverInfo = await ptero.getServerInfo(this.serverId);
      
      const status = resources.attributes.current_state;
      const cpu = resources.attributes.resources.cpu_absolute;
      const memory = Math.round(resources.attributes.resources.memory_bytes / (1024 * 1024)); // MB
      const disk = Math.round(resources.attributes.resources.disk_bytes / (1024 * 1024)); // MB
      
      const embed = new MessageEmbed()
        .setTitle('🎮 Game Server Control Panel')
        .setDescription(`Status: **${status.toUpperCase()}**`)
        .addFields(
          { name: 'Uptime', value: this.getUptime(resources.attributes.resources.uptime), inline: true },
          { name: 'CPU Usage', value: `${cpu}%`, inline: true },
          { name: 'Memory Usage', value: `${memory} MB`, inline: true },
          { name: 'Disk Usage', value: `${disk} MB`, inline: true },
          { name: 'Server ID', value: this.serverId, inline: true },
          { name: 'IP Address', value: process.env.SERVER_IP || 'Not configured', inline: true }
        )
        .setColor(status === 'running' ? '#00ff00' : status === 'offline' ? '#ff0000' : '#ffff00')
        .setTimestamp();
      
      return embed;
    } catch (error) {
      console.error('Error creating status embed:', error);
      
      const errorEmbed = new MessageEmbed()
        .setTitle('🎮 Game Server Control Panel')
        .setDescription('❌ **Error retrieving server information**')
        .addFields(
          { name: 'Status', value: 'Error', inline: true },
          { name: 'IP Address', value: process.env.SERVER_IP || 'Not configured', inline: true }
        )
        .setColor('#ff0000')
        .setTimestamp();
      
      return errorEmbed;
    }
  }

  // Get formatted uptime string
  getUptime(uptimeMs) {
    if (!uptimeMs) return 'Unknown';
    
    const seconds = Math.floor(uptimeMs / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  // Create control buttons
  createControlButtons() {
    return new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('start_server')
        .setLabel('🟢 Start')
        .setStyle('SUCCESS'),
      new MessageButton()
        .setCustomId('stop_server')
        .setLabel('🔴 Stop')
        .setStyle('DANGER'),
      new MessageButton()
        .setCustomId('restart_server')
        .setLabel('🔁 Restart')
        .setStyle('PRIMARY')
    );
  }

  // Handle button interactions
  async handleInteraction(interaction) {
    // Check if user has permission
    if (!this.hasPermission(interaction.member)) {
      await interaction.reply({ content: '❌ You do not have permission to use these controls!', ephemeral: true });
      return;
    }

    try {
      let message = '';
      
      switch (interaction.customId) {
        case 'start_server':
          await ptero.startServer(this.serverId);
          message = '✅ Game server has been started successfully!';
          break;
          
        case 'stop_server':
          await ptero.stopServer(this.serverId);
          message = '🛑 Game server has been stopped successfully!';
          break;
          
        case 'restart_server':
          await ptero.restartServer(this.serverId);
          message = '🔄 Game server has been restarted successfully!';
          break;
          
        default:
          await interaction.reply({ content: 'Unknown action', ephemeral: true });
          return;
      }
      
      // Update the status message
      setTimeout(async () => {
        try {
          const updatedEmbed = await this.createStatusEmbed();
          if (this.statusMessage) {
            await this.statusMessage.edit({ embeds: [updatedEmbed] });
          }
        } catch (error) {
          console.error('Error updating status message:', error);
        }
      }, 2000); // Wait 2 seconds before updating status
      
      await interaction.reply({ content: message, ephemeral: true });
    } catch (error) {
      console.error('Error handling interaction:', error);
      await interaction.reply({ content: `❌ Error: ${error.message}`, ephemeral: true });
    }
  }

  // Check if user has permission to control the server
  hasPermission(member) {
    // Check for specific roles
    const allowedRoles = ['Owner', 'Admin', 'Moderator']; // Configurable roles
    const hasRole = member.roles.cache.some(role => allowedRoles.includes(role.name));
    
    // Check for specific user IDs
    const allowedUserIds = [process.env.ALLOWED_USER_ID].filter(id => id); // Add specific user IDs if needed
    const hasUserId = allowedUserIds.includes(member.id);
    
    return hasRole || hasUserId;
  }

  // Send the initial control panel message
  async sendControlPanel(channel) {
    const embed = await this.createStatusEmbed();
    const buttons = this.createControlButtons();
    
    const message = await channel.send({ 
      embeds: [embed], 
      components: [buttons] 
    });
    
    this.statusMessage = message;
    return message;
  }
}

module.exports = GameServerController;
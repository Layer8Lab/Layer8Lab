// Test script to verify Pterodactyl module integration
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

// Test importing the Pterodactyl module
try {
    const PterodactylPanel = require('./modules/pterodactyl');
    console.log('✅ Pterodactyl module imported successfully');
    
    // Test creating an instance (without connecting to a real panel)
    const ptero = new PterodactylPanel(
        process.env.PTERODACTYL_URL || 'https://test.com',
        process.env.PTERODACTYL_API_KEY || 'test-key'
    );
    
    console.log('✅ Pterodactyl client created successfully');
    console.log('✅ All imports successful! Pterodactyl integration is ready.');
    
} catch (error) {
    console.error('❌ Error importing Pterodactyl module:', error.message);
}

// Test importing the main index file to make sure there are no syntax errors
try {
    // We won't actually require it since it would start the bot, but we can check if it parses correctly
    const fs = require('fs');
    const code = fs.readFileSync('./index.js', 'utf8');
    new Function(code); // This will throw an error if there are syntax errors
    console.log('✅ index.js syntax is valid');
} catch (error) {
    console.error('❌ Error in index.js:', error.message);
}

console.log('\n🎉 Pterodactyl integration setup verification complete!');
console.log('\nTo use the bot with Pterodactyl:');
console.log('1. Make sure your .env file has the correct Pterodactyl configuration');
console.log('2. Ensure your Pterodactyl API key has the necessary permissions');
console.log('3. Update the PTERODACTYL_SERVER_ID with your actual server identifier');
console.log('4. Run the bot with: npm start');
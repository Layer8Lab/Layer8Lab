// Simple test to verify the bot structure
const fs = require('fs');
const path = require('path');

console.log('Checking bot files...\n');

// Check if required files exist
const requiredFiles = ['package.json', 'index.js', '.env', 'README.md'];

for (const file of requiredFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file} - EXISTS`);
    } else {
        console.log(`❌ ${file} - MISSING`);
    }
}

console.log('\nVerifying package.json dependencies...');

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

const requiredDeps = ['discord.js', 'dotenv'];
for (const dep of requiredDeps) {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
        console.log(`✅ ${dep} - INSTALLED (${packageJson.dependencies[dep]})`);
    } else {
        console.log(`❌ ${dep} - MISSING`);
    }
}

console.log('\nBot structure verification complete!');
console.log('\nTo run the bot:');
console.log('1. Update .env with your Discord token');
console.log('2. Update authorized roles in index.js');
console.log('3. Run: npm start');
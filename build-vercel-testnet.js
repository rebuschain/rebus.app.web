const { execSync } = require('child_process');
const fs = require('fs');

// Environment variable for Node.js memory limit
process.env.NODE_OPTIONS = "--max_old_space_size=4096";

// Run yarn command to set environment variables for testnet
execSync('yarn react-env:testnet');

// No need to rename, directly create __ENV.js
fs.renameSync('public/__ENV.js', 'public/__ENV.js');

// Build CSS and the application
execSync('yarn build:css && yarn build');

// Modify index.html for Testnet
let indexHtml = fs.readFileSync('./prod/index.html', 'utf8');
indexHtml = indexHtml.replace(/public\/__ENV.js/g, `public/__ENV.js?q=${Date.now()}`);
indexHtml = indexHtml.replace(/https:\/\/app.rebustokenred.com\//g, "https://app.rebustestnet.com/");

// Write the changes directly to index.html
fs.writeFileSync('./prod/index.html', indexHtml);

console.log('Testnet build script completed successfully.');

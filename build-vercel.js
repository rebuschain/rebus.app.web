const { execSync } = require('child_process');
const fs = require('fs');

// Environment variable for Node.js memory limit
process.env.NODE_OPTIONS = "--max_old_space_size=4096";

// Run yarn command to set environment variables for mainnet
execSync('yarn react-env:mainnet');

// No need to rename, directly create __ENV.js
fs.renameSync('public/__ENV.js', 'public/__ENV.js');

// Build CSS and the application
execSync('yarn build:css && yarn build');

// Modify index.html for Mainnet
let indexHtml = fs.readFileSync('./prod/index.html', 'utf8');
indexHtml = indexHtml.replace(/public\/__ENV.js/g, `public/__ENV.js?q=${Date.now()}`);
indexHtml = indexHtml.replace(/https:\/\/app.rebustokenred.com\//g, "https://app.rebuschain.com/");

// Write the changes directly to index.html
fs.writeFileSync('./prod/index.html', indexHtml);

console.log('Mainnet build script completed successfully.');

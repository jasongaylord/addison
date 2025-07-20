# Watch script for automatic SASS compilation during development
# This script requires Node.js and npm to be installed

# Node.js paths
$NodePath = "C:\Program Files\nodejs\node.exe"
$NpmPath = "C:\Program Files\nodejs\npm.cmd"

# Check if Node.js is installed
if (!(Test-Path $NodePath)) {
    Write-Host "Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Write-Host "After installing Node.js, run the following commands:" -ForegroundColor Yellow
    Write-Host "1. npm install" -ForegroundColor Cyan
    Write-Host "2. npm run watch:css" -ForegroundColor Cyan
    exit 1
}

# Check if npm packages are installed
if (!(Test-Path "node_modules")) {
    Write-Host "Installing npm packages..." -ForegroundColor Yellow
    & $NpmPath install
}

# Start watch mode
Write-Host "Starting SASS watch mode..." -ForegroundColor Green
Write-Host "Watching src/scss/ for changes..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop watching" -ForegroundColor Yellow
& $NodePath .\node_modules\sass\sass.js src/scss/main.scss style.css --watch --style=expanded --source-map

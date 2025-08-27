# Build script for compiling SASS to CSS
# This script requires Node.js and npm to be installed

# Node.js paths
$NodePath = "C:\Program Files\nodejs\node.exe"
$NpmPath = "C:\Program Files\nodejs\npm.cmd"

# Check if Node.js is installed
if (!(Test-Path $NodePath)) {
    Write-Host "Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Write-Host "After installing Node.js, run the following commands:" -ForegroundColor Yellow
    Write-Host "1. npm install" -ForegroundColor Cyan
    Write-Host "2. npm run build:css" -ForegroundColor Cyan
    exit 1
}

# Check if npm packages are installed
if (!(Test-Path "node_modules")) {
    Write-Host "Installing npm packages..." -ForegroundColor Yellow
    & $NpmPath install
}

# Build CSS from SASS
Write-Host "Building CSS from SASS..." -ForegroundColor Green
& $NodePath .\node_modules\sass\sass.js src/scss/main.scss styles/style.css --style=compressed --source-map

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ CSS build completed successfully!" -ForegroundColor Green
    Write-Host "📄 Output: style.css" -ForegroundColor Cyan
    Write-Host "🗺️  Source map: style.css.map" -ForegroundColor Cyan
} else {
    Write-Host "❌ CSS build failed!" -ForegroundColor Red
    exit 1
}

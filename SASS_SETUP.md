# SASS Build Process Setup

This project has been refactored to use SASS (Syntactically Awesome Style Sheets) for better CSS organization and maintainability.

## ✅ Setup Complete!

Node.js has been installed and the SASS build process is now working. The CSS is automatically compiled from SASS files during development and deployment.

## Prerequisites

Node.js is required and should now be installed:

1. **Node.js** (v16 or higher) - ✅ Installed
2. **npm** (comes with Node.js) - ✅ Available
3. **SASS compiler** - ✅ Configured

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build CSS (one-time):**
   ```bash
   npm run build:css
   ```

3. **Or start watch mode (for development):**
   ```bash
   npm run watch:css
   ```

## PowerShell Scripts (Alternative)

For Windows PowerShell users, enhanced scripts with full Node.js path detection:

- **Build once:** `.\build.ps1`
- **Watch mode:** `.\watch.ps1`

These scripts automatically detect Node.js installation and provide helpful error messages.

## SASS File Structure

```
src/scss/
├── base/
│   ├── _variables.scss    # Colors, fonts, breakpoints
│   ├── _mixins.scss      # Reusable SASS mixins
│   ├── _base.scss        # Base HTML/body styles
│   └── _utilities.scss   # Utility classes
├── layout/
│   └── _header.scss      # Header and navigation
├── components/
│   ├── _hero.scss        # Hero section and gallery
│   ├── _statistics.scss  # Statistics tables and cards
│   ├── _threads.scss     # Threads social media cards
│   └── _contact.scss     # Contact section
└── main.scss             # Main entry point (imports all)
```

## Key Features

### Variables
- **Colors:** Primary purple theme, text colors, backgrounds
- **Breakpoints:** Responsive design breakpoints
- **Fonts:** Font families and weights

### Mixins
- **Responsive design:** `@include respond-to(lg)`, `@include respond-below(md)`
- **Reusable patterns:** Common CSS patterns as mixins

### Component Organization
- Each major section has its own SCSS file
- Modular and maintainable code structure
- Easy to find and edit specific components

## Development Workflow

1. **Edit SASS files** in `src/scss/` directory
2. **Run build/watch** to compile to `style.css`
3. **Preview changes** by opening `index.html` in browser
4. **Commit changes** to both SASS source and compiled CSS

## Build Commands

| Command | Description |
|---------|-------------|
| `npm run build:css` | Compile SASS to compressed CSS |
| `npm run watch:css` | Watch for changes and auto-compile |
| `npm run dev` | Alias for watch:css |

## Migration Notes

The original `style.css` has been completely refactored into organized SASS components:

- **Navigation styles** → `layout/_header.scss`
- **Threads cards** → `components/_threads.scss`
- **Statistics** → `components/_statistics.scss`
- **Contact section** → `components/_contact.scss`
- **Hero/Gallery** → `components/_hero.scss`
- **Variables/mixins** → `base/` directory

## Troubleshooting

**Node.js not found:**
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal after installation

**npm command not found:**
- Node.js installation includes npm
- Try restarting terminal or computer

**Build errors:**
- Check SASS syntax in source files
- Ensure all imports in `main.scss` are correct
- Run `npm install` to ensure dependencies are installed

**PowerShell script blocked:**
- Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- This allows local PowerShell scripts to run

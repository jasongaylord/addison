# Addison Gaylord - Softball Statistics & Recruiting

A responsive website showcasing Addison Gaylord's softball statistics, achievements, and recruiting information. Features automated Threads social media integration and modern SASS-based styling.

## Features

- 📊 Comprehensive softball statistics tracking
- 📱 Responsive design (mobile-first approach)
- 🔗 Automated Threads social media integration
- 📄 Downloadable recruiting materials and contact information
- 🎨 Modern SASS-based CSS architecture
- 🎛️ Header theme switcher with persistent preferences
- ⚙️ Automated token refresh via GitHub Actions

## Prerequisites

To build and develop this project, you'll need:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

## Setup Instructions

1. **Install Node.js** if not already installed
2. **Clone/download** this repository
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Build CSS from SASS:**
   ```bash
   npm run build:css
   ```
5. **For development** (with automatic rebuilding):
   ```bash
   npm run watch:css
   ```

## Project Structure

```
├── src/scss/           # SASS source files
│   ├── base/          # Variables, mixins, base styles
│   ├── components/    # Component-specific styles
│   ├── layout/        # Layout components (header, footer)
│   └── main.scss      # Main SASS entry point
├── data/              # JSON data files
├── img/               # Images and gallery
├── downloads/         # Downloadable files
├── .github/workflows/ # GitHub Actions
└── style.css          # Compiled CSS output
```

## Threads Integration

The website automatically displays recent Threads posts. Setup requires:

1. **Threads Developer Account** and App ID
2. **GitHub Secrets** configuration:
   - `THREADS_APP_ID`
   - `THREADS_APP_SECRET`
3. **Automated token refresh** runs every 30 days

See `THREADS_SETUP.md` for detailed configuration instructions.

## Development

- **Edit SASS files** in `src/scss/` directory
- **Run build command** to compile CSS: `npm run build:css`
- **Use watch mode** for development: `npm run watch:css`
- **Open `index.html`** in browser to view changes

## Theme Switcher

- The header includes a theme selector with `Outlaws` and `Warriors` options.
- The selected theme is saved in `localStorage` under `preferred_theme` and restored on next page load.
- Keyboard support:
  - Standard select keyboard navigation works with arrow keys.
  - `Home` and `End` jump to first/last theme option.
  - `Alt` + `Shift` + `T` cycles themes from anywhere on the page.

## Deployment

The site is static HTML/CSS/JavaScript and can be deployed to any web hosting service:

- GitHub Pages
- Netlify
- Vercel
- Traditional web hosting

## Technologies Used

- **HTML5** with semantic markup
- **Bootstrap 5** for responsive grid and components
- **SASS/SCSS** for organized, maintainable CSS
- **Vanilla JavaScript** ES6+ with async/await
- **Meta Threads API** for social media integration
- **GitHub Actions** for automation
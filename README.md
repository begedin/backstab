# Backstab

A stealth puzzler game built with Phaser 3 and modern web technologies.

## Modernization

This project has been modernized from the original Gulp + Bower setup to use:
- **Vite** for fast development and building
- **ES Modules** for modern JavaScript
- **Phaser 3** (latest version)
- **ESLint** for code quality

## Development

### Prerequisites

- Node.js 20.19+ or 22.12+ (required for Vite 7.x)
- npm

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

   This will start the development server at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix

## Project Structure

```
src/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Game styles
└── scripts/
    ├── main.js         # Main game entry point
    ├── states/         # Phaser 3 scenes
    │   ├── Boot.js
    │   ├── Preload.js
    │   ├── Menu.js
    │   └── Game.js
    └── utils/
        └── Analytics.js # Analytics utility
assets/                 # Static assets (images, icons, etc.)
```

## Build Output

The production build is output to the `dist/` directory and includes:
- Minified JavaScript bundle
- Optimized CSS
- Static assets

## Migration Notes

- Converted from Phaser 2 state system to Phaser 3 scene system
- Replaced Gulp build system with Vite
- Removed Bower dependency management in favor of npm
- Updated to modern ES module syntax
- Converted LESS to CSS

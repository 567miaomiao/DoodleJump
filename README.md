# Skybound Doodle

A complete, responsive Doodle Jump-style browser game made with vanilla JavaScript and [p5.js](https://p5js.org/). Guide the doodler across an endless paper-sky, climb as high as possible, and avoid falling below the screen.

## Features

- Automatic jumping with gravity and momentum-based horizontal movement
- Endless procedural platform generation and vertical camera scrolling
- Normal, horizontally moving, and one-use breakable platforms
- Swept landing detection to prevent fast jumps from passing through platforms
- Start, score, best-score, game-over, and restart flows
- Keyboard and touch controls with responsive Canvas sizing
- Best score saved in browser `localStorage`

## Controls

| Action | Keyboard | Touch |
| --- | --- | --- |
| Move left | `←` or `A` | Left arrow button |
| Move right | `→` or `D` | Right arrow button |
| Start / restart | `Space` or `Enter` | On-canvas button |

Jumping is automatic whenever the player lands on a platform.

## Run locally

No build step or package installation is required. Serve the repository with any static HTTP server:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` directly may also work, but an HTTP server matches the GitHub Pages environment more closely.

## Project structure

```text
.
├── index.html      # Page structure and p5.js loading
├── sketch.js       # Game loop, state, and world orchestration
├── player.js       # Player movement, physics, collision, and drawing
├── platform.js     # Platform behavior, recycling, and drawing
├── favicon.svg     # Code-native site icon
└── .nojekyll       # Keeps GitHub Pages in static-file mode
```

Responsive page styles live inside `index.html`, so the game has no separate CSS file. The `Player` class owns movement, jump physics, wrapping, collision resolution, and drawing. The `Platform` class owns platform type, motion, break behavior, recycling, and drawing. The p5.js `draw()` loop in `sketch.js` coordinates game state and world scrolling.

## Deploy to GitHub Pages

This repository is already Pages-ready and serves directly from its root:

1. Push the repository to GitHub.
2. Open **Settings → Pages** in the GitHub repository.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the `master` branch and `/ (root)`, then click **Save**.
5. After the deployment finishes, open the URL shown by GitHub Pages.

The p5.js library and web fonts are loaded from public CDNs, so the deployed game needs an internet connection on first load.

## Verification

The project is checked with:

```bash
node --check player.js
node --check platform.js
node --check sketch.js
git diff --check
```

Browser QA covers initial rendering, Canvas dimensions, keyboard start, horizontal movement, platform type creation, scrolling/scoring, game-over detection, restart, console errors, and a mobile-sized viewport.

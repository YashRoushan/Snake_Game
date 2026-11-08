# Snake

An 18 × 18 browser Snake game built with HTML, CSS and JavaScript.

**[Play the live game](https://yashroushan.github.io/portfolio-website/engineering/demos/snake/)** · **[Portfolio](https://yashroushan.github.io/portfolio-website/engineering/)**

The original project files remain at the repository root. `hosted/` is the improved browser edition: it preserves the grid/food/growing-snake mechanics, adds keyboard and touch controls, pause/resume, restart without reloading, and local high scores. Boundary, self-collision, reverse-direction and food placement handling are corrected. Audio and background image dependencies are not loaded by this edition.

## Run

Use Node.js 22 or newer. There are no runtime dependencies.

```sh
npm test
npm run build
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080. Arrow keys or WASD steer; Space pauses while the board has focus. Touch users can use the direction buttons or swipe on the board. The game pauses when its tab becomes hidden.

## Deployment

`npm run build` copies only `hosted/` to `dist/`. All asset URLs are relative, so the app works at the portfolio's nested GitHub Pages path. The generated directory is published to `portfolio-website/engineering/demos/snake/`. Edit the original project here, rebuild, and update that published directory alongside the portfolio.

The best score is stored only in the visitor's browser. No accounts, analytics, external API calls, or server data storage are used.

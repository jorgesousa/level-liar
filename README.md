# LEVEL LIAR

*An honest platformer. (It isn't.)*

A troll platformer for the browser, made to be played on a phone. There are ten levels. Each one opens with a promise ("The door won't move.", "Controls work as expected.") and every single promise is a lie. When you die, the promise gets crossed out and the truth appears beside it.

**▶ Play: [jorgesousa.github.io/level-liar](https://jorgesousa.github.io/level-liar/)** (phone or desktop)

## Controls

| | Phone | Keyboard |
|---|---|---|
| Move | Hold ◀ ▶ (slide your thumb between them) | ← → or A D |
| Jump | JUMP | ↑, W or Space |
| Restart level | ↻ button | R |
| Pause | ‖ button | Esc or P |
| Sound on/off | Menu | M |

Turn the phone sideways for a bigger stage. Every trap fires the same way every time, so each death teaches you something.

## Run locally

```bash
npm start          # serves on http://127.0.0.1:8932
```

There is no build step and nothing to install to play: the whole game is `index.html` (canvas rendering, synthesised Web Audio sound, Google Fonts for Bungee and DM Mono). Progress and the best run are kept in the browser's localStorage.

## Test

```bash
npm install
npx playwright install chromium
npm test
```

`tests/solve-levels.mjs` drives the game headlessly with a fixed 120 fps step. For each level a scripted bot has to reach the door, and a player who only holds "right" should die (level 3 is the exception: there you just get stuck, because the door runs away). Run it after changing any level so none of them becomes impossible.

## Deploy

Every push to `main` publishes `index.html` to GitHub Pages ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)). In the repo settings, Pages must use **GitHub Actions** as its source.

## How it's built

- Logical stage of 960×540 (32×18 tiles of 30 px), scaled to fit the screen. Physics run at a fixed 120 steps per second.
- Each level is a small `build($)` function in `index.html` that places blocks, spikes, saws and doors, then wires traps with `$.when(condition, action)`, `$.after(seconds, action)`, `$.tween(...)`, `$.drop(...)` and `$.pop(...)`.
- Seams between blocks are invisible on purpose, so you can't tell which piece of floor is about to fall.
- Level notes (spoilers): [docs/LEVELS.md](docs/LEVELS.md)

## Credits

Made by **Jorge Sousa**, with Claude. Inspired by the troll-platformer genre.

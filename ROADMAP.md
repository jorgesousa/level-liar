# Roadmap

State (Nov 2026): the game has 20 levels. Levels 1–10 are the original release. Levels 11–20 came from the
"Level Liar 20" prototype (claude.ai artifact, 3 Nov) and are in the `more-levels` branch. All 20 levels are
beaten by the scripted bot in `npm test`.

## Now
- [x] Bring levels 11–20 from the "Level Liar 20" prototype into `index.html`
- [x] Fake ending after level 10 ("10 of ~~10~~ 20 lies exposed"), level picker, `#level-N` links
- [x] Bot solutions for levels 11–20 in `tests/solve-levels.mjs` (all 20 pass)
- [ ] Review and merge the `more-levels` PR (the site updates on merge)
- [ ] Make level 17 ("You can't fly.") easier: it can be beaten, but the bot only passes the pipes by hovering in place; Jorge couldn't get through it. Ideas: bigger pipe gaps, a stronger flap, or a slower mover pipe

## Next
- [ ] Update the README, `docs/LEVELS.md`, meta description and package.json ("Ten levels" → twenty, or keep the lie on purpose and say so)
- [ ] Level 13 ("Gravity is constant."): you can fall into the door before it jumps to the ceiling, which skips the trap. Decide whether to close that
- [ ] Level 16 ("Portals take you forward.") and level 3 ("The door won't move."): a player who only holds right does not die, so the troll doesn't bite on the first try
- [ ] Test levels 11–20 on a real phone (touch pad in portrait and landscape, camera rotation on level 19)
- [ ] New trailer/GIF that shows the second half

## Later
- [ ] The engine already has unused mechanics from the prototype: storm walls, traffic lights, trucks, towers and minions, bombs, lasers, candy/letter/sand blocks, clones, 3D lanes (yaw), and a boss ("the Liar"). Either build levels 21+ with them or cut them to shrink `index.html`
- [ ] Split `index.html` (≈1,900 lines) into level files + engine

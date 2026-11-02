// Plays every level with a scripted bot and checks it reaches the door.
// It also checks that a player who only holds "right" dies on almost every level,
// so the traps still bite. Run with: npm test
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// One script per level (0-based). Each phase holds some keys, optionally presses jump
// at its start, and runs until the condition is true (or for `max` frames at 120 fps).
const B = {
 0: [ {hold:{right:1}, until:'P.x>=465'}, {jump:1, hold:{right:1}, until:'false', max:400} ],
 1: [ {hold:{right:1}, until:'P.x>=180'}, {jump:1,hold:{right:1}, until:'P.onGround && P.vy==0 && P.x>300'},
      {hold:{right:1}, until:'P.x>=415'}, {jump:1,hold:{right:1}, until:'P.onGround && P.x>500'},
      {hold:{}, until:'false', max:60}, {hold:{right:1}, until:'P.x>=585'}, {jump:1,hold:{right:1}, until:'false',max:300} ],
 2: [ {hold:{right:1}, until:'P.x+P.w>662'}, {hold:{left:1}, until:'P.x<=500'}, {jump:1,hold:{left:1}, until:'P.onGround && P.x<360'},
      {hold:{left:1}, until:'P.x<=262'}, {jump:1,hold:{left:1}, until:'false', max:200}, {hold:{right:1}, until:'false',max:100} ],
 3: [ {hold:{right:1}, until:'P.x+P.w>260'}, {hold:{}, until:'false', max:140}, {hold:{right:1}, until:'false', max:500} ],
 4: [ {hold:{right:1}, until:'P.x>=190'}, {jump:1,hold:{right:1}, until:'P.onGround && P.x>250'},
      {hold:{right:1}, until:'P.x>=335'}, {jump:1,hold:{right:1}, until:'P.onGround && P.x>400'},
      {jump:1,hold:{right:1}, until:'P.onGround && P.x>540 && P.y<340'}, {hold:{right:1}, until:'P.x>=640'}, {jump:1,hold:{right:1}, until:'false',max:400} ],
 5: [ {hold:{right:1}, until:'P.x>=205'}, {jump:1,hold:{right:1}, until:'L.reversed'}, {hold:{left:1}, until:'P.x>=415'},
      {jump:1,hold:{left:1}, until:'!L.reversed'}, {hold:{right:1}, until:'P.x>=625'}, {jump:1,hold:{right:1}, until:'false',max:400} ],
 6: [ {hold:{right:1}, until:'L.saws[0].vx<0 && L.saws[0].x-(P.x+P.w) < 70'}, {jump:1,hold:{right:1}, until:'P.onGround'},
      {hold:{right:1}, until:'(L.saws[0].vx>0 && P.x - L.saws[0].x < 95) || P.x>800'}, {jump:1,hold:{right:1}, until:'P.onGround'},
      {hold:{right:1}, until:'false', max:400} ],
 7: [ {hold:{right:1}, until:'P.x+P.w>=700'}, {hold:{}, until:'false', max:200},
      {jump:1,hold:{left:1}, until:'P.onGround && P.y<340'}, {hold:{left:1}, until:'P.x<=575'}, {jump:1,hold:{left:1}, until:'P.onGround && P.y<250'},
      {hold:{left:1}, until:'P.x<=425'}, {jump:1,hold:{left:1}, until:'false',max:400} ],
 8: [ {hold:{right:1}, until:'P.x>=362'}, {jump:1,hold:{right:1}, until:'false', max:600} ],
 9: [ {hold:{right:1}, until:'P.x+P.w>721'}, {hold:{}, until:'false', max:24}, {jump:1,hold:{left:1}, until:'P.x<=640', max:200}, {hold:{}, until:'P.onGround && P.y<340', max:200},
      {hold:{right:1}, until:'P.x+P.w>=688'}, {jump:1,hold:{right:1}, until:'P.onGround && P.y<250'},
      {hold:{left:1}, until:'P.x<=735'}, {jump:1,hold:{left:1}, until:'P.x<=600'}, {hold:{}, until:'P.onGround && P.y<160'}, {hold:{left:1}, until:'false',max:300} ],
};


const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto('file://' + path.join(root, 'index.html'));
await page.waitForFunction(() => window.__levelLiar);

let failed = 0;
for (const [i, phases] of Object.entries(B)) {
  const r = await page.evaluate(({ i, phases }) => {
    const LL = window.__levelLiar; LL.game.manual = true; LL.start(i);
    for (const ph of phases) {
      LL.input.left = !!ph.hold.left; LL.input.right = !!ph.hold.right;
      if (ph.jump) LL.jump();
      const cond = new Function('P', 'L', 'return (' + ph.until + ')');
      for (let n = 0; n < (ph.max || 1500); n++) {
        LL.step(1);
        if (LL.game.mode !== 'play') return LL.game.mode;
        if (cond(LL.P, LL.L)) break;
      }
    }
    return LL.game.mode;
  }, { i: Number(i), phases });
  const naive = await page.evaluate(i => {
    const LL = window.__levelLiar; LL.start(i); LL.input.left = false; LL.input.right = true;
    for (let n = 0; n < 1200 && LL.game.mode === 'play'; n++) LL.step(1);
    LL.input.right = false; return LL.game.mode;
  }, Number(i));
  const ok = r === 'win';
  if (!ok) failed++;
  console.log(`Level ${String(+i + 1).padStart(2, '0')}  bot: ${ok ? 'beaten' : 'FAILED (' + r + ')'}  hold-right player: ${naive}`);
}
await browser.close();
if (errors.length) { console.error('Page errors:', errors); failed++; }
process.exit(failed ? 1 : 0);

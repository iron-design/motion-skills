// render.mjs — seek(t) HTML을 프레임 단위로 캡처해 MP4로 렌더
// 필요: npm i -D playwright && npx playwright install chromium, ffmpeg
// 사용: node render.mjs index.html out.mp4 --w 1920 --h 1080 --fps 60 --dur 15 --sub 3 [--audio track.mp3] [--stills 0.5,1,1.5]
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const [html, out = 'out.mp4', ...rest] = process.argv.slice(2);
const opt = { w: 1920, h: 1080, fps: 60, dur: 10, sub: 3 };
for (let i = 0; i < rest.length; i += 2) opt[rest[i].replace(/^--/, '')] = rest[i + 1];
const W = +opt.w, H = +opt.h, FPS = +opt.fps, DUR = +opt.dur, SUB = +opt.sub;

const browser = await chromium.launch(process.env.CHROME_CHANNEL ? { channel: process.env.CHROME_CHANNEL } : {});
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto('file://' + resolve(html));
await page.waitForFunction(() => typeof window.seek === 'function');
await page.evaluate(() => document.fonts.ready);
const seek = t => page.evaluate(async t => { await window.seek(t); }, t);

if (opt.stills) { // 비트별 스틸 검수 모드
  mkdirSync('stills', { recursive: true });
  for (const t of String(opt.stills).split(',').map(Number)) {
    await seek(t); await page.screenshot({ path: `stills/t${t.toFixed(2)}.png` });
  }
  console.log('stills/ 에 저장'); await browser.close(); process.exit(0);
}

rmSync('frames', { recursive: true, force: true }); mkdirSync('frames');
const total = Math.round(DUR * FPS); let n = 0;
for (let f = 0; f < total; f++) {
  for (let s = 0; s < SUB; s++) { // 서브프레임: 셔터 구간에 고르게 분포
    const t = (f + (SUB > 1 ? (s - (SUB - 1) / 2) / SUB : 0)) / FPS;
    await seek(Math.max(0, t));
    await page.screenshot({ path: `frames/${String(n++).padStart(6, '0')}.png` });
  }
  if (f % FPS === 0) process.stdout.write(`\r${f}/${total}`);
}
await browser.close();

const vf = SUB > 1 ? `tmix=frames=${SUB},select='not(mod(n+1\\,${SUB}))',setpts=N/${FPS}/TB` : 'null';
const args = ['-y', '-framerate', String(FPS * SUB), '-i', 'frames/%06d.png'];
if (opt.audio) args.push('-i', opt.audio, '-af', 'loudnorm=I=-14:TP=-1', '-shortest', '-c:a', 'aac', '-b:a', '256k');
args.push('-vf', `${vf},format=yuv420p`, '-r', String(FPS), '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', out);
execFileSync(process.env.FFMPEG || 'ffmpeg', args, { stdio: 'inherit' });
console.log('\n완료:', out);

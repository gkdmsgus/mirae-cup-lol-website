import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const root=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const dist=path.join(root,'dist');
const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'Duplicate IDs');
for(const m of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(m[1]),`Missing anchor ${m[1]}`);
for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  if(/^(https?:|data:)/.test(m[1])) continue;
  assert(fs.existsSync(path.join(dist,m[1])),`Missing asset ${m[1]}`);
}
assert.match(html,/<html lang="ko">/);
assert.equal([...html.matchAll(/<h1\b/g)].length,1);
assert.match(html,/id="organizers"/);
assert.equal([...html.matchAll(/class="org-member"/g)].length,9);
assert.match(html,/리그 오브 레전드/);
assert.match(html,/id="lineup"/);
assert.equal([...html.matchAll(/class="slot"/g)].length,20);
assert.doesNotMatch(html,/프로그래밍|CODE CHALLENGE|YOUR CODE|사용 언어|AI 도구|코드로/);
const png=fs.readFileSync(path.join(dist,'assets','trophy-lcc.png'));
assert.equal(png.readUInt32BE(16),357);
assert.equal(png.readUInt32BE(20),516);
execFileSync(process.execPath,['--check',path.join(dist,'app.js')]);
console.log('PASS: anchors, unique IDs, local assets, PNG dimensions, Korean language, heading, 9 organizers, 20 line-up slots, JS syntax.');

// 로컬 미리보기용 정적 서버 (추가 패키지 없음). `npm run dev`로 실행합니다.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const port = Number(process.env.PORT) || 4173;
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end('Bad Request'); return; }
  let file = path.join(root, pathname);
  // dist 폴더 밖의 파일은 열지 않는다.
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end('Forbidden'); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'}).end('404 Not Found'); return; }
    // 수정 사항이 바로 보이도록 캐시하지 않는다.
    res.writeHead(200, {'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store'});
    res.end(data);
  });
});

server.on('error', err => {
  if (err.code === 'EADDRINUSE') console.error(`포트 ${port}가 이미 사용 중입니다. 다른 포트로 실행하려면: PORT=5173 npm run dev`);
  else console.error(err);
  process.exit(1);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`2026 LCC 미리보기: http://localhost:${port}`);
  console.log('종료하려면 Ctrl + C');
});

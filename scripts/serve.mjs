import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';

const root = resolve(fileURLToPath(new URL('../public/', import.meta.url)));
const port = Number(process.env.PORT || 4173);
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.mjs':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.txt':'text/plain; charset=utf-8', '.xml':'application/xml' };
const server = http.createServer(async (request, response) => {
  const headers = {
    'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'strict-origin-when-cross-origin',
    'Permissions-Policy':'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  };
  try {
    if (!['GET','HEAD'].includes(request.method)) { response.writeHead(405, {...headers, Allow:'GET, HEAD'}); response.end(); return; }
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let path = resolve(root, '.' + pathname);
    if (path !== root && !path.startsWith(root + sep)) { response.writeHead(403, headers); response.end(); return; }
    const info = await stat(path);
    if (info.isDirectory()) {
      if (!pathname.endsWith('/')) { response.writeHead(308, {...headers, Location: pathname + '/'}); response.end(); return; }
      path = resolve(path, 'index.html');
    }
    const data = await readFile(path);
    response.writeHead(200, {...headers, 'Content-Type': mime[extname(path)] || 'application/octet-stream', 'Content-Length': data.length});
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch {
    const page = await readFile(resolve(root, '404.html'));
    response.writeHead(404, {...headers, 'Content-Type':mime['.html']});
    response.end(request.method === 'HEAD' ? undefined : page);
  }
});
server.listen(port, '127.0.0.1', () => process.stdout.write(`Local: http://127.0.0.1:${port}\n`));
for (const signal of ['SIGINT','SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));

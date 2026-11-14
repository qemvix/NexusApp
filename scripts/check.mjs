import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { modules, release } from '../src/data.mjs';
const root = fileURLToPath(new URL('../public/', import.meta.url));
const files = [];
async function walk(path) { for (const entry of await readdir(path, {withFileTypes:true})) { const next = resolve(path, entry.name); if (entry.isDirectory()) await walk(next); else files.push(next); } }
await walk(root);
const pages = files.filter(file => file.endsWith('.html'));
assert.equal(pages.length, 9);
assert.equal(modules.length, 13);
assert.equal(new Set(modules.map(m => m.id)).size, 13);
const load = path => readFile(path, 'utf8');
for (const page of pages) {
  const html = await load(page);
  assert.match(html, /<html lang="en"/);
  assert.match(html, /<h1>/);
  assert.match(html, /<meta name="description"/);
  assert.doesNotMatch(html, /TODO|lorem ipsum|example\.com/i);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = match[1];
    if (/^(https?:|mailto:)/.test(url)) continue;
    const [rawPath, hash] = url.split('#');
    const pathname = rawPath.split('?')[0];
    let target = pathname ? (pathname.startsWith('/') ? resolve(root, '.' + pathname) : resolve(dirname(page), pathname)) : page;
    if ((await stat(target)).isDirectory()) target = resolve(target, 'index.html');
    await stat(target);
    if (hash) assert.ok((await load(target)).includes(`id="${hash}"`), `${page}: missing ${url}`);
  }
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(match[0], /alt="[^"]+"/);
    assert.match(match[0], /width="\d+"/);
    assert.match(match[0], /height="\d+"/);
  }
}
assert.equal(await load(resolve(root, 'LICENSE.txt')), await readFile(new URL('../LICENSE', import.meta.url), 'utf8'));
assert.match(await load(resolve(root, 'license/index.html')), /All rights reserved/);
for (const key of ['installer','portable','checksums']) assert.ok(release[key].startsWith(`https://github.com/qemvix/nexus/releases/download/${release.tag}/`));
let bytes = 0;
for (const file of files) { bytes += (await stat(file)).size; assert.ok(!/\.(exe|zip|pdb|dll)$/i.test(file), 'Binary downloads belong in GitHub releases'); }
assert.ok(bytes < 3_000_000, `Static payload exceeded budget: ${bytes}`);
assert.match(await readFile(new URL('../Staticfile', import.meta.url), 'utf8'), /root: public/);
console.log(`Checked ${pages.length} pages, ${modules.length} tools, all local links and images, license and download routes. Static payload: ${(bytes / 1e6).toFixed(2)} MB.`);

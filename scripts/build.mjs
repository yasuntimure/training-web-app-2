import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
for (const asset of ['index.html', 'styles.css', 'program.js', 'core.js', 'app.js', 'sw.js', 'manifest.webmanifest', 'app-icon.png', 'assets']) {
  cpSync(join(root, asset), join(dist, asset), { recursive: true });
}
console.log('Static app built in dist/; no external dependencies.');

import { cpSync, rmSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

if (!existsSync(distDir)) {
	console.error('dist folder nahi mila. Pehle "vite build" run karo.');
	process.exit(1);
}

cpSync(distDir, __dirname, { recursive: true, force: true });
rmSync(distDir, { recursive: true, force: true });

console.log('dist contents copied to web root and dist removed.');

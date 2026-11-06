import { cpSync, rmSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const indexHtmlPath = path.join(__dirname, 'index.html');

// Normalize index.html: make sure it references the source entry (/src/main.jsx),
// not a previously built /assets/index-*.js bundle (which would make vite
// re-minify a stale bundle instead of building from source).
if (existsSync(indexHtmlPath)) {
	const html = readFileSync(indexHtmlPath, 'utf-8');
	const normalized = html.replace(
		/<script type="module"[^>]*crossorigin[^>]*src="\/assets\/[^"]+\.js"><\/script>\s*<link rel="stylesheet"[^>]*crossorigin[^>]*href="\/assets\/[^"]+\.css">/i,
		'<script type="module" src="/src/main.jsx"></script>'
	);
	if (normalized !== html) {
		writeFileSync(indexHtmlPath, normalized);
	}
}

// Run vite build
execSync('npx vite build', { stdio: 'inherit', cwd: __dirname, shell: true });

if (!existsSync(distDir)) {
	console.error('dist folder nahi mila. Vite build fail hua.');
	process.exit(1);
}

cpSync(distDir, __dirname, { recursive: true, force: true });
rmSync(distDir, { recursive: true, force: true });

console.log('dist contents copied to web root and dist removed.');

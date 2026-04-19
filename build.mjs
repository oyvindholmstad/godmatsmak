// Compiles app.jsx → app.js (minified) so the browser doesn't need
// in-page Babel (~2.7 MB + ~1-3 s of CPU on first load).
//
// Usage:
//   node build.mjs            # one-shot
//   node build.mjs --watch    # rebuild on change

import { build, context } from 'esbuild';

const opts = {
  entryPoints: ['app.jsx'],
  outfile: 'app.js',
  bundle: false,
  minify: true,
  target: ['es2020'],
  loader: { '.jsx': 'jsx' },
  legalComments: 'none',
  logLevel: 'info',
};

if (process.argv.includes('--watch')) {
  const ctx = await context(opts);
  await ctx.watch();
  console.log('watching app.jsx…');
} else {
  await build(opts);
}

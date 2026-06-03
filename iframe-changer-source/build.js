const esbuild = require('esbuild');
esbuild.buildSync({
  entryPoints: ['node_modules/@material/material-color-utilities/index.js'],
  bundle: true,
  format: 'iife',
  globalName: 'materialColorUtilities',
  target: 'es2018',
  outfile: 'lib/material-color-utilities.js',
});
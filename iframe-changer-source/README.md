# iframe-changer — source for AMO review

## Requirements
- Node.js >= 18
- npm >= 9

## Build steps
1. `npm install`
2. `node build.js` → produces `lib/material-color-utilities.js` (IIFE)

## Build details
- Bundler: esbuild ^0.20
- Input: node_modules/@material/material-color-utilities@0.2.7/index.js
- Output: lib/material-color-utilities.js
- Format: iife, global `materialColorUtilities`
- Target: es2018
- No minification, no transpilation of own code

## Environment
- OS: Windows 11
- Node: v25.9.0
- No special env variables

## Third-party
- @material/material-color-utilities 0.2.7 (Apache-2.0)
  https://www.npmjs.com/package/@material/material-color-utilities
  Original source: ./material-color-utilities-0.2.7/

## Own code (hand-written, not generated)
- src/manifest.json, src/popup.html, src/popup.js,
  src/background.js, src/content.js, src/polyfill.js
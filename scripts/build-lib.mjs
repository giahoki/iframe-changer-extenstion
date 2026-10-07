// Rebuilds src/lib/material-color-utilities.js from the pinned npm package.
// AMO reviewers can reproduce the bundled lib with: npm ci && npm run build:lib
import { buildSync } from "esbuild";

buildSync({
  entryPoints: ["node_modules/@material/material-color-utilities/index.js"],
  bundle: true,
  format: "iife",
  globalName: "materialColorUtilities",
  target: "es2018",
  outfile: "src/lib/material-color-utilities.js",
});
console.log("Built src/lib/material-color-utilities.js");

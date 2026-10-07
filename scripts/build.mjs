// Builds dist/iframe-changer-<version>-chrome.zip and -firefox.zip.
import { rm, readdir, stat } from "node:fs/promises";
import path from "node:path";
import webExt from "web-ext";
import { stage, cleanStage, readManifest, quietly, BROWSERS, DIST } from "./stage.mjs";

const { version } = await readManifest();

// drop archives from previous builds so dist/ only holds the current version
await readdir(DIST).then(
  (files) => Promise.all(files.filter((f) => f.endsWith(".zip")).map((f) => rm(path.join(DIST, f)))),
  () => {},
);

for (const browser of BROWSERS) {
  const sourceDir = await stage(browser);
  const filename = `iframe-changer-${version}-${browser}.zip`;
  await quietly(() => webExt.cmd.build(
    { sourceDir, artifactsDir: DIST, filename, overwriteDest: true },
    { shouldExitProgram: false, showReadyMessage: false },
  ));
  const { size } = await stat(path.join(DIST, filename));
  console.log(`  [32m✔[0m ${browser.padEnd(8)} dist/${filename}  (${(size / 1024).toFixed(0)} KB)`);
}

await cleanStage();

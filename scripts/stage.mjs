// Copies src/ into a per-browser staging folder with a manifest trimmed for that browser.
// src/manifest.json carries both `service_worker` (Chrome) and `scripts` (Firefox);
// stores accept that, but a clean per-browser manifest avoids review warnings.
import { cp, rm, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const SRC = path.join(ROOT, "src");
export const DIST = path.join(ROOT, "dist");

const TARGETS = {
  chrome(m) {
    m.background = { service_worker: m.background.service_worker };
    delete m.browser_specific_settings;
  },
  firefox(m) {
    m.background = { scripts: m.background.scripts };
  },
};

export const BROWSERS = Object.keys(TARGETS);

export async function readManifest() {
  return JSON.parse(await readFile(path.join(SRC, "manifest.json"), "utf8"));
}

export async function stage(browser) {
  const dir = path.join(DIST, ".stage", browser);
  await rm(dir, { recursive: true, force: true });
  await cp(SRC, dir, { recursive: true });
  const manifest = await readManifest();
  TARGETS[browser](manifest);
  await writeFile(path.join(dir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  return dir;
}

export async function cleanStage() {
  await rm(path.join(DIST, ".stage"), { recursive: true, force: true });
}

// web-ext prints its own progress/JSON to stdout; run fn with that output muted.
export async function quietly(fn) {
  const write = process.stdout.write;
  process.stdout.write = () => true;
  try { return await fn(); } finally { process.stdout.write = write; }
}

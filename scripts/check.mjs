// Static health check: everything that would break the extension before it is even loaded.
// Exits with code 1 if any check fails.
import { readFile, readdir, access } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import webExt from "web-ext";
import { SRC, stage, cleanStage, readManifest, quietly } from "./stage.mjs";

let failed = 0;
const ok = (msg) => console.log(`  \x1b[32m✔\x1b[0m ${msg}`);
const fail = (msg, details = []) => {
  failed++;
  console.log(`  \x1b[31m✘ ${msg}\x1b[0m`);
  for (const d of details) console.log(`      - ${d}`);
};
const exists = (rel) => access(path.join(SRC, rel)).then(() => true, () => false);
const read = (rel) => readFile(path.join(SRC, rel), "utf8");

async function listJs(dir = SRC) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await listJs(full));
    else if (e.name.endsWith(".js")) out.push(full);
  }
  return out;
}

// 1. manifest parses and every file it references exists
let manifest;
try {
  manifest = await readManifest();
  ok(`manifest.json is valid (v${manifest.version}, MV${manifest.manifest_version})`);
} catch (e) {
  fail("manifest.json could not be parsed", [e.message]);
  process.exit(1);
}

const referenced = new Set([
  ...Object.values(manifest.icons || {}),
  ...Object.values(manifest.action?.default_icon || {}),
  manifest.action?.default_popup,
  manifest.background?.service_worker,
  ...(manifest.background?.scripts || []),
  ...(manifest.content_scripts || []).flatMap((c) => [...(c.js || []), ...(c.css || [])]),
].filter(Boolean));
const missing = [];
for (const f of referenced) if (!(await exists(f))) missing.push(f);
missing.length ? fail("manifest references missing files", missing)
  : ok(`all ${referenced.size} manifest files are present`);

// 2. local files referenced from popup.html exist
const html = await read("popup.html");
const htmlRefs = [...html.matchAll(/(?:src|href)="([^"#:]+)"/g)].map((m) => m[1]);
const htmlMissing = [];
for (const f of htmlRefs) if (!(await exists(f))) htmlMissing.push(f);
htmlMissing.length ? fail("popup.html references missing files", htmlMissing)
  : ok(`popup.html: all ${htmlRefs.length} local references are present`);

// 3. JS syntax
const syntaxErrors = [];
for (const file of await listJs()) {
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
  } catch (e) {
    syntaxErrors.push(`${path.relative(SRC, file)}: ${e.stderr.toString().split("\n").find((l) => /Error/.test(l)) || "syntax error"}`);
  }
}
syntaxErrors.length ? fail("JS syntax errors", syntaxErrors) : ok("all JS files have valid syntax");

// 4. popup.js ↔ popup.html: every literal getElementById target exists
const popupJs = await read("popup.js");
const htmlIds = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
const jsIds = new Set([...popupJs.matchAll(/getElementById\("([^"]+)"\)/g)].map((m) => m[1]));
const missingIds = [...jsIds].filter((id) => !htmlIds.has(id));
missingIds.length ? fail("popup.js looks up elements missing from popup.html", missingIds)
  : ok(`popup.js ↔ popup.html: all ${jsIds.size} ids found`);

// 5. translations: ru and en have the same keys, and every t("key") exists
const block = (lang) => {
  const m = popupJs.match(new RegExp(`\\n  ${lang}: \\{([\\s\\S]*?)\\n  \\}`));
  return new Set(m ? [...m[1].matchAll(/(\w+):\s*"/g)].map((x) => x[1]) : []);
};
const ru = block("ru"), en = block("en");
const effectNames = [...popupJs.matchAll(/\{ name: "(\w+)", icon:/g)].map((m) => m[1]);
const used = new Set([
  ...[...popupJs.matchAll(/\bt\("(\w+)"\)/g)].map((m) => m[1]),
  ...effectNames.flatMap((n) => [`${n}Label`, `${n}Sub`]),
]);
const i18nProblems = [
  ...[...ru].filter((k) => !en.has(k)).map((k) => `"${k}" is in ru but not in en`),
  ...[...en].filter((k) => !ru.has(k)).map((k) => `"${k}" is in en but not in ru`),
  ...[...used].filter((k) => !ru.has(k)).map((k) => `"${k}" is used but not translated`),
];
if (!ru.size || !en.size) fail("could not find the ru/en dictionaries in popup.js");
else if (i18nProblems.length) fail("translation problems", i18nProblems);
else ok(`translations: ${ru.size} keys, ru and en match`);

// 6. Mozilla's validator (the same one AMO runs) on the Firefox build, warnings count as errors
const ffDir = await stage("firefox");
try {
  const result = await quietly(() => webExt.cmd.lint(
    { sourceDir: ffDir, output: "json", warningsAsErrors: true, selfHosted: false },
    { shouldExitProgram: false },
  ));
  const issues = [...(result?.errors || []), ...(result?.warnings || [])];
  issues.length
    ? fail("web-ext lint found problems", issues.map((i) => `${i.code}: ${i.message} ${i.file ? `(${i.file}${i.line ? ":" + i.line : ""})` : ""}`))
    : ok("web-ext lint (AMO validator): no errors or warnings");
} finally {
  await cleanStage();
}

console.log();
if (failed) {
  console.log(`\x1b[31m  Problems found: ${failed}\x1b[0m`);
  process.exit(1);
}
console.log("\x1b[32m  All good - ready to build.\x1b[0m");

# iframe-changer-extenstion

[![Get the Add-on for Firefox](https://img.shields.io/badge/Get%20for%20Firefox-FF7139?style=for-the-badge&logo=firefox&logoColor=white)](https://addons.mozilla.org/ru/firefox/addon/iframe-changer/)
[![Version](https://img.shields.io/badge/version-1.2.0-6750A4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://github.com/giahoki/iframe-changer-extenstion/releases/latest)

A browser extension that redirects one website and displays it inside another using an iframe, with a fully authentic **Material Design 3** settings panel.

## What does it do?

- Visit **Website B** but see **Website A** displayed inside it
- All transparently — looks like you're on Website A
- Configure everything from a Google-style MD3 popup (12 accent presets, 12 background effects, animations)

## Features

- One **Manifest V3** codebase in `src/` that loads in both Chrome/Edge and Firefox (128+)
- Redirects use native `declarativeNetRequest` rules — fast, no page flash
- Header stripping (`X-Frame-Options` / CSP) applies only to *Site 1 framed inside Site 2*, not to every iframe on the web
- Minimal permissions: just `storage` and `declarativeNetRequest`
- npm scripts and `dev.bat` for building, checking and running (`web-ext`)

## Installation

### Firefox
[Install from Firefox Add-ons](https://addons.mozilla.org/ru/firefox/addon/iframe-changer/)

### Chrome / Chromium / Edge (unpacked)
1. Download or clone this repository
2. Open `chrome://extensions/`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked**
5. Select the **`src`** folder

### Firefox (temporary, for development)
Open `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on…** → pick `src/manifest.json`.

## How to use

1. Click the extension icon in the toolbar
2. Enter two URLs (or use the *current tab* / *paste* buttons):
   - **Site 1** — the website whose content you want to see
   - **Site 2** — the address that will be shown
3. Toggle the switch to enable
4. Click **Save** (or press `Ctrl+S`)
5. Optionally pick an accent and background effects in the ⚙ panel

### Example

| Field  | Value                          |
|--------|--------------------------------|
| Site 1 | `https://www.google.com`       |
| Site 2 | `https://www.youtube.com`      |

Opening google.com now lands on youtube.com, showing Google inside the iframe.

## Development

On Windows, just run **`dev.bat`** — a menu for building, checking and launching the extension (installs dependencies on first run). Or use npm directly:

```bash
npm install
npm run build           # dist/iframe-changer-<version>-chrome.zip and -firefox.zip
npm run check           # manifest & file refs, JS syntax, element ids, translations, AMO validator
npm run dev:chrome      # launch Chromium with the extension loaded, auto-reload on change
npm run dev:firefox     # same for Firefox
npm run build:lib       # rebuild src/lib/material-color-utilities.js from npm
```

`dev.bat` also works without the menu: `dev.bat build`, `dev.bat check`, `dev.bat release` (check, then build if everything passes).

For AMO review, the bundled `src/lib/material-color-utilities.js` is reproducible with `npm ci && npm run build:lib` (pinned `@material/material-color-utilities@0.2.7`).

## File structure

```
iframe-changer-extenstion/
├── src/                            # The extension (load this folder)
│   ├── manifest.json               # MV3, works in Chrome and Firefox
│   ├── background.js               # declarativeNetRequest rules, title relay
│   ├── content.js                  # Replaces Site 2 with an iframe of Site 1
│   ├── polyfill.js                 # browser.* alias for Chrome
│   ├── popup.html / popup.css / popup.js
│   ├── lib/material-color-utilities.js
│   └── icons/
├── scripts/
│   ├── build.mjs                   # Per-browser zips
│   ├── check.mjs                   # Health check
│   ├── stage.mjs                   # Per-browser manifest trimming
│   └── build-lib.mjs               # Rebuilds the MCU bundle
├── assets/logo.png                 # Full-size logo (rounded)
├── dev.bat                         # Windows menu: build / check / run
└── package.json
```

## How it works

- **`background.js`** — keeps two dynamic `declarativeNetRequest` rules in sync with storage: redirect Site 1 → Site 2, and strip frame-blocking headers from Site 1 when it is framed by Site 2
- **`content.js`** — on Site 2, replaces the document with a full-screen iframe of Site 1 and mirrors its title
- **`popup.*`** — MD3 settings panel; persists `site1`, `site2`, `enabled`, `customTitle`, `accent`, `activeEffects`, `glassMode` and an unsaved `draft` to `browser.storage.local`
- **`lib/material-color-utilities.js`** — Google's library that turns any accent into the full Material You tonal palette

## Permissions

| Permission              | Why                                                      |
|-------------------------|----------------------------------------------------------|
| `storage`               | Save your sites, accent, effects and draft               |
| `declarativeNetRequest` | Redirect Site 1 → Site 2 and allow Site 1 to be framed   |
| `<all_urls>`            | Rules and the content script apply to whichever sites you choose |

## Important notes

- Some sites block iframing in other ways (e.g. JS frame-busting) — those may still not load
- This is a development tool — use responsibly
- Pop-ups, redirects and other in-iframe features may not work as expected

## License

MIT

# iframe-changer-extenstion

[![Get the Add-on for Firefox](https://img.shields.io/badge/Get%20for%20Firefox-FF7139?style=for-the-badge&logo=firefox&logoColor=white)](https://addons.mozilla.org/ru/firefox/addon/iframe-changer/)
[![Version](https://img.shields.io/badge/version-1.1.0-6750A4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://github.com/giahoki/iframe-changer-extenstion/releases/latest)

A browser extension that redirects one website and displays it inside another using an iframe, with a fully authentic **Material Design 3** settings panel.

## What does it do?

- Visit **Website B** but see **Website A** displayed inside it
- All transparently — looks like you're on Website A
- Configure everything from a Google-style MD3 popup (light/dark, 12 accent presets, animations)

## What's new in 1.1.0

Full **Material You** redesign of the popup:

- **Authentic MD3 color system** — HCT color space via Google's [material-color-utilities](https://github.com/material-foundation/material-color-utilities), full 30+ design tokens (`primary`, `primaryContainer`, `surfaceContainer*`, `onPrimaryContainer`, …), tonal palette derived from your accent color
- **8 visual effects** bound to the active palette: snow, rain, stars, aurora, bubbles, fireflies, liquid, confetti
- **MD3 components**: top app bar, extended FAB, outlined text fields with floating labels, MD3 switch, segmented button, list items, snackbar
- **12 accent presets** + random accent generation (`Hct.from(hue, chroma, tone)`)
- **Animated color transitions** on every token (MD3 `long2` × `emphasized` curve)
- **Snackbar** slides down from the top with elevation
- Russian (default) / English UI

## Installation

### Firefox
[Install from Firefox Add-ons](https://addons.mozilla.org/ru/firefox/addon/iframe-changer/)

### Chrome / Chromium / Edge
1. Download or clone this repository
2. Open `chrome://extensions/`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked**
5. Select this folder

## How to use

1. Click the extension icon in the toolbar
2. Enter two URLs:
   - **Site 1** — the website you want to see
   - **Site 2** — the address that will display it
3. Toggle the switch to enable
4. Pick an accent (or hit the random button)
5. Optionally choose a background effect
6. Click **Save**

### Example

| Field  | Value                          |
|--------|--------------------------------|
| Site 1 | `https://www.google.com`       |
| Site 2 | `https://www.youtube.com`      |

Visiting YouTube will now show Google inside the iframe.

## Important notes

- Some sites block iframing via `X-Frame-Options` / `CSP` — the iframe may not load
- This is a development tool — use responsibly
- Pop-ups, redirects and other in-iframe features may not work as expected

## File structure

```
iframe-changer-extenstion/
├── README.md                       # Project documentation
├── manifest.json                   # Chrome / MV3 manifest
├── popup.html                      # MD3 settings panel UI
├── popup.js                        # Palette engine, effects, settings
├── background.js                   # URL redirect handler
├── content.js                      # Iframe injector
├── polyfill.js                     # Cross-browser browser.* shim
├── lib/
│   └── material-color-utilities.js # Google MCU IIFE bundle (HCT + schemes)
├── icons/
│   ├── img.png                     # Default icon
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── firefox/                        # Firefox / MV2 build
    ├── manifest.json
    ├── popup.html
    ├── popup.js
    ├── background.js
    ├── content.js
    ├── lib/
    │   └── material-color-utilities.js
    └── icons/
```

## How it works

- **`background.js`** — intercepts navigation to Site 2, redirects to Site 1
- **`content.js`** — on Site 1, replaces the document with an iframe of Site 2
- **`popup.html` / `popup.js`** — MD3 settings panel, persists `site1`, `site2`, `enabled`, `accent`, `effect` to `browser.storage.local`
- **`lib/material-color-utilities.js`** — bundled Google library that turns any hex accent into the full Material You tonal palette (primary, secondary, tertiary, neutral, neutral-variant at all 18 tones)

## Permissions

| Permission            | Why                                            |
|-----------------------|------------------------------------------------|
| `storage`             | Save your sites, accent and effect             |
| `webRequest` / `webRequestBlocking` | Intercept and redirect Site 2 → Site 1 |
| `webNavigation`       | Detect navigations on the target sites         |
| `tabs`                | Update tab state on enable/disable              |
| `<all_urls>`          | Apply the rules to every site                  |

## License

MIT

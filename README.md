# iframe-changer-extenstion

A simple browser extension that redirects one website and displays it inside another using an iframe.

## What does it do?

This extension lets you:
- Visit **Website B**
- But see **Website A** displayed inside it
- All transparently - it looks like you're on Website A

## How it works

**Step 1:** You visit `https://example.com` (Website B)

**Step 2:** The extension redirects you to `https://redirect-to.com` (Website A)

**Step 3:** Website A loads inside an iframe on the redirect page

**Result:** You see Website A's content, but the URL bar shows Website B's address

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Turn on **Developer mode** (top right)
4. Click **Load unpacked**
5. Select this folder
6. Done! The extension is now installed

## How to use

1. Click the extension icon in your browser toolbar
2. Enter two URLs:
   - **Site 1:** The website you want to see
   - **Site 2:** The website address that will display it
3. Check the box to enable the extension
4. Click **Save changes**

### Example

- **Site 1:** `https://www.google.com`
- **Site 2:** `https://www.youtube.com`

Now when you visit YouTube, you'll see Google inside an iframe instead!

## Important Notes

⚠️ Some websites may not work inside iframes due to security restrictions
⚠️ This is a development tool - use responsibly
⚠️ Some features might not work properly in iframes (pop-ups, redirects, etc.)

## File Structure

```
iframe-changer-extenstion/
├── README.md                 # Project documentation
├── manifest.json            # Extension configuration and permissions
├── popup.html               # Settings panel UI
├── popup.js                 # Popup logic and settings management
├── background.js            # Handles URL redirects
├── content.js               # Embeds the iframe on the page
└── icons/
    ├── icon16.png           # 16x16px icon
    ├── icon32.png           # 32x32px icon
    ├── icon48.png           # 48x48px icon
    └── icon128.png          # 128x128px icon (main icon)
```

## File Descriptions

### Core Files

| File | Purpose |
|------|---------|
| **manifest.json** | Defines extension metadata, permissions, and scripts to load |
| **popup.html** | HTML structure for the extension settings panel |
| **popup.js** | JavaScript logic for handling user settings and storage |
| **background.js** | Service worker that intercepts and redirects URL requests |
| **content.js** | Injects and manages the iframe on web pages |

### Assets

| File | Purpose |
|------|---------|
| **icon16.png** | Small icon for extension toolbar |
| **icon32.png** | Medium icon for extension menu |
| **icon48.png** | Icon for extension page |
| **icon128.png** | Large icon for webstore (if published) |

## How the code works

**background.js** - When you visit Site 2, it redirects you to Site 1

**content.js** - When you're on Site 1, it displays Site 2 in an iframe instead

**popup.js** - The settings window where you configure which sites to swap

**popup.html** - The UI for the settings window with input fields and controls

<img src="icon.png" alt="Beautiful JSON Formatter" width="128" />


# Beautiful JSON Formatter

Detects and formats JSON with a beautiful, interactive UI directly in Chrome.

English | [中文](README.zh-CN.md)

## Features
- Auto-detects JSON responses and renders an interactive tree view
- Collapsible objects/arrays with closing brackets on their own line
- Gutter line numbers aligned by depth
- Toolbar controls: Show Raw, Line Numbers, Copy JSON
- Dark theme by default

## How It Works
- Content script runs on all pages and activates when JSON is detected (`manifest.json:13-17`, `content.js:222-227`).
- The page body is replaced with a formatted view and a toolbar (`content.js:230-251`).
- UI elements and behavior are built in plain JS and styled via CSS variables (`content.js:160-219`, `styles.css:1-20`).

## Install (Load Unpacked)
1. Open `chrome://extensions` in Chrome
2. Enable `Developer mode`
3. Click `Load unpacked`
4. Select the project folder
5. Visit a URL that returns JSON (e.g. `https://api.github.com`) to see the formatter

## Usage
- Toggle `Show Raw` to switch between the raw JSON and the formatted view (`content.js:170-176`).
- Toggle `Line Numbers` to show/hide line numbers (`content.js:189-197`).
- Click `Copy JSON` to copy pretty-printed JSON to clipboard (`content.js:206-215`).

## Development
- Manifest v3 defines a single content script with CSS (`manifest.json:2`, `manifest.json:13-17`).
- `test.html` lets you quickly preview the formatter without loading the extension (`test.html:1-33`).
- Core rendering builds a tree with collapsers and per-line numbering (`content.js:39-120`, `content.js:150-158`).
- Styling uses CSS variables and calculates the line-number gutter with depth (`styles.css:1-20`, `styles.css:60-86`).

## Packaging
- Zip the folder (including `manifest.json`, `content.js`, `styles.css`, icons) to distribute manually
- Or keep it loaded as an unpacked extension during development

## Permissions & Privacy
- Runs as a content script on `<all_urls>` (`manifest.json:13`)
- No network requests or data collection; all processing happens locally in the browser

## Compatibility
- Built for Chrome Manifest V3
- Should work in Chromium-based browsers that support MV3

## License
MIT. You are free to use, modify, and distribute.
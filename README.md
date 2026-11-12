# Salya Crosshair

A browser extension that adds crosshair highlighting to Google Sheets, making it easier to track the active cell's row and column.

## Version

Current version: **2.0.0**

## Features

- Highlights the currently selected cell.
- Highlights the active cell's entire row and column.
- Supports frozen rows and columns.
- Handles horizontal and vertical scrolling.
- Updates highlights when switching between sheets.
- Uses MutationObservers to track active-cell changes.
- Lightweight implementation using vanilla JavaScript.

## Tech Stack

- JavaScript (ES Modules)
- Browser Extension Manifest V3
- [esbuild](https://esbuild.github.io/) for bundling

## Project Structure

```text
salya-crosshair/
├── manifest.json
├── content.js
├── modules/
│   ├── config.js
│   ├── geometry.js
│   ├── overlays.js
│   └── observers.js
├── dist/
│   └── content.js
├── package.json
├── package-lock.json
└── .gitignore
```

### Modules

| File           | Responsibility                               |
| -------------- | -------------------------------------------- |
| `content.js`   | Extension entry point                        |
| `config.js`    | DOM selectors and overlay configuration      |
| `geometry.js`  | Active-cell geometry and grid calculations   |
| `overlays.js`  | Overlay creation, positioning, and rendering |
| `observers.js` | MutationObservers and event listeners        |

## Getting Started

### Prerequisites

- Node.js and npm
- Firefox or another compatible browser
- Access to Google Sheets

### Installation

Clone the repository:

```bash
git clone https://github.com/Abhi-A-S/salya-crosshair.git
cd salya-crosshair
```

Install dependencies:

```bash
npm install
```

Build the extension:

```bash
npm run build
```

The bundled content script will be generated at:

```text
dist/content.js
```

### Loading in Firefox

1. Open `about:debugging#/runtime/this-firefox`.
2. Select **Load Temporary Add-on**.
3. Select the project's `manifest.json`.
4. Open or reload a Google Sheets document.

The extension should now be active.

## Development

Build the extension manually:

```bash
npm run build
```

Start watch mode to automatically rebuild when source files change:

```bash
npm run watch
```

After rebuilding, reload the temporary extension in Firefox to load the latest changes.

## Current Status

Salya Crosshair is under active development. The current implementation focuses on reliable crosshair highlighting, including support for Google Sheets frozen panes and dynamic sheet changes.

## License

This project is licensed under the Apache License 2.0.
See the [LICENSE](LICENSE) file for details.

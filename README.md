# FocusTube - YouTube Ad Blocker Extension

<div align="center">

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Chrome](https://img.shields.io/badge/Chrome-Compatible-yellow.svg)
![Edge](https://img.shields.io/badge/Edge-Compatible-blue.svg)

**A powerful, lightweight browser extension that automatically skips and blocks YouTube ads for an uninterrupted viewing experience.**

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Contributing](#contributing) • [Support](#support)

</div>

---

## Overview

FocusTube enhances your YouTube experience by automatically detecting and eliminating ads, allowing you to focus on the content that matters. With intelligent ad detection algorithms and seamless integration, FocusTube works silently in the background to ensure uninterrupted video playback.

## Features

### Core Functionality
- **Automatic Ad Skipping** - Instantly skips skippable video ads when the skip button appears
- **Speed Through Unskippable Ads** - Accelerates non-skippable ads up to 16x speed
- **Banner & Overlay Removal** - Eliminates display ads, overlays, and promotional banners
- **Feed Ad Blocking** - Removes sponsored content from your YouTube homepage and search results
- **Popup Dismissal** - Automatically closes promotional popups and notifications

### Additional Features
- **Pause/Resume Toggle** - Easily enable or disable ad blocking through the extension popup
- **Autoplay Control** - Configure video autoplay behavior according to your preferences
- **Custom Next Button** - Adds a convenient "Next" button beside video titles for quick navigation
- **Keyboard Shortcuts** - Press `Ctrl+B` to toggle player visibility
- **Lightweight Design** - Minimal resource usage with optimized performance
- **Privacy-First** - No data collection, tracking, or external servers

## Installation

### From Source (Developer Mode)

1. **Clone the Repository**
   ```bash
   git clone https://github.com/wuwangzhang1216/FocusTube.git
   cd FocusTube
   ```

2. **Load in Chrome/Edge**
   - Open Chrome/Edge and navigate to `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode" toggle in the top right
   - Click "Load unpacked"
   - Select the `Resources` folder from the cloned repository

3. **Verify Installation**
   - The FocusTube icon should appear in your extensions toolbar
   - Navigate to YouTube to confirm the extension is working

### Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Google Chrome | 88+ | ✅ Fully Supported |
| Microsoft Edge | 88+ | ✅ Fully Supported |
| Brave | Latest | ✅ Fully Supported |
| Opera | 74+ | ✅ Fully Supported |
| Firefox | - | ❌ Not Supported (Manifest V3) |

## Usage

### Getting Started

Once installed, FocusTube works automatically. No configuration required!

1. **Navigate to YouTube** - The extension activates automatically on YouTube pages
2. **Watch Videos** - Ads will be skipped or blocked without any action needed
3. **Control Settings** - Click the extension icon to access controls:
   - Toggle ad blocking on/off
   - Enable/disable autoplay
   - View current status

### Keyboard Shortcuts

| Shortcut | Action |
|----------|---------|
| `Ctrl + B` | Toggle player visibility |

### Extension Controls

Access the popup menu by clicking the FocusTube icon in your toolbar:

- **Pause/Resume** - Temporarily disable or re-enable ad blocking
- **Autoplay Toggle** - Control whether videos play automatically
- **Status Indicator** - Shows current operational status

## How It Works

FocusTube uses multiple strategies to ensure comprehensive ad blocking:

1. **DOM Manipulation** - Identifies and removes ad elements from the page
2. **Event Interception** - Automatically clicks skip buttons when available
3. **Playback Control** - Speeds up unskippable ads and mutes audio
4. **Mutation Observation** - Monitors page changes to catch dynamically loaded ads

## Technical Details

### Architecture

```
FocusTube/
├── Resources/
│   ├── manifest.json       # Extension configuration
│   ├── content.js          # Main ad blocking logic
│   ├── background.js       # Service worker
│   ├── popup.html          # Extension popup UI
│   ├── popup.js            # Popup functionality
│   ├── popup.css           # Popup styling
│   └── images/             # Extension icons
└── _locales/               # Internationalization
```

### Permissions

The extension requires minimal permissions:

- **Host Permission**: `*://*.youtube.com/*` - Required to access YouTube pages
- **Storage**: For saving user preferences locally

## Contributing

We welcome contributions from the community! Here's how you can help:

### Reporting Issues

Found a bug or have a feature request? [Open an issue](https://github.com/wuwangzhang1216/FocusTube/issues) with:
- Clear description of the problem
- Steps to reproduce
- Browser version and OS
- Console errors (if any)

### Development

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow existing code style
   - Test thoroughly on YouTube
   - Update documentation if needed
4. **Submit a pull request**
   - Describe your changes clearly
   - Reference any related issues

### Code Style Guidelines

- Use consistent indentation (4 spaces)
- Add descriptive comments for complex logic
- Keep functions focused and modular
- Test on multiple YouTube page types (home, video, search)

## Troubleshooting

### Common Issues

**Extension not working?**
- Ensure you're on a YouTube page
- Check if the extension is enabled in your browser
- Try refreshing the page
- Clear browser cache and cookies

**Ads still appearing?**
- YouTube frequently updates their ad delivery methods
- Check for extension updates
- Report specific ad types that aren't being blocked

**Performance issues?**
- Disable other YouTube extensions to avoid conflicts
- Check browser console for errors
- Ensure your browser is up to date

## Privacy Policy

FocusTube is committed to user privacy:

- **No Data Collection** - We don't collect any user data or browsing history
- **No External Servers** - All processing happens locally in your browser
- **No Analytics** - No tracking or telemetry
- **Local Storage Only** - Settings are stored locally on your device

## Support

Need help or have questions?

- **Issues**: [GitHub Issues](https://github.com/wuwangzhang1216/FocusTube/issues)
- **Email**: [wangzhangwu1216@gmail.com](mailto:wangzhangwu1216@gmail.com)
- **Discussions**: [GitHub Discussions](https://github.com/wuwangzhang1216/FocusTube/discussions)

## License

FocusTube is open-source software licensed under the [MIT License](LICENSE).

```
MIT License

Copyright (c) 2025 FocusTube

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Acknowledgments

- Thanks to all contributors who help improve FocusTube
- Inspired by the need for a cleaner YouTube experience
- Built with respect for content creators while prioritizing user experience

---

<div align="center">

**Made with ❤️ for a better YouTube experience**

If you find FocusTube helpful, please consider starring ⭐ the repository!

</div>

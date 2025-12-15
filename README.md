# lux-gui

A beautiful GUI application for [Lux](https://github.com/iawia002/lux) video downloader, built with Tauri.

## Features

- 🎬 Download videos from popular platforms (YouTube, Bilibili, etc.)
- 📊 Get video information before downloading
- 🎨 Beautiful and intuitive user interface
- 🚀 Fast and lightweight (powered by Tauri + Rust)
- 💾 Support for multiple formats (MP4, FLV, MP3)
- ℹ️ Info-only mode to check video details

## Prerequisites

Before running this application, you need to install **Lux**:

### Install Lux

**On macOS/Linux:**
```bash
# Using Homebrew
brew install lux

# Or download from GitHub releases
# https://github.com/iawia002/lux/releases
```

**On Windows:**
```powershell
# Using Scoop
scoop install lux

# Or download from GitHub releases
# https://github.com/iawia002/lux/releases
```

## Development

### Prerequisites
- Node.js (v16 or higher)
- Rust (latest stable)
- Lux (installed and available in PATH)
- System dependencies for Tauri (Linux only):
  ```bash
  # On Ubuntu/Debian
  sudo apt update
  sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
  ```

### Setup

1. Clone the repository:
```bash
git clone https://github.com/xbghc/lux-gui.git
cd lux-gui
```

2. Install dependencies:
```bash
npm install
```

3. Run in development mode:
```bash
npm run dev
```

### Build

To build the application for production:

```bash
npm run build
```

The built application will be available in `src-tauri/target/release/`.

## Usage

1. Launch the application
2. Enter a video URL (e.g., YouTube, Bilibili)
3. (Optional) Select a format from the dropdown
4. (Optional) Check "Show info only" to preview video details without downloading
5. Click "Download" to start downloading, or "Get Info" to fetch video information

## Supported Platforms

- YouTube
- Bilibili
- Douyin (TikTok China)
- And many more platforms supported by Lux

See [Lux documentation](https://github.com/iawia002/lux) for a complete list.

## Technologies

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Rust + Tauri
- **Downloader**: Lux (Go-based)

## License

ISC

## Credits

- [Lux](https://github.com/iawia002/lux) - The underlying video downloader
- [Tauri](https://tauri.app/) - The framework for building the desktop application

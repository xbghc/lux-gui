# Application Architecture

## Overview

Lux GUI is a desktop application that provides a graphical interface for the Lux video downloader. It follows a client-server architecture using Tauri.

## Technology Stack

### Frontend
- **HTML5**: Structure and layout
- **CSS3**: Styling with modern gradient backgrounds
- **JavaScript (ES6+)**: Logic and Tauri API integration
- **Tauri API**: Bridge between frontend and backend

### Backend
- **Rust**: Core application logic
- **Tauri Framework**: Cross-platform desktop framework
- **Lux**: Command-line video downloader (external dependency)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Web)                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │  HTML (dist/index.html)                         │   │
│  │  - Input form for video URL                     │   │
│  │  - Format selection dropdown                    │   │
│  │  - Download/Info buttons                        │   │
│  │  - Progress display                             │   │
│  │  - Output section                               │   │
│  └─────────────────────────────────────────────────┘   │
│                         ↕                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  JavaScript (dist/main.js)                      │   │
│  │  - Event handlers                               │   │
│  │  - Tauri API calls                              │   │
│  │  - UI updates                                   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↕
              ┌──────────────────────┐
              │   Tauri Bridge       │
              │  (@tauri-apps/api)   │
              └──────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                  Backend (Rust)                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Commands (src-tauri/src/lib.rs)                │   │
│  │  - download_video(url, format, info_only)       │   │
│  │  - get_video_info(url)                          │   │
│  └─────────────────────────────────────────────────┘   │
│                         ↕                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Process Execution                              │   │
│  │  - std::process::Command                        │   │
│  │  - Spawns Lux subprocess                        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↕
                    ┌─────────┐
                    │   Lux   │
                    │ (CLI)   │
                    └─────────┘
                          ↕
                  ┌───────────────┐
                  │  Video Sites  │
                  │ (YouTube,etc) │
                  └───────────────┘
```

## File Structure

```
lux-gui/
├── dist/                          # Frontend files
│   ├── index.html                 # Main UI structure
│   ├── styles.css                 # Application styling
│   └── main.js                    # Frontend logic
├── src-tauri/                     # Tauri backend
│   ├── src/
│   │   ├── lib.rs                 # Main application logic
│   │   └── main.rs                # Entry point
│   ├── icons/                     # Application icons
│   ├── capabilities/              # Permission configuration
│   │   └── default.json
│   ├── Cargo.toml                 # Rust dependencies
│   ├── tauri.conf.json            # Tauri configuration
│   └── build.rs                   # Build script
├── package.json                   # Node.js dependencies
├── README.md                      # User documentation
├── TESTING.md                     # Testing guide
├── ARCHITECTURE.md                # This file
└── .gitignore                     # Git ignore rules
```

## Component Description

### Frontend Components

#### 1. Input Section
- Text input field for video URL
- Placeholder text guides users
- Enter key support for quick download

#### 2. Format Selection
- Dropdown menu with format options
- Options: Auto, MP4, FLV, MP3
- Default: Auto (best quality)

#### 3. Options Section
- Checkbox for "Info only" mode
- Allows preview without downloading

#### 4. Action Buttons
- **Download Button**: Primary action
  - Gradient purple background
  - Calls `download_video` command
  - Disabled during operation
  
- **Info Button**: Secondary action
  - Gray background
  - Calls `get_video_info` command
  - Disabled during operation

#### 5. Progress Section
- Animated progress bar
- Status text display
- Shows/hides based on operation state

#### 6. Output Section
- Scrollable text area
- Displays Lux command output
- Shows success/error messages

### Backend Components

#### 1. download_video Command
```rust
fn download_video(url: String, format: Option<String>, info_only: bool) -> Result<String, String>
```
- Constructs Lux command with parameters
- Executes command and captures output
- Returns stdout/stderr as formatted string
- Error handling for missing Lux installation

#### 2. get_video_info Command
```rust
fn get_video_info(url: String) -> Result<String, String>
```
- Executes Lux with `-i` (info) flag
- Returns video metadata
- Similar error handling as download_video

## Data Flow

### Download Flow

1. User enters URL and clicks "Download"
2. JavaScript validates input
3. `invoke('download_video', {...})` called
4. Tauri bridge passes data to Rust
5. Rust constructs and executes Lux command
6. Lux fetches and downloads video
7. Output captured and returned to JavaScript
8. UI updated with result

### Info Flow

1. User enters URL and clicks "Get Info"
2. JavaScript validates input
3. `invoke('get_video_info', {...})` called
4. Tauri bridge passes data to Rust
5. Rust executes `lux -i [URL]`
6. Video metadata returned
7. UI displays information

## Security Considerations

### Input Validation
- URLs validated by Lux
- No direct shell command injection
- Parameters passed as structured arguments

### Permissions
- File system access through Lux
- No sensitive data storage
- Standard Tauri security model

### Process Isolation
- Lux runs as subprocess
- Sandboxed execution
- Error messages sanitized

## Future Enhancements

### Potential Features
1. **Download Queue**: Multiple simultaneous downloads
2. **Directory Selection**: Custom download location
3. **Real-time Progress**: Parse Lux output stream
4. **Download History**: Track completed downloads
5. **Playlist Support**: Batch download from playlists
6. **Settings Panel**: Configure default format, location
7. **Thumbnail Preview**: Show video thumbnail before download
8. **Resume Support**: Resume interrupted downloads

### Technical Improvements
1. **Streaming Output**: Real-time log streaming from Lux
2. **Error Recovery**: Automatic retry logic
3. **Performance**: Async command execution
4. **Testing**: Unit tests for Rust commands
5. **CI/CD**: Automated builds for multiple platforms

## Build Process

### Development Build
1. Tauri reads `tauri.conf.json`
2. Frontend served from `dist/` folder
3. Rust code compiled in debug mode
4. WebView loads HTML/CSS/JS
5. Hot reload enabled

### Production Build
1. Frontend bundled
2. Rust code optimized (release mode)
3. Assets embedded in binary
4. Platform-specific packaging
5. Code signing (optional)

## Dependencies

### Runtime Dependencies
- **Lux**: Must be installed and in PATH
- **System Libraries**: GTK, WebKit (Linux)

### Build Dependencies
- **Node.js**: Frontend tooling
- **Rust**: Backend compilation
- **Tauri CLI**: Build orchestration

## Platform Support

- **Linux**: Full support (tested)
- **macOS**: Compatible (requires testing)
- **Windows**: Compatible (requires testing)

## Performance Characteristics

- **Startup Time**: < 2 seconds
- **Memory Usage**: ~50-100 MB (excluding downloads)
- **CPU Usage**: Minimal (Lux handles heavy lifting)
- **Disk Usage**: ~10-20 MB (application binary)

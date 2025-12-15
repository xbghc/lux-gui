# Testing Guide for Lux GUI

This document describes how to test the Lux GUI application.

## Prerequisites for Testing

Before testing, ensure you have:

1. **Lux installed and in PATH**
   ```bash
   # Test Lux installation
   lux --version
   ```

2. **System dependencies (Linux only)**
   ```bash
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

3. **Node.js and Rust**
   ```bash
   node --version  # Should be v16+
   cargo --version # Should be latest stable
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

This will:
1. Start the Tauri development server
2. Open the application window
3. Enable hot-reload for frontend changes

### Production Build

```bash
npm run build
```

The executable will be in `src-tauri/target/release/`.

## Test Scenarios

### 1. Basic Download Test

**Test URL (YouTube - public domain video):**
- URL: `https://www.youtube.com/watch?v=jNQXAC9IVRw`
- Expected: Video information should be displayed, download should start

**Steps:**
1. Launch the application
2. Paste the test URL
3. Click "Get Info" button
4. Verify video information is displayed
5. Click "Download" button
6. Verify download completes successfully

### 2. Format Selection Test

**Steps:**
1. Enter a video URL
2. Select "MP4" from the format dropdown
3. Click "Download"
4. Verify the video downloads in MP4 format

### 3. Info-Only Mode Test

**Steps:**
1. Enter a video URL
2. Check "Show info only (don't download)"
3. Click "Download"
4. Verify only information is shown, no file is downloaded

### 4. Error Handling Test

**Invalid URL Test:**
1. Enter an invalid URL (e.g., "not-a-url")
2. Click "Download"
3. Verify error message is displayed

**Unsupported Platform Test:**
1. Enter a URL from an unsupported platform
2. Click "Download"
3. Verify appropriate error message is displayed

### 5. UI Responsiveness Test

**Steps:**
1. Resize the application window
2. Verify UI elements adjust appropriately
3. Test minimum window size (600x500)

### 6. Multiple Downloads Test

**Steps:**
1. Download a video
2. Wait for completion
3. Enter a new URL
4. Download another video
5. Verify both downloads work correctly

## Backend Command Testing

You can also test the Lux commands directly:

```bash
# Test video info
lux -i "https://www.youtube.com/watch?v=jNQXAC9IVRw"

# Test download
lux "https://www.youtube.com/watch?v=jNQXAC9IVRw"

# Test with format
lux -f mp4 "https://www.youtube.com/watch?v=jNQXAC9IVRw"
```

## Expected Behavior

### Success Cases

- Video info should display title, duration, quality options
- Downloads should complete with progress indication
- Output should show in the output section
- Files should be saved to the current directory

### Error Cases

- Invalid URLs should show error message
- Missing Lux installation should show helpful error with installation link
- Network errors should be displayed clearly

## Known Limitations

1. **Progress Bar**: The current implementation shows a simple progress animation. Real-time progress would require parsing Lux output stream.

2. **Download Location**: Files are downloaded to the directory where Lux is executed. A future enhancement could add directory selection.

3. **Multiple Simultaneous Downloads**: The current version processes one download at a time.

## Troubleshooting

### Issue: "Failed to execute lux"

**Solution:** Ensure Lux is installed and available in PATH
```bash
which lux  # Should show path to lux binary
```

### Issue: Application won't build

**Solution:** Ensure all system dependencies are installed (see Prerequisites)

### Issue: Downloads fail

**Solution:** Check if Lux can download the video directly from command line:
```bash
lux -i "YOUR_VIDEO_URL"
```

## Security Considerations

- The application executes Lux commands using `std::process::Command`
- User input (URLs) are passed directly to Lux
- Lux handles URL validation and sanitization
- No credentials or sensitive data are stored by the GUI

## Performance Testing

Test with various video lengths:
- Short videos (< 5 minutes)
- Medium videos (5-30 minutes)
- Long videos (> 30 minutes)

Verify the application remains responsive during downloads.

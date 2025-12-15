import { invoke } from '@tauri-apps/api/core';

const urlInput = document.getElementById('url-input');
const formatSelect = document.getElementById('format-select');
const infoOnlyCheckbox = document.getElementById('info-only');
const downloadBtn = document.getElementById('download-btn');
const infoBtn = document.getElementById('info-btn');
const outputSection = document.getElementById('output-section');
const outputContent = document.getElementById('output-content');
const progressSection = document.getElementById('progress-section');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');

// Download button click handler
downloadBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    
    if (!url) {
        alert('Please enter a video URL');
        return;
    }

    try {
        downloadBtn.disabled = true;
        infoBtn.disabled = true;
        outputSection.style.display = 'none';
        progressSection.style.display = 'block';
        progressText.textContent = 'Starting download...';
        progressFill.style.width = '0%';
        
        const format = formatSelect.value;
        const infoOnly = infoOnlyCheckbox.checked;
        
        const result = await invoke('download_video', {
            url: url,
            format: format || null,
            infoOnly: infoOnly
        });
        
        progressFill.style.width = '100%';
        progressText.textContent = 'Download completed!';
        
        setTimeout(() => {
            progressSection.style.display = 'none';
            outputSection.style.display = 'block';
            outputContent.textContent = result;
        }, 1000);
        
    } catch (error) {
        progressSection.style.display = 'none';
        outputSection.style.display = 'block';
        outputContent.textContent = `Error: ${error}`;
    } finally {
        downloadBtn.disabled = false;
        infoBtn.disabled = false;
    }
});

// Info button click handler
infoBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    
    if (!url) {
        alert('Please enter a video URL');
        return;
    }

    try {
        infoBtn.disabled = true;
        downloadBtn.disabled = true;
        outputSection.style.display = 'none';
        progressSection.style.display = 'block';
        progressText.textContent = 'Fetching video information...';
        progressFill.style.width = '50%';
        
        const result = await invoke('get_video_info', {
            url: url
        });
        
        progressFill.style.width = '100%';
        
        setTimeout(() => {
            progressSection.style.display = 'none';
            outputSection.style.display = 'block';
            outputContent.textContent = result;
        }, 500);
        
    } catch (error) {
        progressSection.style.display = 'none';
        outputSection.style.display = 'block';
        outputContent.textContent = `Error: ${error}`;
    } finally {
        infoBtn.disabled = false;
        downloadBtn.disabled = false;
    }
});

// Allow Enter key to trigger download
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        downloadBtn.click();
    }
});

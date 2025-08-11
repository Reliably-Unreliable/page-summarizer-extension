# Page Summarizer Chrome Extension

*"The art of being wise is knowing what to overlook." - William James*

A Chrome extension that uses Google's Gemini AI to summarize web page content. Simply click the extension button on any webpage to get an AI-powered summary of the page content.

## Features

- 🤖 AI-powered page summarization using Google Gemini
- 🚀 Fast and efficient content extraction
- 🎨 Clean, user-friendly interface
- 🔒 Privacy-focused (content sent directly to Google's Gemini API)
- 📱 Works on any webpage
- 🔑 Secure API key storage using Chrome's storage API

## Architecture

- **Frontend**: Chrome Extension (JavaScript, HTML, CSS)
- **AI Model**: Gemma 3n E4B IT (called directly via REST API)

## Setup Instructions

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key
5. Copy the API key (you'll enter it in the extension)

### 2. Install Chrome Extension

1. Open Chrome and go to `chrome://extensions/`

2. Enable "Developer mode" (toggle in top right)

3. Click "Load unpacked" and select the extension folder

4. The extension should now appear in your Chrome toolbar

## Usage

1. Navigate to any webpage you want to summarize
2. Click the Page Summarizer extension icon in the Chrome toolbar
3. If this is your first time using the extension, enter your Gemini API key and click "Save"
4. Click "Summarize This Page"
5. Wait for the AI to generate a summary
6. Read the summary in the popup

## Files Structure

```
page-summarizer-extension/
├── manifest.json          # Chrome extension manifest
├── popup.html             # Extension popup UI
├── popup.js              # Popup functionality and Gemini API integration
├── content.js            # Content extraction script
├── icons/                # Extension icons
└── README.md            # This file
```

## Troubleshooting

### API Issues
- **"API key not found"**: Make sure you entered your Gemini API key in the extension
- **"API Error: 400"**: Check your Gemini API key is valid and correctly entered
- **"API Error: 403"**: Your API key may be invalid or quota exceeded
- **"API Error: 429"**: You've exceeded the API rate limit, wait a moment and try again

### Extension Issues
- **Extension not loading**: Make sure you're loading the root folder in Chrome extensions
- **"Failed to extract content"**: Some pages may block content scripts - try refreshing the page
- **No summary generated**: Check browser console for errors (F12 → Console)

### Common Fixes
1. Reload the Chrome extension (chrome://extensions/ → reload button)
2. Check browser console for errors (F12 → Console)
3. Verify your API key is correct and has remaining quota
4. Try on a different webpage to test if it's page-specific

## Development

To modify the extension:
1. Make changes to the files
2. Go to `chrome://extensions/`
3. Click the reload button on your extension
4. Test the changes

## Security Notes

- Your API key is stored locally using Chrome's secure storage API
- Page content is sent directly to Google's Gemini API (no third-party servers)
- No data is stored permanently by this application
- API key is stored securely and only accessible by the extension

## License

MIT License - feel free to modify and distribute
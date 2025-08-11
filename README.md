# Page Summarizer Chrome Extension

*Last Updated: August 11, 2025*

A Chrome extension that uses Google's Gemini AI to summarize web page content. Simply click the extension button on any webpage to get an AI-powered summary of the page content.

## Features

- 🤖 AI-powered page summarization using Google Gemini
- 🚀 Fast and efficient content extraction
- 🎨 Clean, user-friendly interface
- 🔒 Privacy-focused (content only sent to your backend)
- 📱 Works on any webpage

## Architecture

- **Frontend**: Chrome Extension (JavaScript, HTML, CSS)
- **Backend**: Python FastAPI server with Gemini AI integration
- **AI Model**: Google Gemini 1.5 Flash

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create environment file:
   ```bash
   cp env.example .env
   ```

4. Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

5. Start the backend server:
   ```bash
   python start.py
   ```

   The server will start at `http://localhost:8000`

### 2. Chrome Extension Setup

1. Open Chrome and go to `chrome://extensions/`

2. Enable "Developer mode" (toggle in top right)

3. Click "Load unpacked" and select the extension folder (not the backend folder)

4. The extension should now appear in your Chrome toolbar

### 3. Getting Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key
5. Copy the API key to your `.env` file

## Usage

1. Make sure the backend server is running (`python backend/start.py`)
2. Navigate to any webpage you want to summarize
3. Click the Page Summarizer extension icon in the Chrome toolbar
4. Click "Summarize This Page"
5. Wait for the AI to generate a summary
6. Read the summary in the popup

## Files Structure

```
page-summarizer-extension/
├── manifest.json          # Chrome extension manifest
├── popup.html             # Extension popup UI
├── popup.js              # Popup functionality
├── content.js            # Content extraction script
├── backend/
│   ├── main.py           # FastAPI backend server
│   ├── start.py          # Server startup script
│   ├── requirements.txt  # Python dependencies
│   ├── .env             # Environment variables (create from env.example)
│   └── env.example      # Environment template
└── README.md            # This file
```

## API Endpoints

- `GET /` - API status
- `GET /health` - Health check
- `POST /summarize` - Summarize page content

## Troubleshooting

### Backend Issues
- **"GEMINI_API_KEY not found"**: Make sure you created `.env` file with your API key
- **"Port 8000 already in use"**: Kill existing processes or change port in `start.py`
- **API errors**: Check your Gemini API key is valid and has quota remaining

### Extension Issues
- **Extension not loading**: Make sure you're loading the root folder, not the backend folder
- **"Failed to extract content"**: Some pages may block content scripts - try refreshing
- **Connection refused**: Make sure backend server is running at `http://localhost:8000`

### Common Fixes
1. Restart the backend server
2. Reload the Chrome extension
3. Check browser console for errors (F12 → Console)
4. Verify API key is correct and has quota

## Development

To modify the extension:
1. Make changes to the files
2. Go to `chrome://extensions/`
3. Click the reload button on your extension
4. Test the changes

## Security Notes

- Your API key is stored locally in the backend `.env` file
- Page content is only sent to your local backend and then to Google's Gemini API
- No data is stored permanently by this application

## License

MIT License - feel free to modify and distribute
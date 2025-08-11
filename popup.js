// Gemini AI API configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemma-3n-e4b-it:generateContent';

async function getApiKey() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['geminiApiKey'], (result) => {
      resolve(result.geminiApiKey);
    });
  });
}

async function saveApiKey(apiKey) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ geminiApiKey: apiKey }, resolve);
  });
}

async function callGeminiAPI(content, title, url) {
  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new Error('API key not found. Please enter your Gemini API key.');
  }

  const prompt = `Please provide a comprehensive summary of the following web page content.
The summary should be:
- Clear and concise (3-5 paragraphs)
- Include the main points and key information
- Well-structured and easy to read
- Focus on the most important aspects

Page Title: ${title}
Page URL: ${url}

Content:
${content}

Please provide only the summary without any additional commentary.`;

  const requestBody = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }]
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Invalid response from Gemini API');
  }

  return data.candidates[0].content.parts[0].text;
}

document.addEventListener('DOMContentLoaded', async function() {
  const summarizeBtn = document.getElementById('summarizeBtn');
  const loadingDiv = document.getElementById('loading');
  const summaryDiv = document.getElementById('summary');
  const errorDiv = document.getElementById('error');
  const apiKeySection = document.getElementById('apiKeySection');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');

  // Check if API key exists
  const existingApiKey = await getApiKey();
  if (existingApiKey) {
    apiKeySection.classList.add('hidden');
  }

  // Save API key
  saveApiKeyBtn.addEventListener('click', async function() {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
      await saveApiKey(apiKey);
      apiKeySection.classList.add('hidden');
      apiKeyInput.value = '';
    }
  });

  // Allow Enter key to save API key
  apiKeyInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      saveApiKeyBtn.click();
    }
  });

  summarizeBtn.addEventListener('click', async function() {
    try {
      // Check if API key exists
      const apiKey = await getApiKey();
      if (!apiKey) {
        apiKeySection.classList.remove('hidden');
        errorDiv.textContent = 'Please enter your Gemini API key first.';
        errorDiv.classList.remove('hidden');
        return;
      }

      // Hide previous results
      summaryDiv.classList.add('hidden');
      errorDiv.classList.add('hidden');
      
      // Show loading
      loadingDiv.classList.remove('hidden');
      summarizeBtn.disabled = true;
      summarizeBtn.textContent = 'Summarizing...';

      // Get active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Extract page content using content script
      const results = await chrome.tabs.sendMessage(tab.id, { action: 'extractContent' });
      
      if (!results.success) {
        throw new Error(results.error || 'Failed to extract page content');
      }

      // Call Gemini API directly
      const summary = await callGeminiAPI(results.content, results.title, tab.url);

      // Display summary
      summaryDiv.innerHTML = `
        <h3>Summary:</h3>
        <p>${summary}</p>
      `;
      summaryDiv.classList.remove('hidden');

    } catch (error) {
      console.error('Error:', error);
      errorDiv.textContent = `Error: ${error.message}`;
      errorDiv.classList.remove('hidden');
      
      // Show API key section if it's an API key related error
      if (error.message.includes('API key')) {
        apiKeySection.classList.remove('hidden');
      }
    } finally {
      // Reset UI
      loadingDiv.classList.add('hidden');
      summarizeBtn.disabled = false;
      summarizeBtn.textContent = 'Summarize This Page';
    }
  });
});
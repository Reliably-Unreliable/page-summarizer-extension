document.addEventListener('DOMContentLoaded', function() {
  const summarizeBtn = document.getElementById('summarizeBtn');
  const loadingDiv = document.getElementById('loading');
  const summaryDiv = document.getElementById('summary');
  const errorDiv = document.getElementById('error');

  summarizeBtn.addEventListener('click', async function() {
    try {
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

      // Send content to backend for summarization
      const response = await fetch('http://localhost:8000/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: results.title,
          content: results.content,
          url: tab.url
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Display summary
      summaryDiv.innerHTML = `
        <h3>Summary:</h3>
        <p>${data.summary}</p>
      `;
      summaryDiv.classList.remove('hidden');

    } catch (error) {
      console.error('Error:', error);
      errorDiv.textContent = `Error: ${error.message}`;
      errorDiv.classList.remove('hidden');
    } finally {
      // Reset UI
      loadingDiv.classList.add('hidden');
      summarizeBtn.disabled = false;
      summarizeBtn.textContent = 'Summarize This Page';
    }
  });
});
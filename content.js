// Content script to extract page content
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractContent') {
    try {
      // Extract page title
      const title = document.title;
      
      // Extract main content by trying different selectors
      let content = '';
      
      // Try to find main content areas
      const contentSelectors = [
        'main',
        'article',
        '[role="main"]',
        '.content',
        '#content',
        '.main-content',
        '.article-content',
        '.post-content'
      ];
      
      let mainElement = null;
      for (const selector of contentSelectors) {
        mainElement = document.querySelector(selector);
        if (mainElement) break;
      }
      
      // If no main element found, use body but filter out unwanted elements
      if (!mainElement) {
        mainElement = document.body;
      }
      
      // Extract text content while excluding certain elements
      const excludeSelectors = [
        'script',
        'style',
        'nav',
        'header',
        'footer',
        '.navigation',
        '.sidebar',
        '.ads',
        '.advertisement',
        '.social-share',
        '.comments'
      ];
      
      // Clone the element to avoid modifying the original
      const clonedElement = mainElement.cloneNode(true);
      
      // Remove unwanted elements
      excludeSelectors.forEach(selector => {
        const elements = clonedElement.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });
      
      // Extract text content
      content = clonedElement.textContent || clonedElement.innerText || '';
      
      // Clean up the content
      content = content
        .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
        .replace(/\n\s*\n/g, '\n') // Remove empty lines
        .trim();
      
      // Limit content length (API might have limits)
      const maxLength = 8000; // Adjust based on API limits
      if (content.length > maxLength) {
        content = content.substring(0, maxLength) + '...';
      }
      
      sendResponse({
        success: true,
        title: title,
        content: content,
        url: window.location.href
      });
      
    } catch (error) {
      console.error('Content extraction error:', error);
      sendResponse({
        success: false,
        error: error.message
      });
    }
  }
  
  return true; // Keep message channel open for async response
});
document.addEventListener('DOMContentLoaded', function() {
    // Event listener for the 'darkMode' button
    document.getElementById('darkMode').addEventListener('click', function() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'applyTheme', theme: 'dark' });
        chrome.storage.sync.set({ theme: 'dark' });
      });
    });
  
    // ... (Other event listeners for lightMode, parsed, formattedRaw, raw)
  
    // Load user preferences from storage and apply them initially
    chrome.storage.sync.get(['theme', 'formatting'], function(result) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'ping'}, function(response) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message); 
          } else {
            // Content script is ready, apply preferences
            if (result.theme) {
              chrome.tabs.sendMessage(tabs[0].id, { action: 'applyTheme', theme: result.theme });
            }
            if (result.formatting) {
              chrome.tabs.sendMessage(tabs[0].id, { action: 'applyFormatting', formatting: result.formatting });
            }
          }
        });
      });
    });
  });
  
// Event listener for the 'darkMode' button
document.getElementById('darkMode').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'applyTheme', theme: 'dark' });
      chrome.storage.sync.set({ theme: 'dark' });
    });
  });
  
  // Event listener for the 'lightMode' button
  document.getElementById('lightMode').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'applyTheme', theme: 'light' });
      chrome.storage.sync.set({ theme: 'light' });
    });
  });
  
  // Event listener for the 'parsed' button
  document.getElementById('parsed').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'applyFormatting', formatting: 'parsed' });
      chrome.storage.sync.set({ formatting: 'parsed' });
    });
  });
  
  // Event listener for the 'formattedRaw' button
  document.getElementById('formattedRaw').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'applyFormatting', formatting: 'formattedRaw' });
      chrome.storage.sync.set({ formatting: 'formattedRaw' });
    });
  });
  
  // Event listener for the 'raw' button
  document.getElementById('raw').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'applyFormatting', formatting: 'raw' });
      chrome.storage.sync.set({ formatting: 'raw' });
    });
  });
  
  // Load user preferences from storage and apply them initially
  chrome.storage.sync.get(['theme', 'formatting'], function(result) {
    if (result.theme) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'applyTheme', theme: result.theme });
      });
    }
  
    if (result.formatting) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'applyFormatting', formatting: result.formatting });
      });
    }
  });
  
// Background service worker
console.log('JSON Auto Formatter background service worker initialized')

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed')
    // Open welcome page or set default settings
  } else if (details.reason === 'update') {
    console.log('Extension updated')
  }
})

// Create context menu for formatting selected JSON
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'formatSelectedJson',
    title: 'Format as JSON',
    contexts: ['selection']
  })
})

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'formatSelectedJson' && tab?.id) {
    chrome.tabs.sendMessage(tab.id, {
      action: 'formatSelection',
      text: info.selectionText
    })
  }
})

// Handle extension icon click
chrome.action.onClicked.addListener(() => {
  // Popup will open automatically due to manifest config
})

export {}

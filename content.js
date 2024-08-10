// Function to extract JSON content from the page
function extractJSONContent() {
    let preTags = document.getElementsByTagName('pre');
    if (preTags.length > 0) {
      return preTags[0].textContent;
    }
  
    return document.body.textContent;
  }
  
  // Function to apply formatting to the JSON content
  function applyFormatting(formatting) {
    let jsonContent = extractJSONContent();
  
    try {
      let parsedJSON = JSON.parse(jsonContent);
  
      if (formatting === 'parsed') {
        document.body.innerHTML = ''; 
  
        let container = document.createElement('div');
        container.id = 'jsonViewerContainer';
        document.body.appendChild(container);
  
        const myJSONViewer = new JSONViewer({
          container,
          data: parsedJSON,
          theme: 'light',
          expand: false
        });
      } else if (formatting === 'formattedRaw') {
        let formattedJSON = JSON.stringify(parsedJSON, null, 2);
        document.body.textContent = formattedJSON;
      } else if (formatting === 'raw') {
        document.body.textContent = jsonContent;
      }
    } catch (error) {
      alert("Invalid JSON: " + error.message);
    }
  }
  
  // Function to apply a theme (dark/light mode)
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode'); 
    } else {
      document.body.classList.remove('dark-mode'); 
    }
  }
  
  // Listen for messages from the toolbar (popup.js)
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'applyFormatting') {
      applyFormatting(request.formatting);
      sendResponse({ success: true });
    } else if (request.action === 'applyTheme') {
      applyTheme(request.theme);
      sendResponse({ success: true });
    }
  });
  
  // Trigger initial formatting when a JSON file is opened
  if (window.location.href.endsWith('.json')) {
    applyFormatting('formattedRaw'); 
  }
  
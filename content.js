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
  
    // Check if jsonContent is valid JSON before parsing
    if (!isJsonValid(jsonContent)) {
      alert("Invalid JSON: The extracted content is not valid JSON.");
      return; 
    }
  
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
      alert("Error parsing JSON: " + error.message); 
    }
  }
  
  // Function to validate JSON 
  function isJsonValid(jsonString) {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (error) {
      return false;
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
  
  // Signal readiness when the content script is loaded
  document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.action === 'ping') {
        console.log("Received ping message in content.js"); // Add logging
        sendResponse({status: 'ready'});
      } else if (request.action === 'applyFormatting') {
        console.log("Received applyFormatting message in content.js with formatting:", request.formatting); // Add logging
        applyFormatting(request.formatting);
        sendResponse({ success: true });
      } else if (request.action === 'applyTheme') {
        console.log("Received applyTheme message in content.js with theme:", request.theme); // Add logging
        applyTheme(request.theme);
        sendResponse({ success: true });
      }
    });
  });
  
  // Dynamically inject the JSONViewer library
  var script = document.createElement('script');
  script.src = chrome.runtime.getURL('lib/json-viewer.min.js'); 
  script.onload = function() {
    // Now that JSONViewer is loaded, trigger initial formatting if applicable
    console.log("JSONViewer library loaded in content.js"); // Add logging
  
    // Trigger initial formatting when a JSON file is opened
    if (window.location.href.endsWith('.json')) {
      applyFormatting('formattedRaw'); 
    }
  };
  document.head.appendChild(script); 
  
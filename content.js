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
  
        // Inject the JSONViewer CSS if it's not already present
        if (!document.getElementById('jsonViewerCSS')) {
          var link = document.createElement('link');
          link.rel = 'stylesheet';
          link.id = 'jsonViewerCSS'; 
          link.href = chrome.runtime.getURL('lib/json-viewer.css');
          document.head.appendChild(link);
        }
  
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
  
  // Signal readiness when the content script and JSONViewer library are loaded
  document.addEventListener('DOMContentLoaded', function() {
    var script = document.createElement('script');
    script.src = chrome.runtime.getURL('lib/json-viewer.min.js');
    script.onload = function() {
      chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'ping') {
          console.log("Received ping message in content.js");
          sendResponse({status: 'ready'});
        } else if (request.action === 'applyFormatting') {
          console.log("Received applyFormatting message in content.js with formatting:", request.formatting);
          applyFormatting(request.formatting);
          sendResponse({ success: true });
        } else if (request.action === 'applyTheme') {
          console.log("Received applyTheme message in content.js with theme:", request.theme);
          applyTheme(request.theme);
          sendResponse({ success: true });
        }
      });
  
      // Trigger initial formatting when a JSON file is opened
      if (window.location.href.endsWith('.json')) {
        applyFormatting('formattedRaw');
      }
    };
    document.head.appendChild(script);
  });
  
  
# JSON-Auto-Formatter


**Project Overview:**

The project aims to create a Chrome extension that enhances the experience of viewing and interacting with JSON files directly in the browser. It provides the following key features:

* **Auto-Formatting:** Automatically formats JSON files upon opening, making them more readable.
* **Toolbar:** Offers a convenient toolbar with options to control the formatting and appearance of the JSON content.
* **Formatting Options:**
    * Parsed: Displays the JSON in a user-friendly, collapsible tree structure using the JSONViewer library.
    * Formatted Raw: Presents the raw JSON with proper indentation and spacing.
    * Raw: Shows the unformatted, original JSON content.
* **Themes:** Allows users to switch between light and dark modes for a comfortable viewing experience.
* **User Preferences:** Stores user-selected theme and formatting preferences for persistence across sessions.

**File Structure:**

* `manifest.json`: The core configuration file for the Chrome extension, defining its name, version, permissions, and other essential details.
* `popup.html`: The HTML structure for the toolbar interface, containing the buttons for controlling formatting and themes.
* `content.js`: The main JavaScript file that handles the core logic of the extension, including JSON extraction, formatting, theme application, and communication with the toolbar.
* `popup.js`: The JavaScript file associated with the toolbar, managing user interactions with the toolbar buttons and storing preferences.
* `styles.css`: The CSS file that defines the visual styles for the toolbar and the JSONViewer.

**Functionality:**

1. **Content Script Injection:** When a JSON file is opened (identified by its URL ending with `.json`), the `content.js` script is injected into the page.
2. **Initial Formatting:** The `content.js` script automatically applies the "Formatted Raw" formatting to the JSON content upon initial load.
3. **Toolbar Display:** The toolbar, defined in `popup.html`, is displayed when the extension's icon is clicked.
4. **User Interactions:** The `popup.js` script handles clicks on the toolbar buttons, sending messages to the `content.js` script to apply the requested formatting or theme.
5. **JSON Formatting:** The `content.js` script extracts the JSON content from the page, parses it, and applies the selected formatting (Parsed, Formatted Raw, or Raw).
6. **Theme Application:** The `content.js` script toggles the `dark-mode` class on the `body` element to switch between light and dark modes based on user selection.
7. **Preference Storage:** User-selected theme and formatting preferences are stored in `chrome.storage` for persistence.
8. **Preference Loading:** On initial load, the stored preferences are retrieved and applied to the active tab.

**Libraries Used:**

* JSONViewer: A JavaScript library for displaying JSON data in a user-friendly, collapsible tree structure.

**Potential Enhancements:**

* **Error Handling:** Implement more robust error handling to gracefully manage scenarios like invalid JSON input or issues with the JSONViewer library.
* **Customization:** Provide additional options for customizing the appearance of the JSONViewer (e.g., font size, color schemes).
* **Advanced Features:** Consider adding features like search functionality within the JSON content, the ability to copy formatted JSON to the clipboard, or support for other data formats (e.g., XML, YAML).

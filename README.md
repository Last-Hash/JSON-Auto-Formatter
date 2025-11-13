# JSON Auto Formatter

> A modern, feature-rich Chrome extension for viewing and editing JSON files.

## Project Overview

This project is a complete rebuild of the JSON Auto Formatter extension, offering a superior developer experience and enhanced features based on competitive analysis of top JSON formatter extensions.

### Key Features

#### Core Functionality
- **Auto-Detection & Formatting** - Automatically formats JSON files on page load
- **Multiple View Modes:**
  - **Tree View** - Collapsible/expandable node structure with syntax highlighting
  - **Code View** - Editable formatted JSON with live validation
  - **Raw View** - Original unformatted content
- **Themes** - Dark/Light mode with multiple preset color schemes
- **Persistent Preferences** - Saves user settings across sessions

#### Enhanced Features
- **JSON Validation** - Real-time validation with detailed error messages
- **Search & Filter** - Find keys, values, or paths within JSON
- **Advanced Copy Operations:**
  - Copy formatted JSON
  - Copy object path (e.g., `data.users[0].name`)
  - Copy specific values or keys
  - Copy inner/outer JSON
- **Live Editing** - Edit JSON with real-time validation
- **Keyboard Shortcuts:**
  - Expand/collapse all nodes
  - Ctrl/Cmd + Click to collapse siblings
  - Quick search
- **Auto-Linkify** - Converts URLs in JSON to clickable links
- **Statistics Display** - Shows node count, depth, and file size
- **Line Numbers** - Optional line numbers in code view

#### Advanced Features
- **Encoding Tools:**
  - Base64 encode/decode
  - URL encode/decode
  - Unicode transcoding
- **Download** - Export formatted JSON
- **Local File Support** - Works with `file://` protocol
- **Context Menu Integration** - Right-click to format selected text
- **State Persistence** - Remembers expanded nodes on refresh
- **JSONP Support** - Handles JSONP format
- **BigInt/BigFloat** - Supports large numbers
- **Multiple MIME Types** - Detects various JSON content types
- **Drag & Drop** - Reorder nodes in editor mode (future)

#### Modern UX
- **Modern UI** - Built with Tailwind CSS and shadcn/ui components
- **Smooth Animations** - Polished transitions and interactions
- **Tooltips** - Helpful hints for all actions
- **Settings Panel** - Comprehensive configuration options
- **Notification System** - User-friendly error and success messages
- **Performance Metrics** - Minimal impact on non-JSON pages (<1ms)
- **Onboarding** - Welcome screen for new users

---

## Technology Stack

- **Language:** TypeScript
- **UI:** React + Tailwind CSS + shadcn/ui
- **State Management:** Zustand
- **JSON Parsing:** Custom parser with validation
- **Build Tool:** Vite + vite-plugin-web-extension
- **Package Manager:** npm

---

## Project Structure

```
json-formatter/
├── src/
│   ├── background/           # Background service worker
│   ├── content/              # Content scripts
│   │   └── index.tsx
│   ├── popup/                # Extension popup UI
│   │   └── index.tsx
│   ├── components/           # Reusable React components
│   │   ├── JsonTree.tsx
│   │   ├── JsonEditor.tsx
│   │   └── ThemeToggle.tsx
│   ├── lib/                  # Utilities and helpers
│   │   ├── json-parser.ts
│   │   ├── storage.ts
│   │   └── utils.ts
│   ├── hooks/                # Custom React hooks
│   │   └── useTheme.ts
│   ├── stores/               # Zustand stores
│   │   └── settingsStore.ts
│   └── styles/               # Global styles
├── icons/                    # Extension icons
├── build/
│   ├── development/          # Dev build output
│   └── production/           # Production build output
├── package.json
├── tsconfig.json
└── README.md
```

---

## Competitive Analysis

Based on research of top JSON formatter extensions:

| Extension | Users | Rating | Key Strengths |
|-----------|-------|--------|---------------|
| **JSON Formatter** | 2M | 4.6 | Fast, auto-linkify, DevTools export |
| **JSONVue** | 900K | 4.5 | Validation, JSONP, customizable |
| **JSON Beautifier & Editor** | 30K | 4.8 | Editing, path copy, local files |
| **JSON-handle** | 100K | 4.8 | Encoding tools, multilingual |

**Our Advantage:** Combines the best features of all competitors with modern tech stack and superior UX.

---

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm

### Installation

```bash
# Install dependencies
npm install

# Development mode with hot reload
npm run dev

# Build for production
npm run build
```

### Loading in Chrome

1. Run `npm run dev` for development or `npm run build` for production
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `build/development/` or `build/production/` directory

---

## Usage

1. **Automatic Formatting:** Open any `.json` file in your browser - it will auto-format
2. **View Modes:** Use toolbar buttons to switch between Tree, Code, and Raw views
3. **Search:** Press `Ctrl/Cmd + F` to search within JSON
4. **Copy:** Right-click any node to copy path, value, or formatted JSON
5. **Edit:** Switch to Code view to edit JSON with live validation
6. **Theme:** Toggle dark/light mode or choose from preset themes
7. **Settings:** Click extension icon to access settings and preferences

---

## Development Roadmap

### Phase 1: Core Features - COMPLETED
- [x] Project setup with modern build tools
- [x] Basic JSON detection and parsing
- [x] Tree view with collapsible nodes
- [x] Syntax highlighting
- [x] Dark/light themes

### Phase 2: Enhanced Features (In Progress)
- [ ] Search and filter functionality
- [ ] Copy operations (path, value, formatted)
- [ ] Live editing with validation
- [ ] Keyboard shortcuts
- [ ] Auto-linkify URLs

### Phase 3: Advanced Features
- [ ] Encoding tools (Base64, URL, Unicode)
- [ ] Download formatted JSON
- [ ] Context menu integration
- [ ] Local file support
- [ ] JSONP handling

### Phase 4: Polish & UX
- [ ] Modern UI with Tailwind + shadcn/ui
- [ ] Settings panel
- [ ] Onboarding experience
- [ ] Performance optimization
- [ ] Comprehensive documentation

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

MIT License - See LICENSE file for details

---

## Acknowledgments

- Original JSON Auto Formatter concept
- Inspiration from JSON Formatter, JSONVue, JSON Beautifier, and JSON-handle
- Open source community

---

## Contact

**Developer:** ProgrammerNomad  
**Repository:** [JSON-Auto-Formatter](https://github.com/ProgrammerNomad/JSON-Auto-Formatter)  
**Issues:** [Report bugs or request features](https://github.com/ProgrammerNomad/JSON-Auto-Formatter/issues)

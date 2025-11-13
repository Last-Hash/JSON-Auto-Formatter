import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import webExtension from 'vite-plugin-web-extension'
import path from 'path'

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  },
  plugins: [
    react(),
    webExtension({
      manifest: () => ({
        manifest_version: 3,
        name: 'JSON Auto Formatter',
        version: '2.0.0',
        description: 'Modern JSON formatter with advanced features, themes, and editing capabilities',
        permissions: ['activeTab', 'storage', 'contextMenus'],
        action: {
          default_popup: 'src/popup/index.html',
          default_icon: {
            16: 'icon16.png',
            32: 'icon32.png',
            48: 'icon48.png',
            128: 'icon128.png'
          }
        },
        icons: {
          16: 'icon16.png',
          32: 'icon32.png',
          48: 'icon48.png',
          128: 'icon128.png'
        },
        content_scripts: [
          {
            matches: ['<all_urls>'],
            js: ['src/content/index.tsx'],
            run_at: 'document_end'
          }
        ],
        background: {
          service_worker: 'src/background/index.ts',
          type: 'module'
        },
        web_accessible_resources: [
          {
            resources: ['src/content/styles.css'],
            matches: ['<all_urls>']
          }
        ]
      })
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: process.env.NODE_ENV === 'production' ? 'build/production' : 'build/development',
    rollupOptions: {
      input: {
        popup: 'src/popup/index.html'
      }
    }
  },
  publicDir: 'icons'
})

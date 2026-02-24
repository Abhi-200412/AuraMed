import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/globals.css'

console.log('[DEBUG] main.tsx loaded')

const root = document.getElementById('root')
console.log('[DEBUG] root element:', root)

if (root) {
  console.log('[DEBUG] Creating React root and rendering App')
  try {
    createRoot(root).render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>,
    )
    console.log('[DEBUG] React rendering complete')
  } catch (err) {
    console.error('[ERROR] React rendering failed:', err)
  }
} else {
  console.error('[ERROR] Could not find root element in DOM')
}

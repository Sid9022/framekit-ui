import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Legacy hash links (`/#/docs/<slug>`) from before clean URLs: rewrite them to the real path
// before the router reads the location, so old shared links keep working.
if (window.location.hash.startsWith('#/')) {
  window.history.replaceState(window.history.state, '', window.location.hash.slice(1) || '/')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

// A tab left open across a deploy can ask for a lazy chunk that no longer exists: reload once to pick up the new build.
window.addEventListener('vite:preloadError', () => {
  if (sessionStorage.getItem('fk-reloaded')) return
  sessionStorage.setItem('fk-reloaded', '1')
  window.location.reload()
})

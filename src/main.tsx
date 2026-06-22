import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Dev from './Dev.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Dev />
  </StrictMode>,
)

<<<<<<< HEAD
const originalWarn = console.warn;
console.warn = (...args) => {
	if (typeof args[0] === 'string' && args[0].includes('THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.')) {
		return;
	}
	originalWarn(...args);
};

=======
>>>>>>> origin/int/KAN-36-website-db
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
<<<<<<< HEAD

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>,
=======
import Dev from './Dev.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Dev />
  </StrictMode>,
>>>>>>> origin/int/KAN-36-website-db
)

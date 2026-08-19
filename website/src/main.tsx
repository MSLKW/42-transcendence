const originalWarn = console.warn;
console.warn = (...args) => {
	if (typeof args[0] === 'string' && args[0].includes('THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.')) {
		return;
	}
	originalWarn(...args);
};

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import Dev from './Dev.tsx'
// import { showDevSection } from './store/DevStore'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
		{/* { showDevSection && <Dev /> } */}
	</StrictMode>,
)

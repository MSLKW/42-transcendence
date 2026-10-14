import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>,
)

if (import.meta.hot) {
	import.meta.hot.on('vite:beforeUpdate', () => {
		window.location.reload();
	});
}


// TODO (signal handler): uncomment this when need to implement the signal handler
// // Graceful shutdown on Ctrl+C / `docker compose down` & `docker compose stop` (both stop containers the same way). 
// // Stop taking new requests, close the DB
// // pool cleanly, then exit, well inside Docker's 10s SIGKILL deadline.
// function shutdown() {
//   server.close();					// 1. stop accepting new work
//   									// 2. service-specific cleanup
//   									// 3. close DB pool (DB services only, this website service no need)
//   process.exit(0);					// 4. end the process, exit code 0 = clean shutdown
// }
// process.on('SIGINT', shutdown);		// Ctrl+C
// process.on('SIGTERM', shutdown);	// `docker compose down` & `docker compose stop` (both stop containers the same way)

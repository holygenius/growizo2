import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'
import { initAnalytics } from './analytics'

// Initialize analytics (gtag) when VITE_GTAG_ID is set in env
initAnalytics();

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <HelmetProvider>
            <App />
        </HelmetProvider>
    </StrictMode>,
)

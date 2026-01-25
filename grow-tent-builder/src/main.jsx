import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './styles/globals.css'
import App from './App.jsx'
import { initAnalytics } from './analytics'
import UpdatePrompt from './components/UpdatePrompt'
import { registerSW } from 'virtual:pwa-register'

// Initialize analytics (gtag) when VITE_GTAG_ID is set in env
initAnalytics();

// Mutable ref to hold the update callback - set once and used by service worker
const updateCallbackRef = { current: null };

const updateSW = registerSW({
    onNeedRefresh() {
        // Trigger the update prompt
        if (updateCallbackRef.current) {
            updateCallbackRef.current();
        }
    },
    onOfflineReady() {
        console.log('✅ App ready to work offline');
    },
    onRegistered(registration) {
        console.log('✅ Service Worker registered');
        // Check for updates every hour
        if (registration) {
            setInterval(() => {
                registration.update();
            }, 60 * 60 * 1000); // Check every hour
        }
    },
    onRegisterError(error) {
        console.error('❌ Service Worker registration error:', error);
    },
    // Immediately reload when new content is available and user confirms (or auto-update is set)
    immediate: true
});

// Root component with update prompt
function Root() {
    const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

    // Set callback using useEffect to avoid side effects during render
    useEffect(() => {
        updateCallbackRef.current = () => setShowUpdatePrompt(true);
        return () => {
            updateCallbackRef.current = null;
        };
    }, []);

    return (
        <StrictMode>
            <HelmetProvider>
                <App />
                {showUpdatePrompt && <UpdatePrompt updateSW={updateSW} />}
            </HelmetProvider>
        </StrictMode>
    );
}

createRoot(document.getElementById('root')).render(<Root />)

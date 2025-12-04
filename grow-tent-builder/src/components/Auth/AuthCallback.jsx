/**
 * Auth Callback Component
 * Handles OAuth redirect from Supabase
 */

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import supabase, { isSupabaseConfigured } from '../../services/supabase';
import { useSettings } from '../../context/SettingsContext';

export default function AuthCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const { language } = useSettings();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            if (!isSupabaseConfigured()) {
                setError('Auth not configured');
                return;
            }

            try {
                // Check for error in URL params
                const params = new URLSearchParams(location.search);
                const hashParams = new URLSearchParams(location.hash.substring(1));
                
                const errorParam = params.get('error') || hashParams.get('error');
                const errorDescription = params.get('error_description') || hashParams.get('error_description');
                
                if (errorParam) {
                    console.error('OAuth error:', errorParam, errorDescription);
                    setError(errorDescription || errorParam);
                    return;
                }

                // Check for code in URL (PKCE flow)
                const code = params.get('code');
                
                if (code) {
                    // Exchange code for session
                    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
                    
                    if (exchangeError) {
                        console.error('Code exchange error:', exchangeError);
                        setError(exchangeError.message);
                        return;
                    }
                    
                    if (data.session) {
                        // Wait a moment for auth state to propagate
                        setTimeout(() => {
                            navigate(`/${language}`, { replace: true });
                        }, 100);
                        return;
                    }
                }

                // Fallback: Try to get existing session (implicit flow)
                const { data, error: sessionError } = await supabase.auth.getSession();
                
                if (sessionError) {
                    console.error('Session error:', sessionError);
                    setError(sessionError.message);
                    return;
                }

                // Redirect to home regardless of session state
                navigate(`/${language}`, { replace: true });
                
            } catch (err) {
                console.error('Callback error:', err);
                setError(err.message);
            }
        };

        handleCallback();
    }, [navigate, language, location]);

    if (error) {
        return (
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100vh',
                gap: '1rem'
            }}>
                <p style={{ color: 'red' }}>Authentication error: {error}</p>
                <button onClick={() => navigate(`/${language}`)}>
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh' 
        }}>
            <div style={{ textAlign: 'center' }}>
                <div className="loading-spinner" style={{ 
                    width: '40px', 
                    height: '40px', 
                    border: '3px solid var(--border-color)', 
                    borderTop: '3px solid var(--color-primary)', 
                    borderRadius: '50%', 
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 1rem'
                }}></div>
                <p>{language === 'tr' ? 'Giriş yapılıyor...' : 'Signing in...'}</p>
            </div>
        </div>
    );
}

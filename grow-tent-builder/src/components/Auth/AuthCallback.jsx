/**
 * Auth Callback Component
 * Handles OAuth redirect from Supabase
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase, { isSupabaseConfigured } from '../../services/supabase';
import { useSettings } from '../../context/SettingsContext';

export default function AuthCallback() {
    const navigate = useNavigate();
    const { language } = useSettings();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            if (!isSupabaseConfigured()) {
                setError('Auth not configured');
                return;
            }

            try {
                const { data, error } = await supabase.auth.getSession();
                
                if (error) {
                    console.error('Auth callback error:', error);
                    setError(error.message);
                    return;
                }

                if (data.session) {
                    // Successfully authenticated, redirect to home
                    navigate(`/${language}`, { replace: true });
                } else {
                    // No session, redirect to home
                    navigate(`/${language}`, { replace: true });
                }
            } catch (err) {
                console.error('Callback error:', err);
                setError(err.message);
            }
        };

        handleCallback();
    }, [navigate, language]);

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

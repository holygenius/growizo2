import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import supabase, { isSupabaseConfigured } from '../../services/supabase';
import { userService } from '../../services/userService';
import { useSettings } from '../../context/SettingsContext';

export default function AuthCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const { language, getOnboardingUrl } = useSettings();
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('Processing...');
    const isProcessing = useRef(false);

    // Check if user should see onboarding (new user without completed onboarding)
    const checkAndRedirect = async (userId) => {
        try {
            const { data, error } = await userService.getUserOnboardingStatus(userId);

            if (error) {
                console.error('Error checking user status:', error);
                return `/${language}`;
            }

            // If user exists and hasn't completed onboarding, go to onboarding
            if (data && !data.onboarding_completed) {
                return getOnboardingUrl ? getOnboardingUrl() : `/${language}/onboarding`;
            }

            // Otherwise go to home
            return `/${language}`;
        } catch (err) {
            console.error('checkAndRedirect error:', err);
            return `/${language}`;
        }
    };

    useEffect(() => {
        // Prevent multiple executions
        if (isProcessing.current) {
            console.log('⏳ Already processing, skipping...');
            return;
        }

        const handleCallback = async () => {
            // Mark as processing immediately
            isProcessing.current = true;

            console.log('🔐 AuthCallback started');
            console.log('📍 Current URL:', window.location.href);
            console.log('🔍 Search params:', location.search);
            console.log('🔍 Hash:', location.hash);

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
                    console.error('❌ OAuth error:', errorParam, errorDescription);
                    setError(errorDescription || errorParam);
                    return;
                }

                // Check for code in URL (PKCE flow)
                const code = params.get('code');
                console.log('🔑 Code from URL:', code ? 'Present' : 'Not found');

                if (code) {
                    setStatus('Exchanging code for session...');
                    console.log('🔄 Exchanging code for session...');

                    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

                    if (exchangeError) {
                        console.error('❌ Code exchange error:', exchangeError);
                        setError(exchangeError.message);
                        return;
                    }

                    console.log('✅ Session obtained:', data.session ? 'Yes' : 'No');
                    console.log('👤 User:', data.session?.user?.email);

                    if (data.session) {
                        setStatus('Success! Redirecting...');
                        const redirectUrl = await checkAndRedirect(data.session.user.id);
                        setTimeout(() => {
                            navigate(redirectUrl, { replace: true });
                        }, 500);
                        return;
                    }
                }

                // Check hash for access_token (implicit flow)
                const accessToken = hashParams.get('access_token');
                if (accessToken) {
                    console.log('🔑 Access token found in hash');
                    setStatus('Setting session from token...');

                    const refreshToken = hashParams.get('refresh_token') || '';
                    console.log('🔄 Setting session with tokens...');

                    const { data, error: sessionSetError } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken
                    });

                    if (sessionSetError) {
                        console.error('❌ Session set error:', sessionSetError);
                        setError(sessionSetError.message);
                        return;
                    }

                    if (data.session) {
                        console.log('✅ Session set from hash');
                        console.log('👤 User:', data.session.user?.email);
                        setStatus('Success! Checking account...');

                        const redirectUrl = await checkAndRedirect(data.session.user.id);
                        console.log('🚀 Redirecting to:', redirectUrl);
                        setStatus('Success! Redirecting...');

                        setTimeout(() => {
                            navigate(redirectUrl, { replace: true });
                        }, 300);
                        return;
                    } else {
                        console.error('❌ No session returned after setSession');
                        setError('Could not establish session');
                        return;
                    }
                }

                // Fallback: Try to get existing session (only if no tokens were found)
                console.log('📋 No tokens in URL, checking existing session...');
                setStatus('Checking existing session...');
                const { data, error: sessionError } = await supabase.auth.getSession();

                console.log('📋 Existing session check result:', data.session ? 'Found' : 'Not found');

                if (sessionError) {
                    console.error('❌ Session error:', sessionError);
                    setError(sessionError.message);
                    return;
                }

                if (data.session) {
                    console.log('✅ Using existing session');
                    const redirectUrl = await checkAndRedirect(data.session.user.id);
                    navigate(redirectUrl, { replace: true });
                } else {
                    console.log('⚠️ No session found, redirecting anyway');
                    navigate(`/${language}`, { replace: true });
                }

            } catch (err) {
                console.error('❌ Callback error:', err);
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
                gap: '1rem',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)'
            }}>
                <p style={{ color: '#ef4444' }}>❌ Authentication error: {error}</p>
                <button
                    onClick={() => navigate(`/${language}`)}
                    style={{
                        padding: '0.5rem 1rem',
                        background: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid var(--border-color)',
                    borderTop: '3px solid var(--color-primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 1rem'
                }}></div>
                <p>{status}</p>
            </div>
        </div>
    );
}

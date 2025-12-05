/**
 * Authentication Context
 * Provides Google OAuth via Supabase
 */

import { createContext, useContext, useState, useEffect } from 'react';
import supabase, { isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (!isSupabaseConfigured()) {
            setLoading(false);
            return;
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                checkAdminStatus(session.user.id);
            }
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                if (session?.user) {
                    checkAdminStatus(session.user.id);
                } else {
                    setIsAdmin(false);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Check if user is admin
    const checkAdminStatus = async (userId) => {
        if (!userId) {
            setIsAdmin(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('admin_users')
                .select('id')
                .eq('id', userId)
                .eq('is_active', true)
                .maybeSingle();

            setIsAdmin(!!data && !error);
        } catch (err) {
            console.error('Admin check error:', err);
            setIsAdmin(false);
        }
    };

    // Sign in with Google
    const signInWithGoogle = async () => {
        if (!isSupabaseConfigured()) {
            console.error('Supabase is not configured');
            return { error: { message: 'Auth not configured' } };
        }

        // Use current origin for redirect (works for both localhost and production)
        const redirectUrl = `${window.location.origin}/auth/callback`;

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                }
            }
        });

        return { data, error };
    };

    // Sign out
    const signOut = async () => {
        if (!isSupabaseConfigured()) return;

        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Sign out error:', error);
        }
        setUser(null);
        setSession(null);
        setIsAdmin(false);
    };

    const value = {
        user,
        session,
        loading,
        isAdmin,
        isAuthenticated: !!user,
        signInWithGoogle,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;

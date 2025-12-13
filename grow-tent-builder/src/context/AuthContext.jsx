/**
 * Authentication Context
 * Provides Google OAuth via Supabase
 * Uses userService for database operations
 */

import { createContext, useContext, useState, useEffect } from 'react';
import supabase, { isSupabaseConfigured } from '../services/supabase';
import { userService } from '../services/userService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);

    // Check if user is new (first time login) - uses userService
    const checkIfNewUser = async (userId) => {
        const result = await userService.isNewUser(userId);
        return result;
    };

    // Mark onboarding as completed - uses userService
    const completeUserOnboarding = async (onboardingData = {}) => {
        if (!user?.id) return;

        const { success } = await userService.completeOnboarding(user.id, onboardingData);
        if (success) {
            setIsNewUser(false);
        }
    };

    // Log admin access - uses userService
    const logAdminAccess = async (action, metadata = {}) => {
        if (!user?.id) return;
        await userService.logAdminAccess(user.id, user.email, action, metadata);
    };

    // Check admin status - uses userService
    const checkAdminStatus = async (userId) => {
        const result = await userService.checkAdminStatus(userId);
        setIsAdmin(result);
    };

    useEffect(() => {
        if (!isSupabaseConfigured()) {
            setLoading(false);
            return;
        }

        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await checkAdminStatus(session.user.id);
                // Also check if user needs onboarding on initial load
                const isNew = await checkIfNewUser(session.user.id);
                console.log('🔐 DEBUG [AuthContext]: Initial session - isNewUser =', isNew);
                setIsNewUser(isNew);
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

                    // Check if this is a new user on SIGNED_IN event
                    if (event === 'SIGNED_IN') {
                        const isNew = await checkIfNewUser(session.user.id);
                        console.log('🔐 DEBUG [AuthContext]: isNewUser =', isNew);
                        setIsNewUser(isNew);
                    }
                } else {
                    setIsAdmin(false);
                    setIsNewUser(false);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Sign in with Google
    const signInWithGoogle = async () => {
        if (!isSupabaseConfigured()) {
            console.error('Supabase is not configured');
            return { error: { message: 'Auth not configured' } };
        }

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
        isNewUser,
        isAuthenticated: !!user,
        signInWithGoogle,
        signOut,
        completeUserOnboarding,
        logAdminAccess,
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

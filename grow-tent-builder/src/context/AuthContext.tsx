/**
 * Authentication Context
 * Provides Google OAuth via Supabase
 * Uses userService for database operations
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import supabase, { isSupabaseConfigured } from '../services/supabase';
import { userService } from '../services/userService';
import type { User, Session } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isNewUser: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<{ data: unknown; error: { message: string } | null }>;
  signOut: () => Promise<void>;
  completeUserOnboarding: (onboardingData?: Record<string, unknown>) => Promise<void>;
  logAdminAccess: (action: string, metadata?: Record<string, unknown>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  // Check if user is new (first time login) - uses userService
  const checkIfNewUser = async (userId: string): Promise<boolean> => {
    const result = await userService.isNewUser(userId);
    return result;
  };

  // Mark onboarding as completed - uses userService
  const completeUserOnboarding = async (onboardingData: Record<string, unknown> = {}): Promise<void> => {
    if (!user?.id) return;

    const { success } = await userService.completeOnboarding(user.id, onboardingData);
    if (success) {
      setIsNewUser(false);
    }
  };

  // Log admin access - uses userService
  const logAdminAccess = async (action: string, metadata: Record<string, unknown> = {}): Promise<void> => {
    if (!user?.id) return;
    await userService.logAdminAccess(user.id, user.email || '', action, metadata);
  };

  // Check admin status - uses userService
  // keepCurrentOnTimeout: if true, keeps current isAdmin state on timeout (for token refresh scenarios)
  const checkAdminStatus = async (userId: string, keepCurrentOnTimeout = false): Promise<void> => {
    const result = await userService.checkAdminStatus(userId);
    // If result is null/undefined (timeout), optionally keep current state
    if (result === null && keepCurrentOnTimeout) {
      console.log('🔐 DEBUG [AuthContext]: Admin check timed out, keeping current state');
      return;
    }
    setIsAdmin(result ?? false);
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Track if initial admin check has been done
    let initialCheckDone = false;

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session as Session | null);
      setUser(session?.user ?? null);
      if (session?.user) {
        await checkAdminStatus(session.user.id, false);
        initialCheckDone = true;
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
        setSession(session as Session | null);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Skip admin re-check on TOKEN_REFRESHED to avoid unnecessary DB calls
          // that might timeout and cause logout
          if (event === 'TOKEN_REFRESHED') {
            console.log('🔐 DEBUG [AuthContext]: Token refreshed, skipping admin re-check');
            return;
          }

          // For SIGNED_IN, do a fresh check. For other events, keep current state on timeout.
          const keepOnTimeout = event !== 'SIGNED_IN' && initialCheckDone;
          checkAdminStatus(session.user.id, keepOnTimeout);

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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with Google
  const signInWithGoogle = async (): Promise<{ data: unknown; error: { message: string } | null }> => {
    if (!isSupabaseConfigured()) {
      console.error('Supabase is not configured');
      return { data: null, error: { message: 'Auth not configured' } };
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

    return { data, error: error ? { message: error.message } : null };
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    if (!isSupabaseConfigured()) return;

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
    }
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  const value: AuthContextType = {
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

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

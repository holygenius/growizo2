// Auth State Types

export interface User {
  id: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  full_name?: string;
  avatar_url?: string;
  is_admin?: boolean;
  has_completed_onboarding?: boolean;
}

export interface Session {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  user: User;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isNewUser: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextValue extends AuthState {
  signInWithGoogle: () => Promise<{ data: unknown; error: { message: string } | null }>;
  signOut: () => Promise<void>;
  completeUserOnboarding: (onboardingData?: Record<string, unknown>) => Promise<void>;
  logAdminAccess: (action: string, metadata?: Record<string, unknown>) => Promise<void>;
}

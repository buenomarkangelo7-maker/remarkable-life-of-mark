import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  authError: string | null;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function checkAdminWhitelist(user: User | null): Promise<{ allowed: boolean; reason?: string }> {
  if (!user || !supabase) {
    return { allowed: false };
  }
  const { data, error } = await supabase
    .from('admin_users')
    .select('email')
    .ilike('email', user.email ?? '')
    .maybeSingle();

  if (error) {
    return {
      allowed: false,
      reason:
        'Could not verify administrator privileges against public.admin_users. Ensure supabase/schema.sql was executed in your Supabase project.',
    };
  }
  if (!data) {
    return {
      allowed: false,
      reason: `Signed-in account (${user.email}) is not authorized in public.admin_users.`,
    };
  }
  return { allowed: true };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [authError, setAuthError] = useState<string | null>(null);

  const hydrateSession = useCallback(async (nextSession: Session | null) => {
    if (!nextSession?.user || !supabase) {
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const check = await checkAdminWhitelist(nextSession.user);
    if (!check.allowed) {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      setAuthError(check.reason ?? 'Administrator verification failed.');
      setLoading(false);
      return;
    }

    setSession(nextSession);
    setUser(nextSession.user);
    setIsAdmin(true);
    setAuthError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        void hydrateSession(data.session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        void hydrateSession(nextSession);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [hydrateSession]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(
        'Supabase is not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment first.'
      );
    }
    setAuthError(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      throw new Error('Please enter both your administrator email and password.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (error) {
      throw new Error(
        error.message === 'Invalid login credentials'
          ? 'Incorrect email or password. Please verify your Supabase administrator credentials.'
          : error.message
      );
    }

    const check = await checkAdminWhitelist(data.user);
    if (!check.allowed) {
      await supabase.auth.signOut();
      throw new Error(
        check.reason ?? 'This account does not have administrator permissions.'
      );
    }

    setSession(data.session);
    setUser(data.user);
    setIsAdmin(true);
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setUser(null);
    setIsAdmin(false);
    setAuthError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        authError,
        isConfigured: isSupabaseConfigured,
        signIn,
        signOut,
        clearError: () => setAuthError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}

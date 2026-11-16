import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DEFAULT_BUNDLE } from '../data/defaultSeed';
import { fetchAutobiographyBundle } from '../lib/autobiographyService';
import type { AutobiographyBundle } from '../types/autobiography';
import { useAuth } from './AuthContext';

interface ContentContextValue {
  bundle: AutobiographyBundle;
  loading: boolean;
  error: string | null;
  schemaMissing: boolean;
  refresh: (adminMode?: boolean) => Promise<void>;
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading: authLoading } = useAuth();
  const [bundle, setBundle] = useState<AutobiographyBundle>(DEFAULT_BUNDLE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schemaMissing, setSchemaMissing] = useState(false);

  const refresh = useCallback(
    async (forceAdminMode?: boolean) => {
      try {
        setError(null);
        const data = await fetchAutobiographyBundle(forceAdminMode ?? isAdmin);
        setBundle(data);
        setSchemaMissing(false);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Unable to load autobiography content.';
        setSchemaMissing(message.includes('SUPABASE_TABLES_MISSING'));
        setError(message.replace('SUPABASE_TABLES_MISSING: ', ''));
      } finally {
        setLoading(false);
      }
    },
    [isAdmin]
  );

  useEffect(() => {
    if (!authLoading) {
      void refresh(isAdmin);
    }
  }, [authLoading, isAdmin, refresh]);

  return (
    <ContentContext.Provider value={{ bundle, loading, error, schemaMissing, refresh }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useContent must be used inside ContentProvider');
  }
  return ctx;
}

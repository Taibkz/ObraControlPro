'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

// Fallback por defecto para asegurar que siempre haya conexion y evitar fallos si el build en Vercel no inyecto la variable a tiempo
const FALLBACK_SUPABASE_URL = 'https://tbrwyxuqciyhkrroizgi.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'sb_publishable_Uc93RF40JHItaQ4WX9Alxw_e80zXPwh';

function getClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  try {
    return createClient(url, key);
  } catch (e) {
    console.error('Error instanciando Supabase:', e);
    return null;
  }
}

const supabase = getClient();

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  supabaseReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const supabaseReady = Boolean(supabase);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    }).catch(err => {
      console.error('Error al obtener sesion:', err);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!supabase) return { error: 'Supabase no esta configurado.' };
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return { error: null };
    } catch (e: any) {
      return { error: e?.message || 'Error inesperado al conectar con Supabase.' };
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Error en signOut:', e);
    }
  };

  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    if (!supabase) return { error: 'Supabase no esta configurado.' };
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined,
      });
      if (error) return { error: error.message };
      return { error: null };
    } catch (e: any) {
      return { error: e?.message || 'Error al solicitar restauracion de contrasena.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, signIn, signOut, resetPassword, supabaseReady }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
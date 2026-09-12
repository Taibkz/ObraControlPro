'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HardHat, RefreshCw, Plus, Database, Check, X, Settings2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getSupabaseConfig, DEFAULT_PUBLISHABLE_KEY } from '@/lib/supabase';

export function Navbar({ onOpenQuickLog }: { onOpenQuickLog: () => void }) {
  const pathname = usePathname();
  const { projects, resetToDemoData } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);

  // Estado de conexión Supabase
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState(DEFAULT_PUBLISHABLE_KEY);
  const [isConfigured, setIsConfigured] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const config = getSupabaseConfig();
    setSupabaseUrl(config.url);
    setSupabaseKey(config.key);
    setIsConfigured(config.isConfigured);
  }, []);

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('custom_supabase_url', supabaseUrl.trim());
      localStorage.setItem('custom_supabase_key', supabaseKey.trim());
      setIsConfigured(Boolean(supabaseUrl.trim().startsWith('http') && supabaseKey.trim()));
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setShowSupabaseModal(false);
        window.location.reload();
      }, 700);
    }
  };

  const activeProjectsCount = projects.filter(p => p.status === 'activa').length;

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <HardHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-white">ObraControl</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Pro
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Gestión de Obras, Materiales y Personal
            </p>
          </div>
        </Link>

        {/* Quick Actions & Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Supabase Status Button */}
          <button
            onClick={() => setShowSupabaseModal(true)}
            title="Estado de conexión con Supabase"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isConfigured
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isConfigured ? 'Supabase Conectado' : 'Configurar Supabase'}
            </span>
          </button>

          {/* Badge Obras Activas */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 text-xs text-slate-300 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{activeProjectsCount} {activeProjectsCount === 1 ? 'activa' : 'activas'}</span>
          </div>

          {/* Quick Fichar Button */}
          <button
            onClick={onOpenQuickLog}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm shadow-md shadow-amber-500/10 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Fichar</span>
          </button>

          {/* Reset Demo Data Button */}
          <div className="relative">
            <button
              onClick={() => setShowResetConfirm(!showResetConfirm)}
              title="Restablecer datos de prueba"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {showResetConfirm && (
              <div className="absolute right-0 mt-2 w-64 p-3 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl shadow-xl z-50 text-xs">
                <p className="font-medium mb-2">¿Restablecer a los datos iniciales de ejemplo?</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      resetToDemoData();
                      setShowResetConfirm(false);
                    }}
                    className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium"
                  >
                    Restablecer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Configuración Supabase */}
      {showSupabaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden text-slate-900">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Conexión con Supabase</h3>
                  <p className="text-[11px] text-slate-400">Base de datos en la nube</p>
                </div>
              </div>
              <button
                onClick={() => setShowSupabaseModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSupabase} className="p-5 space-y-3.5 text-xs text-slate-700">
              <div>
                <label className="block font-bold text-slate-900 uppercase mb-1">
                  Supabase Project URL *
                </label>
                <input
                  type="url"
                  value={supabaseUrl}
                  onChange={e => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Encuéntrala en Supabase &gt; Project Settings &gt; API &gt; Project URL.
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-900 uppercase mb-1">
                  Supabase Publishable / Anon Key *
                </label>
                <input
                  type="text"
                  value={supabaseKey}
                  onChange={e => setSupabaseKey(e.target.value)}
                  placeholder="sb_publishable_..."
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                ℹ️ La clave pública ya está precargada. Solo introduce la URL de tu proyecto de Supabase (ej. <code>https://xyz.supabase.co</code>) y pulsa Guardar.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSupabaseModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow flex items-center gap-1.5"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>¡Guardado!</span>
                    </>
                  ) : (
                    <span>Guardar y Conectar</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, Plus, LogOut, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

export function Navbar({ onOpenQuickLog }: { onOpenQuickLog: () => void }) {
  const { projects } = useApp();
  const { signOut, user } = useAuth();

  const activeProjectsCount = projects.filter(p => p.status === 'activa').length;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md text-white shadow-lg border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/25 border border-blue-400/30 group-hover:scale-105 transition-all">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-lg tracking-tight text-white group-hover:text-blue-200 transition-colors">
                DECOINTERIORES
              </span>
              <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                MÁLAGA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Gestión Integral de Obras & Reformas
            </p>
          </div>
        </Link>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Badge Obras Activas */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 text-xs text-slate-300 border border-slate-700/80 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium">
              <strong className="text-white font-bold">{activeProjectsCount}</strong> {activeProjectsCount === 1 ? 'obra activa' : 'obras activas'}
            </span>
          </div>

          {/* Quick Fichar Button */}
          <button
            onClick={onOpenQuickLog}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Fichar</span>
          </button>

          {/* User / Logout */}
          <button
            onClick={handleSignOut}
            title={`Cerrar sesión (${user?.email || ''})`}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl border border-transparent hover:border-slate-700 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
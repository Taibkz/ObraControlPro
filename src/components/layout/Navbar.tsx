'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HardHat, RefreshCw, Plus } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Navbar({ onOpenQuickLog }: { onOpenQuickLog: () => void }) {
  const pathname = usePathname();
  const { projects, resetToDemoData } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

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
          {/* Badge Obras Activas */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 text-xs text-slate-300 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{activeProjectsCount} {activeProjectsCount === 1 ? 'obra activa' : 'obras activas'}</span>
          </div>

          {/* Quick Fichar Button */}
          <button
            onClick={onOpenQuickLog}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm shadow-md shadow-amber-500/10 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Fichar Jornada</span>
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
    </header>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Package, Wallet, Plus } from 'lucide-react';

export function BottomNav({ onOpenQuickLog }: { onOpenQuickLog: () => void }) {
  const pathname = usePathname();

  const isRouteActive = (route: string) => {
    if (route === '/' && pathname === '/') return true;
    if (route !== '/' && pathname.startsWith(route)) return true;
    return false;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Dashboard */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
            isRouteActive('/') && pathname === '/'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-1">Inicio</span>
        </Link>

        {/* Obras */}
        <Link
          href="/obras"
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
            isRouteActive('/obras')
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span className="text-[10px] mt-1">Obras</span>
        </Link>

        {/* Botón Central Fichar */}
        <button
          onClick={onOpenQuickLog}
          className="flex flex-col items-center -mt-5 group focus:outline-none"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 group-active:scale-95 transition-transform border-4 border-slate-900">
            <Plus className="w-6 h-6 stroke-[3]" />
          </div>
          <span className="text-[10px] font-bold text-amber-400 mt-0.5">Fichar</span>
        </button>

        {/* Materiales */}
        <Link
          href="/materiales"
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
            isRouteActive('/materiales')
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] mt-1">Materiales</span>
        </Link>

        {/* Finanzas */}
        <Link
          href="/finanzas"
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
            isRouteActive('/finanzas')
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px] mt-1">Finanzas</span>
        </Link>
      </div>
    </nav>
  );
}

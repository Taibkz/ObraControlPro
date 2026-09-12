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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/90 px-3 py-2 shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Dashboard */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
            isRouteActive('/') && pathname === '/'
              ? 'text-blue-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Inicio</span>
        </Link>

        {/* Obras */}
        <Link
          href="/obras"
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
            isRouteActive('/obras')
              ? 'text-blue-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Obras</span>
        </Link>

        {/* Botón Central Fichar con branding azul */}
        <button
          onClick={onOpenQuickLog}
          className="flex flex-col items-center -mt-6 group focus:outline-none"
        >
          <div className="w-13 h-13 p-3.5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/30 group-active:scale-95 transition-transform border-4 border-slate-900">
            <Plus className="w-6 h-6 stroke-[3]" />
          </div>
          <span className="text-[10px] font-black text-blue-400 mt-1">Fichar</span>
        </button>

        {/* Materiales */}
        <Link
          href="/materiales"
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
            isRouteActive('/materiales')
              ? 'text-blue-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Materiales</span>
        </Link>

        {/* Finanzas */}
        <Link
          href="/finanzas"
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
            isRouteActive('/finanzas')
              ? 'text-blue-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Finanzas</span>
        </Link>
      </div>
    </nav>
  );
}
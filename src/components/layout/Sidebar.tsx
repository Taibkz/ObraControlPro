'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Package,
  Clock,
  Wallet,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Sidebar() {
  const pathname = usePathname();
  const { projects } = useApp();

  const activeProjectsCount = projects.filter(p => p.status === 'activa').length;

  const navItems = [
    { href: '/', label: 'Dashboard Resumen', icon: LayoutDashboard },
    { href: '/obras', label: 'Gestión de Obras', icon: Building2, badge: activeProjectsCount },
    { href: '/partes', label: 'Partes de Trabajo', icon: Clock },
    { href: '/materiales', label: 'Catálogo Materiales', icon: Package },
    { href: '/finanzas', label: 'Finanzas & Facturación', icon: Wallet },
  ];

  const isRouteActive = (route: string) => {
    if (route === '/' && pathname === '/') return true;
    if (route !== '/' && pathname.startsWith(route)) return true;
    return false;
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800/80 p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1.5">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Navegación Principal
        </p>
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isRouteActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/20 border border-blue-400/20'
                  : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-black ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Brand Footer Card */}
      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900 rounded-2xl p-3.5 border border-slate-700/60 shadow-inner">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-xs font-bold text-white tracking-wide">Málaga & Costa del Sol</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            Cálculo automático con +5% de merma, redondeo al alza y balances netos con IVA.
          </p>
        </div>
      </div>
    </aside>
  );
}
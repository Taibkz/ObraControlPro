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
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Panel de Control
        </p>
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isRouteActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    active
                      ? 'bg-slate-950/20 text-slate-950'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-semibold text-slate-200">Modo Autónomo / Jefe</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Configurado para cálculo automático de merma (+5%), redondeo superior y desglose neto/bruto.
          </p>
        </div>
      </div>
    </aside>
  );
}

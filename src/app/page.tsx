'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Wallet,
  Building2,
  Clock,
  Ruler,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Package,
  ChevronRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function DashboardPage() {
  const { projects, workLogs, getGlobalStats, getProjectStats } = useApp();
  const stats = getGlobalStats();

  const activeProjects = projects.filter(p => p.status === 'activa');
  const recentWorkLogs = workLogs.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header con Hero Branding */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-slate-800/80 relative overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-blue-400" />
              DECOINTERIORES MÁLAGA
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Panel de Control & Dirección
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium max-w-xl">
            Supervisión técnica de obras activas, rendimientos de mano de obra y balances financieros en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10">
          <Link
            href="/obras?nueva=true"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nueva Obra</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Beneficio Neto Real */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Beneficio Neto</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stats.netProfit >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {stats.netProfit.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
              {stats.netProfit >= 0 ? (
                <span className="text-emerald-600 font-bold flex items-center">
                  <ArrowUpRight className="w-3 h-3 stroke-[3]" /> Rentable
                </span>
              ) : (
                <span className="text-rose-600 font-bold flex items-center">
                  <ArrowDownRight className="w-3 h-3 stroke-[3]" /> Pérdida
                </span>
              )}
              <span>· Neto tras gastos</span>
            </p>
          </div>
        </div>

        {/* Facturación Cobrada */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cobrado (Bruto)</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {stats.totalChargedGross.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              De <strong className="text-slate-700">{stats.totalBudgetedGross.toLocaleString('es-ES', { minimumFractionDigits: 0 })} €</strong> presupuestados
            </p>
          </div>
        </div>

        {/* Costes Totales (Material + Mano Obra) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Costes Incurridos</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {stats.totalCosts.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              🧱 {stats.totalMaterialCost.toFixed(0)}€ Mat. · 👷 {stats.totalLaborCost.toFixed(0)}€ M.O.
            </p>
          </div>
        </div>

        {/* Rendimiento Jornadas */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Jornadas & Metraje</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {stats.totalHoursWorked} <span className="text-sm font-semibold text-slate-500">horas</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
              <Ruler className="w-3 h-3 text-sky-600" />
              <span>{stats.totalMetersCompleted} m² ejecutados</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Obras Activas + Actividad Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Obras Activas & Termómetro de Costes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-black text-slate-900">
                Obras Activas en Ejecución ({activeProjects.length})
              </h2>
            </div>
            <Link
              href="/obras"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              <span>Ver todas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {activeProjects.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-slate-800">No hay obras activas en este momento</h3>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                Crea una nueva obra para empezar a calcular materiales con +5% de merma y fichar horas o metros.
              </p>
              <Link
                href="/obras?nueva=true"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Primera Obra</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeProjects.map(proj => {
                const pStats = getProjectStats(proj.id);
                const budgetUsedPercent =
                  pStats.budgetedNet > 0
                    ? Math.min(100, Math.round((pStats.totalCost / pStats.budgetedNet) * 100))
                    : 0;

                const isWarning = budgetUsedPercent > 80;

                return (
                  <Link
                    key={proj.id}
                    href={`/obras/${proj.id}`}
                    className="block bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/5 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                            {proj.name}
                          </h3>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            En Curso
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Cliente: <span className="font-semibold text-slate-700">{proj.clientName}</span> · {proj.address || 'Málaga'}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-black text-slate-900">
                          {pStats.budgetedNet.toLocaleString('es-ES')} €
                        </div>
                        <span className="text-[11px] font-bold text-emerald-600">
                          +{pStats.netProfit.toLocaleString('es-ES')} € margen ({pStats.profitMarginPercent}%)
                        </span>
                      </div>
                    </div>

                    {/* Barra de progreso de costes consumidos */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <span>Costes consumidos:</span>
                          <strong className="text-slate-900 font-bold">{pStats.totalCost.toLocaleString('es-ES')} €</strong>
                          <span className="text-slate-400">({pStats.materialCost}€ mat. + {pStats.laborCost}€ m.o.)</span>
                        </span>
                        <span className={`font-bold ${isWarning ? 'text-rose-600' : 'text-slate-700'}`}>
                          {budgetUsedPercent}% del presupuesto
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            budgetUsedPercent > 90
                              ? 'bg-rose-500'
                              : budgetUsedPercent > 75
                              ? 'bg-amber-500'
                              : 'bg-blue-600'
                          }`}
                          style={{ width: `${budgetUsedPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer con info rápida de mano de obra */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-3">
                        <span>⏱️ {pStats.hoursWorked}h acumuladas</span>
                        {pStats.metersCompleted > 0 && <span>📐 {pStats.metersCompleted}m² destajo</span>}
                      </div>
                      <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Ver Dashboard 360° <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Actividad Reciente & Accesos Rápidos */}
        <div className="space-y-4">
          {/* Tarjeta de Calculadora Rápida con Blue Brand */}
          <div className="bg-gradient-to-br from-slate-900 via-navy-900 to-blue-950 rounded-3xl p-5 text-white shadow-xl border border-blue-900/40 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center font-bold">
                <Ruler className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-0.5 rounded-full">
                +5% Merma Auto
              </span>
            </div>
            <h3 className="font-extrabold text-base leading-tight text-white">Calculadora de Despiece</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed font-normal">
              Calcula los metros de placa, montantes o pasta con redondeo superior automático para evitar mermas.
            </p>
            <Link
              href="/materiales"
              className="mt-4 inline-flex items-center justify-center w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 transition-all"
            >
              Abrir Calculadora & Catálogo
            </Link>
          </div>

          {/* Últimos Partes Diarios Fichados */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Últimos Partes Fichados</span>
              </h3>
              <Link href="/partes" className="text-xs text-blue-600 hover:text-blue-700 font-bold">
                Ver todos
              </Link>
            </div>

            {recentWorkLogs.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No hay partes registrados aún</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentWorkLogs.map(log => (
                  <div key={log.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">
                        {log.workerName.split(' ')[0]} ·{' '}
                        <span className="text-slate-500 font-medium">
                          {log.workType === 'horas' ? `${log.hoursWorked} horas` : `${log.quantityMeters}m destajo`}
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[170px]">
                        {log.projectName || 'Obra'} · {log.workDate}
                      </p>
                    </div>
                    <span className="font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                      {log.totalPayout.toFixed(2)} €
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
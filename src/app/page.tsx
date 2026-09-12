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
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function DashboardPage() {
  const { projects, workLogs, getGlobalStats, getProjectStats } = useApp();
  const stats = getGlobalStats();

  const activeProjects = projects.filter(p => p.status === 'activa');
  const recentWorkLogs = workLogs.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Panel de Control
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Visión global del negocio, obras en curso y rendimiento de trabajo
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/obras?nueva=true"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Nueva Obra</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Beneficio Neto Real */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Beneficio Neto</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${stats.netProfit >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {stats.netProfit.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
              {stats.netProfit >= 0 ? (
                <span className="text-emerald-600 font-semibold flex items-center">
                  <ArrowUpRight className="w-3 h-3" /> Rentable
                </span>
              ) : (
                <span className="text-rose-600 font-semibold flex items-center">
                  <ArrowDownRight className="w-3 h-3" /> Pérdida
                </span>
              )}
              <span>· Tras materiales y nóminas</span>
            </p>
          </div>
        </div>

        {/* Facturación Cobrada */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cobrado (Bruto)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {stats.totalChargedGross.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              De {stats.totalBudgetedGross.toLocaleString('es-ES', { minimumFractionDigits: 0 })} € presupuestados
            </p>
          </div>
        </div>

        {/* Costes Totales (Material + Mano Obra) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Costes Incurridos</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
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
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Jornadas & Metraje</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {stats.totalHoursWorked} <span className="text-sm font-semibold text-slate-500">horas</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
              <Ruler className="w-3 h-3 text-purple-600" />
              <span>{stats.totalMetersCompleted} m² ejecutados a destajo</span>
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
              <Building2 className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900">
                Obras Activas en Ejecución ({activeProjects.length})
              </h2>
            </div>
            <Link
              href="/obras"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-0.5"
            >
              <span>Ver todas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {activeProjects.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-slate-600 font-medium text-sm">No hay obras activas en este momento.</p>
              <Link
                href="/obras?nueva=true"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow"
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
                    className="block bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-amber-400/80 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-600 transition-colors">
                            {proj.name}
                          </h3>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            En Curso
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Cliente: <span className="font-medium text-slate-700">{proj.clientName}</span> · {proj.address || 'Sin dirección'}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-extrabold text-slate-900">
                          {pStats.budgetedNet.toLocaleString('es-ES')} €
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-600">
                          +{pStats.netProfit.toLocaleString('es-ES')} € margen ({pStats.profitMarginPercent}%)
                        </span>
                      </div>
                    </div>

                    {/* Barra de progreso de costes consumidos */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <span>Costes consumidos:</span>
                          <strong className="text-slate-900">{pStats.totalCost.toLocaleString('es-ES')} €</strong>
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
                              : 'bg-emerald-500'
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
                      <span className="text-amber-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        Ver Dashboard 360° <ChevronRight className="w-3.5 h-3.5" />
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
          {/* Tarjeta de Calculadora Rápida */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-slate-950 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-slate-950/10 flex items-center justify-center font-bold">
                <Ruler className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-950/15 px-2 py-0.5 rounded-full">
                +5% Merma Auto
              </span>
            </div>
            <h3 className="font-extrabold text-base leading-tight">Calculadora de Obra</h3>
            <p className="text-xs text-amber-950/80 mt-1 leading-relaxed">
              Calcula los metros de placa, montantes o pasta redondeando hacia arriba para evitar desperdicios.
            </p>
            <Link
              href="/materiales"
              className="mt-3.5 inline-flex items-center justify-center w-full py-2 px-3 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow transition-all"
            >
              Abrir Calculadora & Catálogo
            </Link>
          </div>

          {/* Últimos Partes Diarios Fichados */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Últimos Partes Fichados</span>
              </h3>
              <Link href="/partes" className="text-xs text-amber-600 hover:text-amber-700 font-semibold">
                Ver todos
              </Link>
            </div>

            {recentWorkLogs.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No hay partes registrados aún</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentWorkLogs.map(log => (
                  <div key={log.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {log.workerName.split(' ')[0]} ·{' '}
                        <span className="text-slate-500 font-normal">
                          {log.workType === 'horas' ? `${log.hoursWorked} horas` : `${log.quantityMeters}m destajo`}
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[170px]">
                        {log.projectName || 'Obra'} · {log.workDate}
                      </p>
                    </div>
                    <span className="font-extrabold text-slate-900 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
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

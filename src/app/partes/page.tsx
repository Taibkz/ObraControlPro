'use client';

import React, { useState } from 'react';
import {
  Clock,
  Ruler,
  Plus,
  User,
  Building2,
  Calendar,
  Trash2,
  Wallet,
  CheckCircle2,
  Filter,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function PartesPage() {
  const { workLogs, profiles, projects, addWorkLog, deleteWorkLog } = useApp();

  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('todos');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('todos');
  const [selectedType, setSelectedType] = useState<string>('todos');

  const filteredLogs = workLogs.filter(log => {
    const matchesWorker = selectedWorkerId === 'todos' || log.workerId === selectedWorkerId;
    const matchesProject = selectedProjectId === 'todos' || log.projectId === selectedProjectId;
    const matchesType = selectedType === 'todos' || log.workType === selectedType;
    return matchesWorker && matchesProject && matchesType;
  });

  // Métricas del filtro actual
  const totalPayout = filteredLogs.reduce((sum, l) => sum + l.totalPayout, 0);
  const totalHours = filteredLogs.reduce((sum, l) => sum + (l.hoursWorked || 0), 0);
  const totalMeters = filteredLogs.reduce((sum, l) => sum + (l.quantityMeters || 0), 0);

  // Liquidación del empleado específico
  const employeeProfiles = profiles.filter(p => p.role === 'empleado');
  const selectedWorker = profiles.find(p => p.id === selectedWorkerId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Clock className="w-7 h-7 text-amber-500" />
            <span>Partes de Trabajo & Salarios</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Registro diario de horas y metros ejecutados por el jefe y los empleados
          </p>
        </div>
      </div>

      {/* KPI Cards de Mano de Obra */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Devengado</span>
            <Wallet className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900">
              {totalPayout.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedWorkerId === 'todos' ? 'Total cuadrilla' : `A liquidar a ${selectedWorker?.fullName}`}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Horas Trabajadas</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900">
              {totalHours.toFixed(1)} <span className="text-sm font-semibold text-slate-500">horas</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Cómputo por tiempo</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Metros Ejecutados</span>
            <Ruler className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900">
              {totalMeters.toFixed(1)} <span className="text-sm font-semibold text-slate-500">m² / ml</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Cómputo por destajo</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2.5 items-center">
          {/* Filtro Trabajador */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-500">Trabajador:</span>
            <select
              value={selectedWorkerId}
              onChange={e => setSelectedWorkerId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none"
            >
              <option value="todos">Todos los trabajadores</option>
              {profiles.map(p => (
                <option key={p.id} value={p.id}>{p.fullName} ({p.role})</option>
              ))}
            </select>
          </div>

          {/* Filtro Obra */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-500">Obra:</span>
            <select
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none"
            >
              <option value="todos">Todas las obras</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Filtro Modalidad */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-500">Tipo:</span>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none"
            >
              <option value="todos">Horas y Metros</option>
              <option value="horas">Solo Horas</option>
              <option value="metros">Solo Metros (Destajo)</option>
            </select>
          </div>
        </div>

        <span className="text-xs font-bold text-slate-500">
          {filteredLogs.length} {filteredLogs.length === 1 ? 'parte encontrado' : 'partes encontrados'}
        </span>
      </div>

      {/* Lista de Partes */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <Clock className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-slate-600 font-medium text-xs sm:text-sm">
              No hay partes de trabajo registrados con los filtros actuales.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map(log => {
              const isHours = log.workType === 'horas';

              return (
                <div key={log.id} className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 mt-0.5 ${
                      isHours ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
                    }`}>
                      {isHours ? <Clock className="w-5 h-5" /> : <Ruler className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900">
                          {log.workerName}
                        </h3>
                        <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                          isHours ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
                        }`}>
                          {isHours ? `${log.hoursWorked}h (@${log.hourlyRate}€/h)` : `${log.quantityMeters}m (@${log.ratePerMeter}€/m)`}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-1.5">
                        <span className="font-semibold text-slate-700">{log.projectName || 'Obra'}</span>
                        <span>· Fecha: {log.workDate}</span>
                        {!isHours && log.concept && (
                          <span className="text-sky-700 font-medium bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">
                            {log.concept}
                          </span>
                        )}
                      </p>

                      {log.notes && (
                        <p className="text-xs text-slate-400 mt-1 italic">
                          "{log.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        {log.totalPayout.toFixed(2)} €
                      </span>
                    </div>

                    <button
                      onClick={() => deleteWorkLog(log.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Eliminar parte"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

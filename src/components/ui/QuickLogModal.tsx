'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Clock, Ruler, CheckCircle2, User, Building2, Plus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { WorkType } from '@/types';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
}

export function QuickLogModal({ isOpen, onClose, defaultProjectId }: QuickLogModalProps) {
  const { projects, profiles, addWorkLog, addProfile } = useApp();

  const activeProjects = projects.filter(p => p.status === 'activa');
  const availableProjects = activeProjects.length > 0 ? activeProjects : projects;

  const [projectId, setProjectId] = useState<string>(defaultProjectId || availableProjects[0]?.id || '');
  const [workerId, setWorkerId] = useState<string>(profiles[0]?.id || 'nuevo');
  const [newWorkerName, setNewWorkerName] = useState<string>('');
  const [newWorkerRole, setNewWorkerRole] = useState<'jefe' | 'empleado'>('empleado');
  const [workDate, setWorkDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [workType, setWorkType] = useState<WorkType>('horas');

  // Por horas
  const selectedWorker = profiles.find(p => p.id === workerId);
  const [hoursWorked, setHoursWorked] = useState<number>(8);
  const [hourlyRate, setHourlyRate] = useState<number>(selectedWorker?.hourlyRate || 15);

  // Por metros
  const [concept, setConcept] = useState<string>('Tabique reforzado');
  const [quantityMeters, setQuantityMeters] = useState<number>(20);
  const [ratePerMeter, setRatePerMeter] = useState<number>(8);

  const [notes, setNotes] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  // Actualizar tarifa por defecto al cambiar trabajador
  const handleWorkerChange = (wId: string) => {
    setWorkerId(wId);
    if (wId !== 'nuevo') {
      const worker = profiles.find(p => p.id === wId);
      if (worker) {
        setHourlyRate(worker.hourlyRate);
      }
    }
  };

  const calculatedTotal =
    workType === 'horas'
      ? Number((hoursWorked * hourlyRate).toFixed(2))
      : Number((quantityMeters * ratePerMeter).toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;

    let targetWorkerId = workerId;
    let targetWorkerName = '';

    if (workerId === 'nuevo' || profiles.length === 0) {
      if (!newWorkerName.trim()) return;
      const created = addProfile({
        fullName: newWorkerName.trim(),
        role: newWorkerRole,
        hourlyRate: Number(hourlyRate),
      });
      targetWorkerId = created.id;
      targetWorkerName = created.fullName;
    } else {
      const worker = profiles.find(p => p.id === workerId);
      targetWorkerName = worker?.fullName || 'Trabajador';
    }

    addWorkLog({
      projectId,
      workerId: targetWorkerId,
      workerName: targetWorkerName,
      workDate,
      workType,
      hoursWorked: workType === 'horas' ? Number(hoursWorked) : undefined,
      hourlyRate: workType === 'horas' ? Number(hourlyRate) : undefined,
      concept: workType === 'metros' ? concept : undefined,
      quantityMeters: workType === 'metros' ? Number(quantityMeters) : undefined,
      ratePerMeter: workType === 'metros' ? Number(ratePerMeter) : undefined,
      notes: notes.trim() || undefined,
    });

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              {workType === 'horas' ? <Clock className="w-5 h-5" /> : <Ruler className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Registrar Parte de Trabajo</h3>
              <p className="text-xs text-slate-400">Fichar jornada a pie de obra</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Si no hay obras creadas */}
        {availableProjects.length === 0 ? (
          <div className="p-6 text-center space-y-4 text-xs">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700 text-sm">
              Primero debes crear una obra para poder registrar horas o metros.
            </p>
            <Link
              href="/obras?nueva=true"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Crear una Obra</span>
            </Link>
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-slate-800 text-sm">
            {/* Selector de Modo: Horas vs Metros */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setWorkType('horas')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
                  workType === 'horas'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Por Horas</span>
              </button>
              <button
                type="button"
                onClick={() => setWorkType('metros')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
                  workType === 'metros'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Ruler className="w-4 h-4" />
                <span>Por Metros (Destajo)</span>
              </button>
            </div>

            {/* Selector de Obra */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Obra
              </label>
              <div className="relative">
                <select
                  value={projectId}
                  onChange={e => setProjectId(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none appearance-none"
                >
                  {availableProjects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.status === 'activa' ? '(En curso)' : `(${p.status})`}
                    </option>
                  ))}
                </select>
                <Building2 className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Trabajador y Fecha */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Trabajador
                </label>
                {profiles.length > 0 ? (
                  <div className="relative">
                    <select
                      value={workerId}
                      onChange={e => handleWorkerChange(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:ring-2 focus:ring-amber-500 outline-none appearance-none"
                    >
                      {profiles.map(prof => (
                        <option key={prof.id} value={prof.id}>
                          {prof.fullName} ({prof.role === 'jefe' ? 'Jefe' : 'Empleado'})
                        </option>
                      ))}
                      <option value="nuevo">+ Añadir nuevo trabajador...</option>
                    </select>
                    <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={newWorkerName}
                    onChange={e => setNewWorkerName(e.target.value)}
                    placeholder="Nombre (ej. Mohsin, Karim...)"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Fecha de la Jornada
                </label>
                <input
                  type="date"
                  value={workDate}
                  onChange={e => setWorkDate(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Si está en modo nuevo trabajador */}
            {(workerId === 'nuevo' && profiles.length > 0) && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={newWorkerName}
                    onChange={e => setNewWorkerName(e.target.value)}
                    placeholder="Nombre del trabajador..."
                    required
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Rol</label>
                  <select
                    value={newWorkerRole}
                    onChange={e => setNewWorkerRole(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                  >
                    <option value="empleado">Empleado</option>
                    <option value="jefe">Jefe / Encargado</option>
                  </select>
                </div>
              </div>
            )}

            {/* Campos específicos según el tipo */}
            {workType === 'horas' ? (
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-amber-900 mb-1">
                      Horas Trabajadas
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={hoursWorked}
                      onChange={e => setHoursWorked(parseFloat(e.target.value) || 0)}
                      required
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-slate-900 font-bold text-base focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-amber-900 mb-1">
                      Precio / Hora (€)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={hourlyRate}
                      onChange={e => setHourlyRate(parseFloat(e.target.value) || 0)}
                      required
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-slate-900 font-bold text-base focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-amber-200 text-xs font-medium text-amber-900">
                  <span>Cálculo devengado:</span>
                  <span className="text-base font-extrabold text-amber-950">{calculatedTotal.toFixed(2)} €</span>
                </div>
              </div>
            ) : (
              <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-sky-900 mb-1">
                    Concepto / Partida
                  </label>
                  <input
                    type="text"
                    value={concept}
                    onChange={e => setConcept(e.target.value)}
                    placeholder="Ej. Tabique reforzado 13mm, Techo pladur..."
                    required
                    className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-sky-900 mb-1">
                      Metros Ejecutados (m / m²)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={quantityMeters}
                      onChange={e => setQuantityMeters(parseFloat(e.target.value) || 0)}
                      required
                      className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-slate-900 font-bold text-base focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-sky-900 mb-1">
                      Precio / Metro (€)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={ratePerMeter}
                      onChange={e => setRatePerMeter(parseFloat(e.target.value) || 0)}
                      required
                      className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-slate-900 font-bold text-base focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-sky-200 text-xs font-medium text-sky-900">
                  <span>Cálculo devengado:</span>
                  <span className="text-base font-extrabold text-sky-950">{calculatedTotal.toFixed(2)} €</span>
                </div>
              </div>
            )}

            {/* Notas opcionales */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Observaciones del día (Opcional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Ej. Se completó cara exterior y lana de roca..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            {/* Footer Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={successMsg}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
                  successMsg
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25'
                }`}
              >
                {successMsg ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 animate-bounce" />
                    <span>¡Jornada Registrada con Éxito!</span>
                  </>
                ) : (
                  <>
                    <span>Guardar Parte de Trabajo ({calculatedTotal.toFixed(2)} €)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

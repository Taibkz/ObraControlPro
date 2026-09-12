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

    let targetWorkerId = workerId;
    let targetWorkerName = selectedWorker?.fullName || '';

    if (workerId === 'nuevo' || profiles.length === 0) {
      if (!newWorkerName.trim()) return;
      const createdProfile = addProfile({
        fullName: newWorkerName.trim(),
        role: newWorkerRole,
        hourlyRate: workType === 'horas' ? hourlyRate : 15,
      });
      targetWorkerId = createdProfile.id;
      targetWorkerName = createdProfile.fullName;
    }

    const currentProject = projects.find(p => p.id === projectId);

    addWorkLog({
      projectId,
      projectName: currentProject?.name || 'Obra',
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
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header con gradiente azul */}
        <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/25 border border-blue-400/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Fichar Jornada de Trabajo</h3>
              <p className="text-xs text-blue-300 font-medium">Horas trabajadas o destajo por metros</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {projects.length === 0 ? (
            <div className="p-6 text-center space-y-3">
              <p className="text-sm text-slate-600">
                Aún no tienes obras creadas. Crea una obra antes de fichar.
              </p>
              <Link
                href="/obras"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Primera Obra</span>
              </Link>
            </div>
          ) : (
            <>
              {/* Selector de Modalidad */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100/80 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setWorkType('horas')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                    workType === 'horas'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Por Horas</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWorkType('metros')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                    workType === 'metros'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Ruler className="w-4 h-4" />
                  <span>Por Metros (Destajo)</span>
                </button>
              </div>

              {/* Selector de Obra */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Obra Destino
                </label>
                <div className="relative">
                  <select
                    value={projectId}
                    onChange={e => setProjectId(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-sm"
                  >
                    {availableProjects.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.status === 'activa' ? '• (En curso)' : `(${p.status})`}
                      </option>
                    ))}
                  </select>
                  <Building2 className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Trabajador y Fecha */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Operario / Personal
                  </label>
                  {profiles.length > 0 ? (
                    <div className="relative">
                      <select
                        value={workerId}
                        onChange={e => handleWorkerChange(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-sm"
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
                      placeholder="Nombre del operario..."
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Fecha de Jornada
                  </label>
                  <input
                    type="date"
                    value={workDate}
                    onChange={e => setWorkDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Si está en modo nuevo trabajador */}
              {(workerId === 'nuevo' && profiles.length > 0) && (
                <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200/80 grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={newWorkerName}
                      onChange={e => setNewWorkerName(e.target.value)}
                      placeholder="Nombre del trabajador..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Rol</label>
                    <select
                      value={newWorkerRole}
                      onChange={e => setNewWorkerRole(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="empleado">Empleado</option>
                      <option value="jefe">Jefe / Autónomo</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Campos dinámicos según modalidad */}
              {workType === 'horas' ? (
                <div className="grid grid-cols-2 gap-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Horas Realizadas
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="24"
                        value={hoursWorked}
                        onChange={e => setHoursWorked(parseFloat(e.target.value) || 0)}
                        required
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">h</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Tarifa por Hora (€/h)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={hourlyRate}
                        onChange={e => setHourlyRate(parseFloat(e.target.value) || 0)}
                        required
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">€/h</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Concepto del Trabajo Medido
                    </label>
                    <input
                      type="text"
                      value={concept}
                      onChange={e => setConcept(e.target.value)}
                      required
                      placeholder="Ej. Tabique placa 13mm, Falso techo continuo..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Metros Realizados
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          value={quantityMeters}
                          onChange={e => setQuantityMeters(parseFloat(e.target.value) || 0)}
                          required
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">m²</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Precio por Metro (€/m²)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={ratePerMeter}
                          onChange={e => setRatePerMeter(parseFloat(e.target.value) || 0)}
                          required
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">€/m²</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Resumen Total Calculado */}
              <div className="bg-gradient-to-br from-slate-900 to-navy-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Total Parte Devengado</span>
                  <p className="text-[11px] text-blue-300">
                    {workType === 'horas' ? `${hoursWorked}h x ${hourlyRate}€/h` : `${quantityMeters}m² x ${ratePerMeter}€/m²`}
                  </p>
                </div>
                <div className="text-2xl font-black text-blue-400 tracking-tight">
                  {calculatedTotal.toFixed(2)} €
                </div>
              </div>

              {/* Botón Guardar */}
              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={successMsg}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-500/25 active:scale-95 transition-all flex items-center gap-2"
                >
                  {successMsg ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>¡Jornada Registrada!</span>
                    </>
                  ) : (
                    <>
                      <span>Guardar Jornada</span>
                      <Plus className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
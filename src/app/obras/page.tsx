'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  Phone,
  MapPin,
  FileCheck,
  RotateCcw,
  X,
  Trash2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ProjectStatus } from '@/types';

function ObrasContent() {
  const { projects, addProject, completeProject, reopenProject, deleteProject, getProjectStats } = useApp();
  const searchParams = useSearchParams();
  const autoOpenNew = searchParams.get('nueva') === 'true';

  const [activeFilter, setActiveFilter] = useState<'todas' | ProjectStatus>('activa');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(autoOpenNew);

  // Formulario nueva obra
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [address, setAddress] = useState('');
  const [budgetedAmount, setBudgetedAmount] = useState<number>(10000);
  const [vatRate, setVatRate] = useState<number>(21);
  const [status, setStatus] = useState<ProjectStatus>('activa');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Confirmar finalización y eliminación
  const [confirmFinishId, setConfirmFinishId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredProjects = projects.filter(p => {
    const matchesFilter = activeFilter === 'todas' ? true : p.status === activeFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.address && p.address.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const countByStatus = {
    todas: projects.length,
    activa: projects.filter(p => p.status === 'activa').length,
    presupuesto: projects.filter(p => p.status === 'presupuesto').length,
    finalizada: projects.filter(p => p.status === 'finalizada').length,
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !clientName.trim()) return;

    addProject({
      name: name.trim(),
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim() || undefined,
      address: address.trim() || undefined,
      budgetedAmount: Number(budgetedAmount),
      vatRate: Number(vatRate),
      totalCharged: 0,
      status,
      startDate,
      notes: notes.trim() || undefined,
    });

    setIsNewModalOpen(false);
    // Reset form
    setName('');
    setClientName('');
    setClientPhone('');
    setAddress('');
    setBudgetedAmount(10000);
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-blue-600" />
            <span>Gestión de Obras</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Control integral de obras activas, presupuestadas e histórico con balances cerrados
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-amber-500/10 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Crear Nueva Obra</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-sm">
        {/* Pestañas de estado */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFilter('activa')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeFilter === 'activa'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Activas</span>
            <span className="text-xs px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
              {countByStatus.activa}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('presupuesto')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeFilter === 'presupuesto'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>En Presupuesto</span>
            <span className="text-xs px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
              {countByStatus.presupuesto}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('finalizada')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeFilter === 'finalizada'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Finalizadas</span>
            <span className="text-xs px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
              {countByStatus.finalizada}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('todas')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeFilter === 'todas'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>Todas ({countByStatus.todas})</span>
          </button>
        </div>

        {/* Buscador */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Buscar por obra o cliente..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Lista de Obras */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-600 font-medium text-sm">
            No se encontraron obras con los criterios seleccionados.
          </p>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Dar de Alta una Obra</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map(proj => {
            const stats = getProjectStats(proj.id);
            const isCompleted = proj.status === 'finalizada';
            const isBudget = proj.status === 'presupuesto';

            return (
              <div
                key={proj.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm overflow-hidden flex flex-col justify-between transition-all group"
              >
                <div className="p-5">
                  {/* Header Tarjeta */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                          {proj.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <span className="font-medium text-slate-700">{proj.clientName}</span>
                        {proj.clientPhone && (
                          <span className="flex items-center gap-1 text-slate-400">
                            · <Phone className="w-3 h-3" /> {proj.clientPhone}
                          </span>
                        )}
                      </p>
                      {proj.address && (
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-300" /> {proj.address}
                        </p>
                      )}
                    </div>

                    <span
                      className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${
                        isCompleted
                          ? 'bg-sky-100 text-sky-800'
                          : isBudget
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isCompleted ? 'Finalizada' : isBudget ? 'En Presupuesto' : 'En Curso'}
                    </span>
                  </div>

                  {/* Resumen Financiero Rápido */}
                  <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Pactado (Neto)</span>
                      <p className="text-sm font-extrabold text-slate-900">
                        {stats.budgetedNet.toLocaleString('es-ES')} €
                      </p>
                      <span className="text-[9px] text-slate-400">+{proj.vatRate}% IVA</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Coste Real</span>
                      <p className="text-sm font-extrabold text-rose-600">
                        {stats.totalCost.toLocaleString('es-ES')} €
                      </p>
                      <span className="text-[9px] text-slate-500">
                        {stats.materialCost}€ mat / {stats.laborCost}€ mo
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Margen Real</span>
                      <p className="text-sm font-extrabold text-emerald-600">
                        +{stats.netProfit.toLocaleString('es-ES')} €
                      </p>
                      <span className="text-[9px] font-bold text-emerald-700">
                        {stats.profitMarginPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Barra de progreso de presupuesto */}
                  <div className="mt-3.5">
                    <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
                      <span>Consumo de presupuesto:</span>
                      <span className="font-bold text-slate-700">
                        {stats.budgetedNet > 0
                          ? Math.round((stats.totalCost / stats.budgetedNet) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            stats.budgetedNet > 0
                              ? Math.round((stats.totalCost / stats.budgetedNet) * 100)
                              : 0
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer con Acciones */}
                <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                  {/* Botón dar por finalizada o reabrir */}
                  {isCompleted ? (
                    <button
                      onClick={() => reopenProject(proj.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                      <span>Reabrir Obra</span>
                    </button>
                  ) : (
                    <div>
                      {confirmFinishId === proj.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              completeProject(proj.id);
                              setConfirmFinishId(null);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                          >
                            Confirmar Fin
                          </button>
                          <button
                            onClick={() => setConfirmFinishId(null)}
                            className="px-2 py-1 rounded-lg bg-slate-200 text-slate-700 text-xs font-medium"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmFinishId(proj.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
                        >
                          <FileCheck className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                          <span>Dar por Finalizada</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Enlace al Dashboard 360° individual & Borrar */}
                  <div className="flex items-center gap-1.5">
                    {confirmDeleteId === proj.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            deleteProject(proj.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow"
                        >
                          ¿Borrar? Sí
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(proj.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Eliminar obra por completo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <Link
                      href={`/obras/${proj.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-transform active:scale-95"
                    >
                      <span>Ver Dashboard Obra</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Nueva Obra */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base">Crear Nueva Obra</h3>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-5 space-y-3.5 overflow-y-auto text-xs text-slate-700">
              <div>
                <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Nombre del Proyecto / Obra *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ej. Reforma Integral Calle Mayor, 14"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Nombre del Cliente *
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Teléfono Cliente
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    placeholder="600 000 000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Dirección de la Obra
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Calle, número, piso o localidad..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Presupuesto (€ Neto)
                  </label>
                  <input
                    type="number"
                    step="100"
                    min="0"
                    value={budgetedAmount}
                    onChange={e => setBudgetedAmount(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Tipo de IVA
                  </label>
                  <select
                    value={vatRate}
                    onChange={e => setVatRate(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value={21}>21% (General)</option>
                    <option value={10}>10% (Reforma viv.)</option>
                    <option value={0}>0% (Exento)</option>
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Estado Inicial
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as ProjectStatus)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="activa">🟢 Activa (En curso)</option>
                    <option value="presupuesto">🟡 Presupuesto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Notas / Observaciones
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Detalles de la obra, requerimientos especiales..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md"
                >
                  Guardar y Abrir Obra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ObrasPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 text-sm">Cargando obras...</div>}>
      <ObrasContent />
    </Suspense>
  );
}

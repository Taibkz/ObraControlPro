'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Building2,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Ruler,
  TrendingUp,
  Package,
  Plus,
  Trash2,
  Check,
  AlertTriangle,
  RotateCcw,
  FileCheck,
  Printer,
  Wallet,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { UnitType, WorkType } from '@/types';

export default function ObraDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const {
    projects,
    materials,
    projectMaterials,
    workLogs,
    transactions,
    profiles,
    completeProject,
    reopenProject,
    deleteProject,
    addProfile,
    addProjectMaterial,
    togglePurchaseProjectMaterial,
    deleteProjectMaterial,
    addWorkLog,
    deleteWorkLog,
    addTransaction,
    deleteTransaction,
    getProjectStats,
  } = useApp();

  const project = projects.find(p => p.id === projectId);
  const stats = getProjectStats(projectId);

  const [activeTab, setActiveTab] = useState<'materiales' | 'partes' | 'pagos' | 'informe'>('materiales');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Modal / Formulario añadir material con cálculo de merma
  const [isAddMatOpen, setIsAddMatOpen] = useState(false);
  const [selectedCatalogMatId, setSelectedCatalogMatId] = useState<string>('');
  const [matName, setMatName] = useState('');
  const [unitType, setUnitType] = useState<UnitType>('m2');
  const [requiredQty, setRequiredQty] = useState<number>(38);
  const [wastePct, setWastePct] = useState<number>(5.0);
  const [coveragePerUnit, setCoveragePerUnit] = useState<number>(3.0);
  const [unitCost, setUnitCost] = useState<number>(8.50);

  // Modal / Formulario añadir parte de trabajo a esta obra
  const [isAddWorkOpen, setIsAddWorkOpen] = useState(false);
  const [workerId, setWorkerId] = useState<string>(profiles[0]?.id || 'nuevo');
  const [newWorkerName, setNewWorkerName] = useState<string>('');
  const [newWorkerRole, setNewWorkerRole] = useState<'jefe' | 'empleado'>('empleado');
  const [workDate, setWorkDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [workType, setWorkType] = useState<WorkType>('horas');
  const [hoursWorked, setHoursWorked] = useState<number>(8);
  const [hourlyRate, setHourlyRate] = useState<number>(15);
  const [concept, setConcept] = useState<string>('Tabique reforzado');
  const [quantityMeters, setQuantityMeters] = useState<number>(20);
  const [ratePerMeter, setRatePerMeter] = useState<number>(8);
  const [workNotes, setWorkNotes] = useState<string>('');

  // Modal / Formulario registrar cobro de cliente
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [paymentConcept, setPaymentConcept] = useState('Certificación de avance de obra');
  const [paymentAmountNet, setPaymentAmountNet] = useState<number>(2000);
  const [paymentVatRate, setPaymentVatRate] = useState<number>(project?.vatRate || 21);

  const handleDeleteProject = () => {
    deleteProject(projectId);
    router.push('/obras');
  };

  if (!project) {
    return (
      <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Obra no encontrada</h2>
        <p className="text-sm text-slate-500">La obra solicitada no existe o ha sido eliminada.</p>
        <Link
          href="/obras"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a Obras
        </Link>
      </div>
    );
  }

  // Sincronizar campos al elegir del catálogo
  const handleSelectCatalogMaterial = (matId: string) => {
    setSelectedCatalogMatId(matId);
    const m = materials.find(x => x.id === matId);
    if (m) {
      setMatName(m.name);
      setUnitType(m.unitType);
      setCoveragePerUnit(m.coveragePerUnit || 1);
      setUnitCost(m.unitCost);
      setWastePct(m.defaultWastePercentage || 5);
    }
  };

  // Cálculos en vivo para el modal de materiales
  const previewQtyWithWaste = Number((requiredQty * (1 + wastePct / 100)).toFixed(2));
  const previewCalculatedUnits = Math.ceil(previewQtyWithWaste / (coveragePerUnit || 1));
  const previewTotalCost = Number((previewCalculatedUnits * unitCost).toFixed(2));

  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matName.trim()) return;
    addProjectMaterial({
      projectId,
      materialId: selectedCatalogMatId || undefined,
      materialName: matName.trim(),
      unitType,
      requiredQuantity: Number(requiredQty),
      wastePercentage: Number(wastePct),
      coveragePerUnit: Number(coveragePerUnit),
      unitCost: Number(unitCost),
      isPurchased: false,
    });
    setIsAddMatOpen(false);
  };

  const handleSaveWorkLog = (e: React.FormEvent) => {
    e.preventDefault();
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
      notes: workNotes.trim() || undefined,
    });
    setIsAddWorkOpen(false);
    setWorkNotes('');
    setNewWorkerName('');
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction({
      projectId,
      type: 'ingreso',
      category: 'pago_cliente',
      concept: paymentConcept,
      netAmount: Number(paymentAmountNet),
      vatRate: Number(paymentVatRate),
      paymentDate: new Date().toISOString().split('T')[0],
    });
    setIsAddPaymentOpen(false);
  };

  const obraMaterials = projectMaterials.filter(pm => pm.projectId === projectId);
  const obraWorkLogs = workLogs.filter(wl => wl.projectId === projectId);
  const obraTransactions = transactions.filter(t => t.projectId === projectId);

  const isFinished = project.status === 'finalizada';

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Status Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/obras"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al listado de obras</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {project.name}
            </h1>
            <span
              className={`text-xs uppercase font-bold px-3 py-1 rounded-full ${
                isFinished
                  ? 'bg-sky-100 text-sky-800 border border-sky-200'
                  : project.status === 'presupuesto'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {isFinished ? '🏁 Obra Finalizada' : project.status === 'presupuesto' ? '🟡 En Presupuesto' : '🟢 Obra Activa'}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Cliente: <span className="font-bold text-slate-700">{project.clientName}</span>
            {project.clientPhone && ` · Tel: ${project.clientPhone}`}
            {project.address && ` · ${project.address}`}
          </p>
        </div>

        {/* Action Button: Finalizar Obra / Eliminar */}
        <div className="flex items-center gap-2">
          {isFinished ? (
            <button
              onClick={() => reopenProject(project.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs shadow-sm transition-all"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Reabrir</span>
            </button>
          ) : (
            <button
              onClick={() => completeProject(project.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <FileCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Dar por Finalizada</span>
            </button>
          )}

          {/* Botón Eliminar Obra */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs shadow-sm transition-all"
            title="Eliminar obra por completo"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span className="hidden sm:inline">Eliminar</span>
          </button>

          <button
            onClick={() => window.print()}
            title="Imprimir / Exportar Resumen"
            className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DASHBOARD 360° - KPI CARDS DE LA OBRA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Presupuesto Pactado */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
            Presupuesto Pactado
          </span>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {stats.budgetedNet.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Total con IVA: <strong className="text-slate-700">{stats.budgetedGross.toLocaleString('es-ES')} €</strong> ({project.vatRate}%)
            </p>
          </div>
        </div>

        {/* Total Cobrado al Cliente */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
              Cobrado / Pagos
            </span>
            <button
              onClick={() => setIsAddPaymentOpen(true)}
              className="text-[10px] font-bold text-amber-600 hover:underline flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" /> Pago
            </button>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {project.totalCharged.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Pendiente: <strong className="text-amber-600">{Math.max(0, stats.budgetedGross - project.totalCharged).toLocaleString('es-ES')} €</strong>
            </p>
          </div>
        </div>

        {/* Coste Total Incurrido */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
            Costes Incurridos (Neto)
          </span>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-rose-600">
              {stats.totalCost.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              🧱 {stats.materialCost}€ mat. · 👷 {stats.laborCost}€ m.o.
            </p>
          </div>
        </div>

        {/* Margen / Beneficio Real */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
            Beneficio Real Limpio
          </span>
          <div className="mt-2">
            <div className={`text-xl sm:text-2xl font-black ${stats.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {stats.netProfit >= 0 ? '+' : ''}{stats.netProfit.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
            <p className="text-[11px] font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{stats.profitMarginPercent}% de margen neto</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs de Detalle de la Obra */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Navigation Bar de la Obra */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/70 p-1.5 gap-1">
          <button
            onClick={() => setActiveTab('materiales')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'materiales'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4 text-amber-500" />
            <span>Materiales & Merma (+5%)</span>
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
              {obraMaterials.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('partes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'partes'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4 text-purple-500" />
            <span>Mano de Obra (Horas/Metros)</span>
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
              {obraWorkLogs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pagos')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'pagos'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wallet className="w-4 h-4 text-emerald-500" />
            <span>Cobros & Gastos de Obra</span>
          </button>

          <button
            onClick={() => setActiveTab('informe')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'informe'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-4 h-4 text-sky-500" />
            <span>Resumen 360° / Cierre</span>
          </button>
        </div>

        {/* Tab 1: Materiales con Merma y Redondeo */}
        {activeTab === 'materiales' && (
          <div className="p-4 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/60 p-4 rounded-xl border border-amber-200/70">
              <div>
                <h3 className="font-bold text-sm text-amber-950 flex items-center gap-2">
                  <span>Despiece de Materiales & Estimación con Merma</span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-extrabold">
                    +5% Merma Automática
                  </span>
                </h3>
                <p className="text-xs text-amber-900/80 mt-0.5">
                  Coste total de materiales asignados a esta obra:{' '}
                  <strong className="text-slate-900 text-sm font-extrabold">
                    {stats.materialCost.toLocaleString('es-ES')} €
                  </strong>
                </p>
              </div>

              <button
                onClick={() => setIsAddMatOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Calcular & Añadir Material</span>
              </button>
            </div>

            {/* Listado de Materiales */}
            {obraMaterials.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl space-y-2">
                <Package className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-slate-600 font-medium text-xs sm:text-sm">
                  Aún no has añadido materiales a esta obra.
                </p>
                <button
                  onClick={() => setIsAddMatOpen(true)}
                  className="text-xs text-amber-600 font-bold hover:underline"
                >
                  Pulsar aquí para calcular y añadir placas, perfiles o pasta
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="pb-2.5">Comprado</th>
                      <th className="pb-2.5">Material / Concepto</th>
                      <th className="pb-2.5 text-right">Medición</th>
                      <th className="pb-2.5 text-right">+5% Merma</th>
                      <th className="pb-2.5 text-right">Unidades (Ceil)</th>
                      <th className="pb-2.5 text-right">Precio Ud</th>
                      <th className="pb-2.5 text-right">Coste Total</th>
                      <th className="pb-2.5 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {obraMaterials.map(pm => (
                      <tr key={pm.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3">
                          <button
                            onClick={() => togglePurchaseProjectMaterial(pm.id)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              pm.isPurchased
                                ? 'bg-emerald-500 border-emerald-600 text-white'
                                : 'border-slate-300 text-slate-300 hover:border-slate-400'
                            }`}
                            title={pm.isPurchased ? 'Comprado' : 'Pendiente de compra'}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </button>
                        </td>
                        <td className="py-3 font-semibold text-slate-900">
                          {pm.materialName}
                          {pm.isPurchased && (
                            <span className="ml-2 text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                              En almacén
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right font-medium">
                          {pm.requiredQuantity} {pm.unitType}
                        </td>
                        <td className="py-3 text-right text-amber-700 font-semibold">
                          {pm.quantityWithWaste} {pm.unitType}
                        </td>
                        <td className="py-3 text-right">
                          <span className="bg-slate-100 text-slate-900 font-black px-2 py-0.5 rounded-md text-xs border border-slate-200">
                            {pm.calculatedUnits} uds
                          </span>
                        </td>
                        <td className="py-3 text-right font-medium">
                          {pm.unitCost.toFixed(2)} €
                        </td>
                        <td className="py-3 text-right font-black text-slate-900 text-sm">
                          {pm.totalCost.toFixed(2)} €
                        </td>
                        <td className="py-3 text-center">
                          <button
                            onClick={() => deleteProjectMaterial(pm.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Mano de Obra y Partes */}
        {activeTab === 'partes' && (
          <div className="p-4 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-50/60 p-4 rounded-xl border border-purple-200/70">
              <div>
                <h3 className="font-bold text-sm text-purple-950 flex items-center gap-2">
                  <span>Partes de Trabajo Imputados a esta Obra</span>
                </h3>
                <p className="text-xs text-purple-900/80 mt-0.5">
                  Total mano de obra: <strong className="text-slate-900 font-extrabold">{stats.laborCost.toLocaleString('es-ES')} €</strong>{' '}
                  ({stats.hoursWorked} horas y {stats.metersCompleted} metros)
                </p>
              </div>

              <button
                onClick={() => setIsAddWorkOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Fichar Jornada en esta Obra</span>
              </button>
            </div>

            {obraWorkLogs.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl space-y-2">
                <Clock className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-slate-600 font-medium text-xs sm:text-sm">
                  No se han registrado partes diarios para esta obra aún.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {obraWorkLogs.map(log => (
                  <div key={log.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {log.workerName}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${log.workType === 'horas' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'}`}>
                          {log.workType === 'horas' ? 'Por Horas' : 'Por Metros'}
                        </span>
                      </div>
                      <p className="text-slate-500 mt-0.5">
                        Fecha: <strong className="text-slate-700">{log.workDate}</strong> ·{' '}
                        {log.workType === 'horas' ? (
                          <span>{log.hoursWorked}h x {log.hourlyRate}€/h</span>
                        ) : (
                          <span>{log.concept}: {log.quantityMeters}m x {log.ratePerMeter}€/m</span>
                        )}
                        {log.notes && ` — "${log.notes}"`}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-black text-slate-900 text-base">
                        {log.totalPayout.toFixed(2)} €
                      </span>
                      <button
                        onClick={() => deleteWorkLog(log.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Pagos y Finanzas */}
        {activeTab === 'pagos' && (
          <div className="p-4 sm:p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">
                Movimientos de Tesorería de la Obra
              </h3>
              <button
                onClick={() => setIsAddPaymentOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Registrar Cobro de Cliente
              </button>
            </div>

            {obraTransactions.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No hay pagos ni facturas directas registradas.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {obraTransactions.map(tx => (
                  <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tx.type === 'ingreso' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {tx.type === 'ingreso' ? 'Cobro Recibido' : 'Gasto'}
                        </span>
                        <span className="font-bold text-slate-900">{tx.concept}</span>
                      </div>
                      <p className="text-slate-400 mt-0.5">
                        Fecha: {tx.paymentDate} · Base: {tx.netAmount.toFixed(2)}€ + {tx.vatRate}% IVA ({tx.vatAmount.toFixed(2)}€)
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-black text-sm ${tx.type === 'ingreso' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {tx.type === 'ingreso' ? '+' : '-'}{tx.grossAmount.toFixed(2)} €
                      </span>
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Resumen 360° y Cierre */}
        {activeTab === 'informe' && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-black tracking-tight text-white">
                    Ficha de Rentabilidad de la Obra
                  </h3>
                  <p className="text-xs text-slate-400">
                    {project.name} · {project.clientName}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Margen Obtenido</span>
                  <p className="text-xl font-black text-emerald-400">{stats.profitMarginPercent}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block font-semibold">Presupuesto (Base):</span>
                  <strong className="text-base text-white font-extrabold mt-1 block">
                    {stats.budgetedNet.toLocaleString('es-ES')} €
                  </strong>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block font-semibold">Coste Materiales:</span>
                  <strong className="text-base text-rose-300 font-extrabold mt-1 block">
                    {stats.materialCost.toLocaleString('es-ES')} €
                  </strong>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block font-semibold">Mano de Obra:</span>
                  <strong className="text-base text-rose-300 font-extrabold mt-1 block">
                    {stats.laborCost.toLocaleString('es-ES')} €
                  </strong>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block font-semibold">Beneficio Limpio:</span>
                  <strong className="text-base text-emerald-400 font-extrabold mt-1 block">
                    +{stats.netProfit.toLocaleString('es-ES')} €
                  </strong>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-600 space-y-2 border border-slate-200">
              <h4 className="font-bold text-slate-800 text-sm">Resumen de Ejecución:</h4>
              <p>• Total de horas trabajadas entre jefe y operario: <strong>{stats.hoursWorked} horas</strong>.</p>
              <p>• Total de metros cuadrados o lineales ejecutados a destajo: <strong>{stats.metersCompleted} metros</strong>.</p>
              <p>• Partidas de material asignadas con el 5% de desperdicio: <strong>{obraMaterials.length} partidas</strong>.</p>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: CALCULAR Y AÑADIR MATERIAL A LA OBRA */}
      {isAddMatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <Ruler className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Calculadora & Despiece de Material</h3>
                  <p className="text-xs text-slate-400">Fórmula con +5% de merma y redondeo hacia arriba</p>
                </div>
              </div>
              <button onClick={() => setIsAddMatOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} className="p-5 space-y-3.5 overflow-y-auto text-xs text-slate-700">
              {/* Seleccionar del Catálogo Maestro */}
              <div>
                <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Elegir del Catálogo Maestro (Opcional)
                </label>
                <select
                  value={selectedCatalogMatId}
                  onChange={e => handleSelectCatalogMaterial(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="">-- Material Personalizado --</option>
                  {materials.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.unitCost.toFixed(2)}€ / {m.unitType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Nombre del Material / Suministro *
                </label>
                <input
                  type="text"
                  value={matName}
                  onChange={e => setMatName(e.target.value)}
                  required
                  placeholder="Ej. Placas 13mm blanca, Montantes 48mm, Pasta rápida..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              {/* Medición real y merma */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Metros Medidos *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={requiredQty}
                    onChange={e => setRequiredQty(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">
                    % Merma / Desperdicio
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={wastePct}
                    onChange={e => setWastePct(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Rendimiento/Ud
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={coveragePerUnit}
                    onChange={e => setCoveragePerUnit(parseFloat(e.target.value) || 1)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                  <span className="text-[9px] text-slate-400">Ej: 3.0 m² por placa</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Precio Compra Unitario (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={unitCost}
                    onChange={e => setUnitCost(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Unidad de Medida
                  </label>
                  <select
                    value={unitType}
                    onChange={e => setUnitType(e.target.value as UnitType)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="m2">m² (Metros cuadrados)</option>
                    <option value="ml">ml (Metros lineales)</option>
                    <option value="unidad">Unidad / Pieza</option>
                    <option value="saco">Saco</option>
                    <option value="caja">Caja</option>
                    <option value="bote">Bote</option>
                  </select>
                </div>
              </div>

              {/* CARD DE CÁLCULO EN TIEMPO REAL */}
              <div className="bg-amber-50 border border-amber-300/80 rounded-xl p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                  Resultado del Cálculo Automático:
                </span>
                <div className="flex justify-between items-center text-xs text-amber-950">
                  <span>Metros con desperdicio ({wastePct}%):</span>
                  <strong>{previewQtyWithWaste} {unitType}</strong>
                </div>
                <div className="flex justify-between items-center text-xs text-amber-950">
                  <span>Unidades necesarias (redondeo hacia arriba):</span>
                  <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black text-sm">
                    {previewCalculatedUnits} piezas
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-amber-950 pt-1 border-t border-amber-200">
                  <span className="font-bold">Coste total de compra:</span>
                  <span className="text-base font-black text-amber-950">{previewTotalCost.toFixed(2)} €</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMatOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow"
                >
                  Añadir a la Obra ({previewTotalCost.toFixed(2)} €)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTRAR PARTE DE TRABAJO DIRECTO EN ESTA OBRA */}
      {isAddWorkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500 text-white flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base">Fichar Jornada en {project.name}</h3>
              </div>
              <button onClick={() => setIsAddWorkOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveWorkLog} className="p-5 space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setWorkType('horas')}
                  className={`py-2 rounded-lg font-bold text-xs ${workType === 'horas' ? 'bg-purple-600 text-white shadow' : 'text-slate-600'}`}
                >
                  Por Horas
                </button>
                <button
                  type="button"
                  onClick={() => setWorkType('metros')}
                  className={`py-2 rounded-lg font-bold text-xs ${workType === 'metros' ? 'bg-purple-600 text-white shadow' : 'text-slate-600'}`}
                >
                  Por Metros (Destajo)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">Trabajador</label>
                  {profiles.length > 0 ? (
                    <select
                      value={workerId}
                      onChange={e => {
                        setWorkerId(e.target.value);
                        if (e.target.value !== 'nuevo') {
                          const w = profiles.find(p => p.id === e.target.value);
                          if (w) setHourlyRate(w.hourlyRate);
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-semibold outline-none"
                    >
                      {profiles.map(p => (
                        <option key={p.id} value={p.id}>{p.fullName}</option>
                      ))}
                      <option value="nuevo">+ Añadir nuevo trabajador...</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={newWorkerName}
                      onChange={e => setNewWorkerName(e.target.value)}
                      placeholder="Nombre del trabajador..."
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 outline-none"
                    />
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">Fecha</label>
                  <input
                    type="date"
                    value={workDate}
                    onChange={e => setWorkDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 outline-none"
                  />
                </div>
              </div>

              {(workerId === 'nuevo' && profiles.length > 0) && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={newWorkerName}
                      onChange={e => setNewWorkerName(e.target.value)}
                      placeholder="Nombre trabajador..."
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

              {workType === 'horas' ? (
                <div className="grid grid-cols-2 gap-3 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <div>
                    <label className="block font-bold text-amber-900 uppercase mb-1">Horas</label>
                    <input
                      type="number"
                      step="0.5"
                      value={hoursWorked}
                      onChange={e => setHoursWorked(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 font-black text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-amber-900 uppercase mb-1">Precio / Hora (€)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={hourlyRate}
                      onChange={e => setHourlyRate(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 font-black text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 bg-sky-50 p-3 rounded-xl border border-sky-200">
                  <div>
                    <label className="block font-bold text-sky-900 uppercase mb-1">Partida / Concepto</label>
                    <input
                      type="text"
                      value={concept}
                      onChange={e => setConcept(e.target.value)}
                      placeholder="Ej. Tabique pladur reforzado"
                      className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-sky-900 uppercase mb-1">Metros (m² o ml)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={quantityMeters}
                        onChange={e => setQuantityMeters(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 font-black text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-sky-900 uppercase mb-1">Precio / Metro (€)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={ratePerMeter}
                        onChange={e => setRatePerMeter(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 font-black text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-900 uppercase tracking-wider mb-1">Notas</label>
                <input
                  type="text"
                  value={workNotes}
                  onChange={e => setWorkNotes(e.target.value)}
                  placeholder="Observaciones opcionales..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddWorkOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow"
                >
                  Guardar Parte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTRAR COBRO DE CLIENTE */}
      {isAddPaymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Registrar Cobro de Cliente</h3>
              <button onClick={() => setIsAddPaymentOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSavePayment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-900 uppercase mb-1">Concepto</label>
                <input
                  type="text"
                  value={paymentConcept}
                  onChange={e => setPaymentConcept(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 uppercase mb-1">Base Imponible (€)</label>
                  <input
                    type="number"
                    step="50"
                    value={paymentAmountNet}
                    onChange={e => setPaymentAmountNet(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-900 uppercase mb-1">IVA (%)</label>
                  <select
                    value={paymentVatRate}
                    onChange={e => setPaymentVatRate(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm"
                  >
                    <option value={21}>21%</option>
                    <option value={10}>10%</option>
                    <option value={0}>0%</option>
                  </select>
                </div>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl text-emerald-950 font-medium">
                Total Cobrado con IVA: <strong className="text-emerald-800 text-sm font-black">{(paymentAmountNet * (1 + paymentVatRate / 100)).toFixed(2)} €</strong>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddPaymentOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Registrar Cobro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR ELIMINAR OBRA DEFINITIVAMENTE */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">¿Eliminar esta obra por completo?</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Esta acción eliminará definitivamente la obra <strong>"{project.name}"</strong>, junto con todos sus materiales asignados, partes de horas/metros y cobros. Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteProject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow"
              >
                Sí, Eliminar Obra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

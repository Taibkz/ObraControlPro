'use client';

import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Trash2,
  Building2,
  Calendar,
  Layers,
  Scale,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { TransactionCategory, TransactionType } from '@/types';

export default function FinanzasPage() {
  const { transactions, projects, addTransaction, deleteTransaction } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'todos' | 'ingreso' | 'gasto'>('todos');

  // Formulario nueva transacción
  const [type, setType] = useState<TransactionType>('gasto');
  const [category, setCategory] = useState<TransactionCategory>('materiales');
  const [concept, setConcept] = useState('');
  const [netAmount, setNetAmount] = useState<number>(100);
  const [vatRate, setVatRate] = useState<number>(21);
  const [projectId, setProjectId] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'todos') return true;
    return t.type === filterType;
  });

  // Cálculos de Totales
  const totalIncomesGross = transactions
    .filter(t => t.type === 'ingreso')
    .reduce((sum, t) => sum + t.grossAmount, 0);

  const totalIncomesNet = transactions
    .filter(t => t.type === 'ingreso')
    .reduce((sum, t) => sum + t.netAmount, 0);

  const totalVatRepercutido = transactions
    .filter(t => t.type === 'ingreso')
    .reduce((sum, t) => sum + t.vatAmount, 0);

  const totalExpensesGross = transactions
    .filter(t => t.type === 'gasto')
    .reduce((sum, t) => sum + t.grossAmount, 0);

  const totalExpensesNet = transactions
    .filter(t => t.type === 'gasto')
    .reduce((sum, t) => sum + t.netAmount, 0);

  const totalVatSoportado = transactions
    .filter(t => t.type === 'gasto')
    .reduce((sum, t) => sum + t.vatAmount, 0);

  const vatBalance = totalVatRepercutido - totalVatSoportado;
  const netProfit = totalIncomesNet - totalExpensesNet;

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim() || netAmount <= 0) return;

    addTransaction({
      projectId: projectId || undefined,
      type,
      category,
      concept: concept.trim(),
      netAmount: Number(netAmount),
      vatRate: Number(vatRate),
      paymentDate,
    });

    setIsAddModalOpen(false);
    setConcept('');
    setNetAmount(100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Wallet className="w-7 h-7 text-blue-600" />
            <span>Finanzas, Facturación e Impuestos</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Control de cobros y pagos con desglose estricto de base imponible e IVA
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-amber-400 stroke-[2.5]" />
          <span>Registrar Movimiento</span>
        </button>
      </div>

      {/* KPI Cards Finanzas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Ingresos */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Ingresos Brutos</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-emerald-600">
              {totalIncomesGross.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Base neta: {totalIncomesNet.toLocaleString('es-ES')} €
            </p>
          </div>
        </div>

        {/* Total Gastos */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Gastos Brutos</span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-rose-600">
              {totalExpensesGross.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Base neta: {totalExpensesNet.toLocaleString('es-ES')} €
            </p>
          </div>
        </div>

        {/* Balance de IVA Trimestral Estimado */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Balance IVA</span>
            <Scale className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {vatBalance >= 0 ? '+' : ''}{vatBalance.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              IVA Cobrado ({totalVatRepercutido.toFixed(0)}€) - Soportado ({totalVatSoportado.toFixed(0)}€)
            </p>
          </div>
        </div>

        {/* Beneficio Limpio */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Beneficio Limpio</span>
            <Wallet className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <div className={`text-xl sm:text-2xl font-black ${netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Base Ingresos - Base Gastos
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Movimientos */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filtros */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterType('todos')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                filterType === 'todos' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Todos ({transactions.length})
            </button>
            <button
              onClick={() => setFilterType('ingreso')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                filterType === 'ingreso' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Ingresos
            </button>
            <button
              onClick={() => setFilterType('gasto')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                filterType === 'gasto' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Gastos
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Concepto</th>
                <th className="py-3 px-4">Obra / Destino</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4 text-right">Base Imponible</th>
                <th className="py-3 px-4 text-right">IVA</th>
                <th className="py-3 px-4 text-right">Total Bruto</th>
                <th className="py-3 px-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTransactions.map(tx => {
                const isIncome = tx.type === 'ingreso';

                return (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                        isIncome ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isIncome ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        <span>{isIncome ? 'Cobro' : 'Gasto'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {tx.concept}
                      <span className="block text-[10px] font-normal text-slate-400 capitalize">
                        Categoría: {tx.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {tx.projectName || 'Gasto General Empresa'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {tx.paymentDate}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium">
                      {tx.netAmount.toFixed(2)} €
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-slate-500">
                      +{tx.vatRate}% ({tx.vatAmount.toFixed(2)} €)
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-sm text-slate-900">
                      <span className={isIncome ? 'text-emerald-600' : 'text-rose-600'}>
                        {isIncome ? '+' : '-'}{tx.grossAmount.toFixed(2)} €
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL REGISTRAR MOVIMIENTO */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Registrar Cobro o Gasto</h3>
              <button onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-3.5 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setType('ingreso')}
                  className={`py-2 rounded-lg font-bold ${type === 'ingreso' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600'}`}
                >
                  Cobro / Ingreso
                </button>
                <button
                  type="button"
                  onClick={() => setType('gasto')}
                  className={`py-2 rounded-lg font-bold ${type === 'gasto' ? 'bg-rose-600 text-white shadow' : 'text-slate-600'}`}
                >
                  Gasto / Factura
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-900 uppercase mb-1">Concepto *</label>
                <input
                  type="text"
                  value={concept}
                  onChange={e => setConcept(e.target.value)}
                  placeholder="Ej. Factura Saltoki F-128, Gasoil furgoneta, Adelanto cliente..."
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 uppercase mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as TransactionCategory)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 outline-none"
                  >
                    <option value="materiales">Materiales</option>
                    <option value="mano_obra">Mano de Obra / Salarios</option>
                    <option value="combustible">Combustible / Vehículo</option>
                    <option value="herramientas">Herramientas</option>
                    <option value="pago_cliente">Pago de Cliente</option>
                    <option value="subcontrata">Subcontrata</option>
                    <option value="otros">Otros Gastos</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-900 uppercase mb-1">Asignar a Obra</label>
                  <select
                    value={projectId}
                    onChange={e => setProjectId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 outline-none"
                  >
                    <option value="">General de Empresa</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 uppercase mb-1">Base Imponible (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={netAmount}
                    onChange={e => setNetAmount(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 uppercase mb-1">Tipo de IVA</label>
                  <select
                    value={vatRate}
                    onChange={e => setVatRate(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 outline-none"
                  >
                    <option value={21}>21% (General)</option>
                    <option value={10}>10% (Reducido)</option>
                    <option value={0}>0% (Exento)</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div className="flex justify-between">
                  <span>Cuota IVA ({vatRate}%):</span>
                  <strong>{((netAmount * vatRate) / 100).toFixed(2)} €</strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 mt-1 font-bold text-slate-900">
                  <span>Total con IVA (Bruto):</span>
                  <span className="text-sm">{(netAmount * (1 + vatRate / 100)).toFixed(2)} €</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow"
                >
                  Guardar Movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

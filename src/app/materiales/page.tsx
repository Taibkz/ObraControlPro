'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Ruler,
  Trash2,
  Tag,
  Building2,
  CheckCircle2,
  Layers,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Material, UnitType } from '@/types';

export default function MaterialesPage() {
  const { materials, suppliers, projects, addMaterial, deleteMaterial, addProjectMaterial, addSupplier } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todas');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Widget Calculadora Rapida
  const [calcMaterialId, setCalcMaterialId] = useState(materials[0]?.id || '');
  const [calcMeters, setCalcMeters] = useState<number>(38);
  const [calcWastePct, setCalcWastePct] = useState<number>(5.0);
  const [targetProjectId, setTargetProjectId] = useState(projects[0]?.id || '');
  const [addedToObraSuccess, setAddedToObraSuccess] = useState(false);

  // Formulario nuevo material maestro
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Placas y Paneles');
  const [unitType, setUnitType] = useState<UnitType>('m2');
  const [coveragePerUnit, setCoveragePerUnit] = useState<number>(3.0);
  const [unitCost, setUnitCost] = useState<number>(8.50);
  const [defaultWastePct, setDefaultWastePct] = useState<number>(5.0);
  const [notes, setNotes] = useState('');

  // Combobox proveedor
  const [supplierInput, setSupplierInput] = useState('');
  const [supplierDropOpen, setSupplierDropOpen] = useState(false);
  const supplierRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (supplierRef.current && !supplierRef.current.contains(e.target as Node)) {
        setSupplierDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(supplierInput.toLowerCase())
  );
  const showAddNewSupplier =
    supplierInput.trim().length > 0 &&
    !suppliers.some(s => s.name.toLowerCase() === supplierInput.trim().toLowerCase());

  // Material seleccionado en calculadora
  const activeCalcMat = materials.find(m => m.id === calcMaterialId) || materials[0];

  const categories = ['todas', ...Array.from(new Set(materials.map(m => m.category)))];

  const filteredMaterials = materials.filter(m => {
    const matchesCategory = categoryFilter === 'todas' || m.category === categoryFilter;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.supplierName && m.supplierName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Calculo en vivo del simulador rapido
  const calcCoverage = activeCalcMat?.coveragePerUnit || 1;
  const calcUnitPrice = activeCalcMat?.unitCost || 0;
  const calcQtyWithWaste = Number((calcMeters * (1 + calcWastePct / 100)).toFixed(2));
  const calcCalculatedUnits = Math.ceil(calcQtyWithWaste / calcCoverage);
  const calcTotalCost = Number((calcCalculatedUnits * calcUnitPrice).toFixed(2));

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let finalSupplierId: string | undefined;
    let finalSupplierName: string | undefined;

    if (supplierInput.trim()) {
      const existing = suppliers.find(
        s => s.name.toLowerCase() === supplierInput.trim().toLowerCase()
      );
      if (existing) {
        finalSupplierId = existing.id;
        finalSupplierName = existing.name;
      } else {
        // Crear proveedor al vuelo
        const newSup = addSupplier({ name: supplierInput.trim() });
        finalSupplierId = newSup.id;
        finalSupplierName = newSup.name;
      }
    }

    addMaterial({
      name: name.trim(),
      category,
      unitType,
      coveragePerUnit: Number(coveragePerUnit),
      unitCost: Number(unitCost),
      defaultWastePercentage: Number(defaultWastePct),
      supplierId: finalSupplierId,
      supplierName: finalSupplierName,
      notes: notes.trim() || undefined,
    });

    setIsAddModalOpen(false);
    setName('');
    setNotes('');
    setSupplierInput('');
  };

  const handleSendCalcToProject = () => {
    if (!targetProjectId || !activeCalcMat) return;

    addProjectMaterial({
      projectId: targetProjectId,
      materialId: activeCalcMat.id,
      materialName: activeCalcMat.name,
      unitType: activeCalcMat.unitType,
      requiredQuantity: Number(calcMeters),
      wastePercentage: Number(calcWastePct),
      coveragePerUnit: Number(calcCoverage),
      unitCost: Number(calcUnitPrice),
      isPurchased: false,
    });

    setAddedToObraSuccess(true);
    setTimeout(() => setAddedToObraSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Package className="w-7 h-7 text-amber-500" />
            <span>Catalogo de Materiales & Suministros</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestiona tus materiales habituales (placas, perfiles, pastas, tornilleria...) y simula presupuestos con el 5% de merma
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/10 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nuevo Material</span>
        </button>
      </div>

      {/* WIDGET CALCULADORA INTERACTIVA DE OBRA */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-700">
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">
                Calculadora Rapida de Medicion & Despiece
              </h2>
              <p className="text-xs text-slate-400">Aplica el +5% de merma y redondeo superior automatico</p>
            </div>
          </div>
          <span className="text-[11px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full">
            +5% Desperdicio Auto
          </span>
        </div>

        {materials.length === 0 ? (
          <div className="py-6 text-center space-y-3">
            <p className="text-slate-400 text-xs">
              Aun no tienes materiales registrados en el catalogo maestro.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Dar de Alta Primer Material</span>
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Selector Material */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Material del Catalogo
                </label>
                <select
                  value={calcMaterialId}
                  onChange={e => setCalcMaterialId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {materials.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.unitCost.toFixed(2)}€/ud · {m.coveragePerUnit} {m.unitType}/ud)
                    </option>
                  ))}
                </select>
              </div>

              {/* Metros medidos */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Metros Necesarios
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={calcMeters}
                    onChange={e => setCalcMeters(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-extrabold focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">
                    {activeCalcMat?.unitType || 'm2'}
                  </span>
                </div>
              </div>

              {/* % Desperdicio */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  % Merma
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={calcWastePct}
                  onChange={e => setCalcWastePct(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-extrabold focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Barra de Resultado en Vivo */}
            <div className="mt-4 pt-4 border-t border-slate-700/80 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex justify-between items-center text-xs">
                <span className="text-slate-400">Total con desperdicio (+{calcWastePct}%):</span>
                <span className="font-extrabold text-amber-400 text-sm">{calcQtyWithWaste} {activeCalcMat?.unitType}</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex justify-between items-center text-xs">
                <span className="text-slate-400">Piezas a comprar (Redondeo Ceil):</span>
                <span className="font-black text-white bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-sm">
                  {calcCalculatedUnits} {activeCalcMat?.unitType === 'm2' ? 'placas' : 'unidades'}
                </span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex justify-between items-center text-xs">
                <span className="text-slate-400">Coste de compra estimado:</span>
                <span className="font-black text-emerald-400 text-base">{calcTotalCost.toFixed(2)} €</span>
              </div>
            </div>

            {/* Asignar directamente a una obra activa */}
            {projects.filter(p => p.status === 'activa').length > 0 && (
              <div className="mt-4 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-slate-400 font-medium">Asignar a obra:</span>
                  <select
                    value={targetProjectId}
                    onChange={e => setTargetProjectId(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-none"
                  >
                    {projects.filter(p => p.status === 'activa').map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSendCalcToProject}
                  disabled={addedToObraSuccess}
                  className={`w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow ${
                    addedToObraSuccess
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  {addedToObraSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Asignado a la Obra con Exito!</span>
                    </>
                  ) : (
                    <>
                      <span>Anadir esta partida a la obra ({calcTotalCost.toFixed(2)} €)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Catalogo Maestro Listado */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filtros */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60">
            <input
              type="text"
              placeholder="Buscar material..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Tabla de Materiales */}
        {filteredMaterials.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-medium">No hay materiales en el catalogo</p>
            <p className="text-slate-300 text-xs mt-1">Pulsa "Nuevo Material" para empezar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Material / Suministro</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Proveedor</th>
                  <th className="py-3 px-4 text-right">Rendimiento Ud</th>
                  <th className="py-3 px-4 text-right">Merma Defecto</th>
                  <th className="py-3 px-4 text-right">Precio Compra</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredMaterials.map(mat => (
                  <tr key={mat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {mat.name}
                      {mat.notes && (
                        <p className="text-[11px] font-normal text-slate-400 mt-0.5">{mat.notes}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                        {mat.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {mat.supplierName || <span className="text-slate-300 italic">Sin proveedor</span>}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                      {mat.coveragePerUnit} {mat.unitType}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-amber-700">
                      +{mat.defaultWastePercentage}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 text-sm">
                      {mat.unitCost.toFixed(2)} €
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => deleteMaterial(mat.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Eliminar material"
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

      {/* MODAL CREAR NUEVO MATERIAL MAESTRO */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <Package className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base">Registrar Material en Catalogo</h3>
              </div>
              <button onClick={() => { setIsAddModalOpen(false); setSupplierInput(''); }} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMaterial} className="p-5 space-y-3 text-xs text-slate-700 overflow-y-auto">
              <div>
                <label className="block font-bold text-slate-900 uppercase mb-1">Nombre del Material *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ej. Montante 48mm galvanizado, Pasta de juntas..."
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 uppercase mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-medium outline-none"
                  >
                    <option value="Placas y Paneles">Placas y Paneles</option>
                    <option value="Perfileria">Perfileria</option>
                    <option value="Pastas y Adhesivos">Pastas y Adhesivos</option>
                    <option value="Tornilleria">Tornilleria</option>
                    <option value="Aislamiento">Aislamiento</option>
                    <option value="Herramientas">Herramientas</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>

                {/* COMBOBOX PROVEEDOR */}
                <div>
                  <label className="block font-bold text-slate-900 uppercase mb-1">Proveedor Habitual</label>
                  <div className="relative" ref={supplierRef}>
                    <div className="relative">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={supplierInput}
                        onChange={e => { setSupplierInput(e.target.value); setSupplierDropOpen(true); }}
                        onFocus={() => setSupplierDropOpen(true)}
                        placeholder={suppliers.length === 0 ? 'Escribe un proveedor...' : 'Buscar o escribir...'}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-8 py-2 text-sm text-slate-900 font-medium outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                    </div>

                    {supplierDropOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                        {filteredSuppliers.length === 0 && !showAddNewSupplier && (
                          <p className="px-3 py-2 text-slate-400 text-xs">Sin proveedores. Escribe para crear uno.</p>
                        )}
                        {filteredSuppliers.map(s => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => { setSupplierInput(s.name); setSupplierDropOpen(false); }}
                            className="w-full text-left px-3 py-2 text-sm text-slate-800 hover:bg-amber-50 hover:text-amber-700 font-medium transition-colors"
                          >
                            {s.name}
                          </button>
                        ))}
                        {showAddNewSupplier && (
                          <button
                            type="button"
                            onClick={() => { setSupplierDropOpen(false); }}
                            className="w-full text-left px-3 py-2 text-sm font-bold text-amber-700 hover:bg-amber-50 border-t border-slate-100 flex items-center gap-2 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Anadir "{supplierInput.trim()}" como nuevo proveedor
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  {supplierInput.trim() && showAddNewSupplier && (
                    <p className="text-[10px] text-amber-600 mt-1 font-medium">Se creara automaticamente al guardar</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 uppercase mb-1">Unidad</label>
                  <select
                    value={unitType}
                    onChange={e => setUnitType(e.target.value as UnitType)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 outline-none"
                  >
                    <option value="m2">m2</option>
                    <option value="ml">ml (lineal)</option>
                    <option value="unidad">Unidad</option>
                    <option value="saco">Saco</option>
                    <option value="caja">Caja</option>
                    <option value="rollo">Rollo</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-900 uppercase mb-1">Rendimiento</label>
                  <input
                    type="number"
                    step="0.1"
                    value={coveragePerUnit}
                    onChange={e => setCoveragePerUnit(parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 uppercase mb-1">Precio Compra (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={unitCost}
                    onChange={e => setUnitCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-900 uppercase mb-1">Notas / Descripcion</label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Detalles del formato, medidas..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setSupplierInput(''); }}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow"
                >
                  Guardar en Catalogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
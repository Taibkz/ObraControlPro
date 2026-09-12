'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Material,
  Profile,
  Project,
  ProjectFinancialSummary,
  ProjectMaterial,
  ProjectStatus,
  Supplier,
  Transaction,
  WorkLog,
} from '@/types';
import {
  INITIAL_MATERIALS,
  INITIAL_PROFILES,
  INITIAL_PROJECT_MATERIALS,
  INITIAL_PROJECTS,
  INITIAL_SUPPLIERS,
  INITIAL_TRANSACTIONS,
  INITIAL_WORK_LOGS,
} from '@/lib/initialData';

interface AppContextType {
  projects: Project[];
  materials: Material[];
  projectMaterials: ProjectMaterial[];
  workLogs: WorkLog[];
  transactions: Transaction[];
  profiles: Profile[];
  suppliers: Supplier[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  // Obras
  addProject: (project: Omit<Project, 'id'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  completeProject: (id: string) => void;
  reopenProject: (id: string) => void;
  deleteProject: (id: string) => void;
  // Materiales
  addMaterial: (material: Omit<Material, 'id'>) => Material;
  updateMaterial: (id: string, updates: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;
  // Materiales asignados a obra
  addProjectMaterial: (
    data: {
      projectId: string;
      materialId?: string;
      materialName: string;
      unitType: any;
      requiredQuantity: number;
      wastePercentage: number;
      coveragePerUnit: number;
      unitCost: number;
      isPurchased?: boolean;
    }
  ) => ProjectMaterial;
  togglePurchaseProjectMaterial: (id: string) => void;
  deleteProjectMaterial: (id: string) => void;
  // Partes de trabajo
  addWorkLog: (data: Omit<WorkLog, 'id' | 'totalPayout'>) => WorkLog;
  deleteWorkLog: (id: string) => void;
  // Finanzas
  addTransaction: (data: Omit<Transaction, 'id' | 'vatAmount' | 'grossAmount'>) => Transaction;
  deleteTransaction: (id: string) => void;
  // Trabajadores
  addProfile: (data: Omit<Profile, 'id'>) => Profile;
  // Proveedores
  addSupplier: (data: Omit<Supplier, 'id'>) => Supplier;
  // Métricas calculadas
  getProjectStats: (projectId: string) => ProjectFinancialSummary;
  getGlobalStats: () => {
    totalActiveProjects: number;
    totalBudgetedGross: number;
    totalChargedGross: number;
    totalCosts: number;
    totalMaterialCost: number;
    totalLaborCost: number;
    netProfit: number;
    totalHoursWorked: number;
    totalMetersCompleted: number;
  };
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('obras');

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  const [projectMaterials, setProjectMaterials] = useState<ProjectMaterial[]>(INITIAL_PROJECT_MATERIALS);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>(INITIAL_WORK_LOGS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);

  // Cargar de LocalStorage en cliente
  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem('obra_projects');
      if (savedProjects) setProjects(JSON.parse(savedProjects));

      const savedMaterials = localStorage.getItem('obra_materials');
      if (savedMaterials) setMaterials(JSON.parse(savedMaterials));

      const savedPM = localStorage.getItem('obra_project_materials');
      if (savedPM) setProjectMaterials(JSON.parse(savedPM));

      const savedWL = localStorage.getItem('obra_work_logs');
      if (savedWL) setWorkLogs(JSON.parse(savedWL));

      const savedTx = localStorage.getItem('obra_transactions');
      if (savedTx) setTransactions(JSON.parse(savedTx));

      const savedProf = localStorage.getItem('obra_profiles');
      if (savedProf) setProfiles(JSON.parse(savedProf));

      const savedSup = localStorage.getItem('obra_suppliers');
      if (savedSup) setSuppliers(JSON.parse(savedSup));
    } catch (e) {
      console.warn('Error al cargar datos locales', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Guardar en LocalStorage ante cambios
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('obra_projects', JSON.stringify(projects));
      localStorage.setItem('obra_materials', JSON.stringify(materials));
      localStorage.setItem('obra_project_materials', JSON.stringify(projectMaterials));
      localStorage.setItem('obra_work_logs', JSON.stringify(workLogs));
      localStorage.setItem('obra_transactions', JSON.stringify(transactions));
      localStorage.setItem('obra_profiles', JSON.stringify(profiles));
      localStorage.setItem('obra_suppliers', JSON.stringify(suppliers));
    } catch (e) {
      console.warn('Error al guardar datos locales', e);
    }
  }, [isLoaded, projects, materials, projectMaterials, workLogs, transactions, profiles, suppliers]);

  const resetToDemoData = () => {
    setProjects(INITIAL_PROJECTS);
    setMaterials(INITIAL_MATERIALS);
    setProjectMaterials(INITIAL_PROJECT_MATERIALS);
    setWorkLogs(INITIAL_WORK_LOGS);
    setTransactions(INITIAL_TRANSACTIONS);
    setProfiles(INITIAL_PROFILES);
    setSuppliers(INITIAL_SUPPLIERS);
    localStorage.clear();
  };

  // --- MÉTODOS DE OBRAS ---
  const addProject = (data: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...data,
      id: 'proj-' + Date.now(),
    };
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const completeProject = (id: string) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              status: 'finalizada' as ProjectStatus,
              completedAt: new Date().toISOString(),
            }
          : p
      )
    );
  };

  const reopenProject = (id: string) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              status: 'activa' as ProjectStatus,
              completedAt: undefined,
            }
          : p
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setProjectMaterials(prev => prev.filter(pm => pm.projectId !== id));
    setWorkLogs(prev => prev.filter(wl => wl.projectId !== id));
    setTransactions(prev => prev.filter(t => t.projectId !== id));
  };

  // --- MÉTODOS DE MATERIALES MAESTROS ---
  const addMaterial = (data: Omit<Material, 'id'>) => {
    const newMaterial: Material = {
      ...data,
      id: 'mat-' + Date.now(),
    };
    setMaterials(prev => [...prev, newMaterial]);
    return newMaterial;
  };

  const updateMaterial = (id: string, updates: Partial<Material>) => {
    setMaterials(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteMaterial = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  // --- CÁLCULO DE MATERIALES ASIGNADOS A OBRA (5% desperdicio y redondeo ceil) ---
  const addProjectMaterial = (data: {
    projectId: string;
    materialId?: string;
    materialName: string;
    unitType: any;
    requiredQuantity: number;
    wastePercentage: number;
    coveragePerUnit: number;
    unitCost: number;
    isPurchased?: boolean;
  }) => {
    const wasteMultiplier = 1 + (data.wastePercentage || 0) / 100;
    const quantityWithWaste = Number((data.requiredQuantity * wasteMultiplier).toFixed(2));
    const coverage = data.coveragePerUnit > 0 ? data.coveragePerUnit : 1;
    // Redondeo hacia arriba estricto
    const calculatedUnits = Math.ceil(quantityWithWaste / coverage);
    const totalCost = Number((calculatedUnits * data.unitCost).toFixed(2));

    const newPM: ProjectMaterial = {
      id: 'pm-' + Date.now(),
      projectId: data.projectId,
      materialId: data.materialId,
      materialName: data.materialName,
      unitType: data.unitType,
      requiredQuantity: data.requiredQuantity,
      wastePercentage: data.wastePercentage,
      quantityWithWaste,
      coveragePerUnit: coverage,
      calculatedUnits,
      unitCost: data.unitCost,
      totalCost,
      isPurchased: Boolean(data.isPurchased),
      purchaseDate: data.isPurchased ? new Date().toISOString().split('T')[0] : undefined,
    };

    setProjectMaterials(prev => [...prev, newPM]);
    return newPM;
  };

  const togglePurchaseProjectMaterial = (id: string) => {
    setProjectMaterials(prev =>
      prev.map(pm => {
        if (pm.id === id) {
          const isPurchased = !pm.isPurchased;
          return {
            ...pm,
            isPurchased,
            purchaseDate: isPurchased ? new Date().toISOString().split('T')[0] : undefined,
          };
        }
        return pm;
      })
    );
  };

  const deleteProjectMaterial = (id: string) => {
    setProjectMaterials(prev => prev.filter(pm => pm.id !== id));
  };

  // --- PARTES DE TRABAJO (HORAS / METROS) ---
  const addWorkLog = (data: Omit<WorkLog, 'id' | 'totalPayout'>) => {
    let totalPayout = 0;
    if (data.workType === 'horas') {
      const hours = data.hoursWorked || 0;
      const rate = data.hourlyRate || 0;
      totalPayout = Number((hours * rate).toFixed(2));
    } else {
      const meters = data.quantityMeters || 0;
      const rate = data.ratePerMeter || 0;
      totalPayout = Number((meters * rate).toFixed(2));
    }

    const project = projects.find(p => p.id === data.projectId);
    const newLog: WorkLog = {
      ...data,
      id: 'wl-' + Date.now(),
      projectName: project ? project.name : data.projectName,
      totalPayout,
    };

    setWorkLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  const deleteWorkLog = (id: string) => {
    setWorkLogs(prev => prev.filter(wl => wl.id !== id));
  };

  // --- FINANZAS ---
  const addTransaction = (data: Omit<Transaction, 'id' | 'vatAmount' | 'grossAmount'>) => {
    const vatRate = data.vatRate || 21;
    const vatAmount = Number(((data.netAmount * vatRate) / 100).toFixed(2));
    const grossAmount = Number((data.netAmount + vatAmount).toFixed(2));

    const project = data.projectId ? projects.find(p => p.id === data.projectId) : undefined;

    const newTx: Transaction = {
      ...data,
      id: 'tx-' + Date.now(),
      projectName: project ? project.name : undefined,
      vatAmount,
      grossAmount,
    };

    setTransactions(prev => [newTx, ...prev]);

    // Si es un cobro de cliente para una obra, actualizar automáticamente totalCharged
    if (data.type === 'ingreso' && data.category === 'pago_cliente' && data.projectId) {
      setProjects(prev =>
        prev.map(p =>
          p.id === data.projectId
            ? { ...p, totalCharged: Number((p.totalCharged + grossAmount).toFixed(2)) }
            : p
        )
      );
    }

    return newTx;
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addProfile = (data: Omit<Profile, 'id'>) => {
    const newProf: Profile = {
      ...data,
      id: 'prof-' + Date.now(),
    };
    setProfiles(prev => [...prev, newProf]);
    return newProf;
  };

  const addSupplier = (data: Omit<Supplier, 'id'>) => {
    const newSup: Supplier = {
      ...data,
      id: 'sup-' + Date.now(),
    };
    setSuppliers(prev => [...prev, newSup]);
    return newSup;
  };

  // --- MÉTRICAS DE UNA OBRA ESPECÍFICA ---
  const getProjectStats = (projectId: string): ProjectFinancialSummary => {
    const project = projects.find(p => p.id === projectId);
    const budgetedNet = project ? project.budgetedAmount : 0;
    const vatRate = project ? project.vatRate : 21;
    const budgetedGross = Number((budgetedNet * (1 + vatRate / 100)).toFixed(2));
    const chargedGross = project ? project.totalCharged : 0;
    const chargedNet = Number((chargedGross / (1 + vatRate / 100)).toFixed(2));
    const pendingNet = Math.max(0, budgetedNet - chargedNet);

    // Coste de materiales asignados a esta obra
    const pMaterials = projectMaterials.filter(pm => pm.projectId === projectId);
    const materialCost = Number(pMaterials.reduce((sum, pm) => sum + pm.totalCost, 0).toFixed(2));

    // Coste de mano de obra en esta obra
    const pLogs = workLogs.filter(wl => wl.projectId === projectId);
    const laborCost = Number(pLogs.reduce((sum, wl) => sum + wl.totalPayout, 0).toFixed(2));
    const hoursWorked = Number(pLogs.reduce((sum, wl) => sum + (wl.hoursWorked || 0), 0).toFixed(1));
    const metersCompleted = Number(pLogs.reduce((sum, wl) => sum + (wl.quantityMeters || 0), 0).toFixed(1));

    // Otros costes directos registrados en transacciones
    const pTransactions = transactions.filter(
      t => t.projectId === projectId && t.type === 'gasto' && t.category !== 'materiales' && t.category !== 'mano_obra'
    );
    const otherCost = Number(pTransactions.reduce((sum, t) => sum + t.netAmount, 0).toFixed(2));

    const totalCost = Number((materialCost + laborCost + otherCost).toFixed(2));
    const netProfit = Number((budgetedNet - totalCost).toFixed(2));
    const profitMarginPercent = budgetedNet > 0 ? Number(((netProfit / budgetedNet) * 100).toFixed(1)) : 0;

    return {
      budgetedNet,
      budgetedGross,
      chargedNet,
      pendingNet,
      materialCost,
      laborCost,
      otherCost,
      totalCost,
      netProfit,
      profitMarginPercent,
      hoursWorked,
      metersCompleted,
    };
  };

  // --- MÉTRICAS GLOBALES PARA EL DASHBOARD INTELIGENTE ---
  const getGlobalStats = () => {
    const activeProjects = projects.filter(p => p.status === 'activa');
    const totalActiveProjects = activeProjects.length;

    const totalBudgetedGross = projects.reduce((sum, p) => {
      const gross = p.budgetedAmount * (1 + p.vatRate / 100);
      return sum + gross;
    }, 0);

    const totalChargedGross = projects.reduce((sum, p) => sum + p.totalCharged, 0);

    const totalMaterialCost = projectMaterials.reduce((sum, pm) => sum + pm.totalCost, 0);
    const totalLaborCost = workLogs.reduce((sum, wl) => sum + wl.totalPayout, 0);
    const otherCosts = transactions
      .filter(t => t.type === 'gasto' && t.category !== 'materiales' && t.category !== 'mano_obra')
      .reduce((sum, t) => sum + t.netAmount, 0);

    const totalCosts = totalMaterialCost + totalLaborCost + otherCosts;

    // Beneficio Neto total sobre proyectos cerrados y activos
    const totalBudgetedNet = projects.reduce((sum, p) => sum + p.budgetedAmount, 0);
    const netProfit = totalBudgetedNet - totalCosts;

    const totalHoursWorked = workLogs.reduce((sum, wl) => sum + (wl.hoursWorked || 0), 0);
    const totalMetersCompleted = workLogs.reduce((sum, wl) => sum + (wl.quantityMeters || 0), 0);

    return {
      totalActiveProjects,
      totalBudgetedGross: Number(totalBudgetedGross.toFixed(2)),
      totalChargedGross: Number(totalChargedGross.toFixed(2)),
      totalCosts: Number(totalCosts.toFixed(2)),
      totalMaterialCost: Number(totalMaterialCost.toFixed(2)),
      totalLaborCost: Number(totalLaborCost.toFixed(2)),
      netProfit: Number(netProfit.toFixed(2)),
      totalHoursWorked: Number(totalHoursWorked.toFixed(1)),
      totalMetersCompleted: Number(totalMetersCompleted.toFixed(1)),
    };
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        materials,
        projectMaterials,
        workLogs,
        transactions,
        profiles,
        suppliers,
        activeTab,
        setActiveTab,
        addProject,
        updateProject,
        completeProject,
        reopenProject,
        deleteProject,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        addProjectMaterial,
        togglePurchaseProjectMaterial,
        deleteProjectMaterial,
        addWorkLog,
        deleteWorkLog,
        addTransaction,
        deleteTransaction,
        addProfile,
        addSupplier,
        getProjectStats,
        getGlobalStats,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
}

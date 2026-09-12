export type WorkerRole = 'jefe' | 'empleado';

export interface Profile {
  id: string;
  fullName: string;
  role: WorkerRole;
  hourlyRate: number;
  phone?: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}

export type UnitType = 'm2' | 'ml' | 'unidad' | 'saco' | 'rollo' | 'bote' | 'caja';

export interface Material {
  id: string;
  supplierId?: string;
  supplierName?: string;
  name: string;
  category: string;
  unitType: UnitType;
  coveragePerUnit: number; // Ej: 3.0 para placa de 2.50x1.20
  unitCost: number; // Precio compra sin IVA
  defaultWastePercentage: number; // Ej: 5.0
  notes?: string;
}

export type ProjectStatus = 'presupuesto' | 'activa' | 'finalizada' | 'cancelada';

export interface Project {
  id: string;
  name: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  address?: string;
  status: ProjectStatus;
  budgetedAmount: number; // Base imponible pactada
  vatRate: number; // 21, 10, 0
  totalCharged: number; // Total cobrado al cliente
  startDate: string;
  completedAt?: string;
  notes?: string;
}

export interface ProjectMaterial {
  id: string;
  projectId: string;
  materialId?: string;
  materialName: string;
  unitType: UnitType;
  requiredQuantity: number; // Metros medidos (ej: 38)
  wastePercentage: number; // Merma (ej: 5%)
  quantityWithWaste: number; // 38 * 1.05 = 39.9
  coveragePerUnit: number; // 3.0 m2
  calculatedUnits: number; // Math.ceil(39.9 / 3.0) = 14
  unitCost: number; // Precio de compra por unidad
  totalCost: number; // calculatedUnits * unitCost
  isPurchased: boolean;
  purchaseDate?: string;
}

export type WorkType = 'horas' | 'metros';

export interface WorkLog {
  id: string;
  projectId: string;
  projectName?: string;
  workerId: string;
  workerName: string;
  workDate: string; // YYYY-MM-DD
  workType: WorkType;
  // Si es por horas:
  hoursWorked?: number;
  hourlyRate?: number;
  // Si es por metros:
  concept?: string; // Ej: 'Tabique reforzado'
  quantityMeters?: number;
  ratePerMeter?: number;
  // Total
  totalPayout: number;
  notes?: string;
}

export type TransactionType = 'ingreso' | 'gasto';
export type TransactionCategory =
  | 'materiales'
  | 'mano_obra'
  | 'subcontrata'
  | 'combustible'
  | 'herramientas'
  | 'pago_cliente'
  | 'otros';

export interface Transaction {
  id: string;
  projectId?: string;
  projectName?: string;
  type: TransactionType;
  category: TransactionCategory;
  concept: string;
  netAmount: number; // Base imponible
  vatRate: number; // % IVA
  vatAmount: number; // Cuota IVA
  grossAmount: number; // Total con IVA
  paymentDate: string; // YYYY-MM-DD
  receiptUrl?: string;
}

export interface ProjectFinancialSummary {
  budgetedNet: number;
  budgetedGross: number;
  chargedNet: number;
  pendingNet: number;
  materialCost: number;
  laborCost: number;
  otherCost: number;
  totalCost: number;
  netProfit: number;
  profitMarginPercent: number;
  hoursWorked: number;
  metersCompleted: number;
}

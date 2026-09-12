-- ESQUEMA DE BASE DE DATOS PARA SUPABASE (POSTGRESQL)
-- GESTION DE OBRAS, MATERIALES, PARTES DE TRABAJO Y FINANZAS

-- 1. Tabla de Perfiles / Trabajadores
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('jefe', 'empleado')) DEFAULT 'empleado',
  hourly_rate NUMERIC(10,2) DEFAULT 15.00,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabla de Proveedores de Materiales
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Catálogo Maestro de Materiales y Suministros
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Placas y Tabiquería', -- 'Placas', 'Perfilería', 'Pastas', 'Tornillería', 'Herramientas', 'Otros'
  unit_type TEXT NOT NULL DEFAULT 'm2', -- 'm2', 'ml', 'unidad', 'saco', 'rollo', 'bote', 'caja'
  coverage_per_unit NUMERIC(10,2) DEFAULT 1.00, -- Rendimiento por unidad (ej: 3.0 m2 por placa)
  unit_cost NUMERIC(10,2) NOT NULL, -- Precio de compra unitario sin IVA
  default_waste_percentage NUMERIC(5,2) DEFAULT 5.00, -- % desperdicio estimado
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Obras y Proyectos
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  client_email TEXT,
  address TEXT,
  status TEXT CHECK (status IN ('presupuesto', 'activa', 'finalizada', 'cancelada')) DEFAULT 'activa',
  budgeted_amount NUMERIC(12,2) DEFAULT 0.00, -- Presupuesto pactado con el cliente (sin IVA)
  vat_rate NUMERIC(5,2) DEFAULT 21.00, -- Tipo de IVA (21%, 10%, 0%)
  total_charged NUMERIC(12,2) DEFAULT 0.00, -- Total cobrado al cliente hasta la fecha
  start_date DATE DEFAULT CURRENT_DATE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Partidas de Materiales Asignadas a cada Obra (con merma y redondeo)
CREATE TABLE IF NOT EXISTS project_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  material_id UUID REFERENCES materials(id) ON DELETE SET NULL,
  material_name TEXT NOT NULL,
  unit_type TEXT NOT NULL DEFAULT 'm2',
  required_quantity NUMERIC(10,2) NOT NULL, -- Medida real calculada en obra (ej: 38 m2)
  waste_percentage NUMERIC(5,2) DEFAULT 5.00, -- Merma (ej: 5%)
  quantity_with_waste NUMERIC(10,2) NOT NULL, -- 38 * 1.05 = 39.9
  coverage_per_unit NUMERIC(10,2) DEFAULT 1.00, -- 3.0 m2 / unidad
  calculated_units INTEGER NOT NULL, -- CEIL(39.9 / 3.0) = 14 unidades
  unit_cost NUMERIC(10,2) NOT NULL, -- Precio compra unitario
  total_cost NUMERIC(10,2) NOT NULL, -- calculated_units * unit_cost
  is_purchased BOOLEAN DEFAULT false,
  purchase_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Partes de Trabajo / Jornadas (Mano de Obra)
CREATE TABLE IF NOT EXISTS work_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  worker_name TEXT NOT NULL,
  work_date DATE NOT NULL DEFAULT CURRENT_DATE,
  work_type TEXT CHECK (work_type IN ('horas', 'metros')) NOT NULL,
  -- Si es por Horas:
  hours_worked NUMERIC(6,2),
  hourly_rate NUMERIC(10,2),
  -- Si es por Metraje / A Destajo:
  concept TEXT, -- Ej: 'Tabique reforzado'
  quantity_meters NUMERIC(10,2),
  rate_per_meter NUMERIC(10,2),
  -- Importe Total Devengado
  total_payout NUMERIC(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Gastos Directos e Ingresos de Obras / Generales
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  type TEXT CHECK (type IN ('ingreso', 'gasto')) NOT NULL,
  category TEXT NOT NULL, -- 'materiales', 'mano_obra', 'subcontrata', 'combustible', 'herramientas', 'pago_cliente', 'otros'
  concept TEXT NOT NULL,
  net_amount NUMERIC(12,2) NOT NULL, -- Base imponible
  vat_rate NUMERIC(5,2) DEFAULT 21.00, -- Tipo IVA
  vat_amount NUMERIC(12,2) NOT NULL, -- IVA calculado
  gross_amount NUMERIC(12,2) NOT NULL, -- Total factura con IVA
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indices para alta velocidad en Dashboard
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_project_materials_project ON project_materials(project_id);
CREATE INDEX IF NOT EXISTS idx_work_logs_project ON work_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_work_logs_worker ON work_logs(worker_id);
CREATE INDEX IF NOT EXISTS idx_transactions_project ON transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(payment_date);

-- DATOS INICIALES DE EJEMPLO (Opcional - para arrancar con catálogo listo)
INSERT INTO profiles (full_name, role, hourly_rate, phone)
VALUES 
  ('Mohsin (Jefe)', 'jefe', 25.00, '612 345 678'),
  ('Karim (Oficial / Empleado)', 'empleado', 15.00, '699 876 543')
ON CONFLICT DO NOTHING;

INSERT INTO suppliers (name, phone, address)
VALUES 
  ('Bricomart / Obramat', '912 345 600', 'Polígono Industrial Las Mercedes'),
  ('Pladur & Aislamientos Saltoki', '913 456 700', 'Av. de la Industria 24'),
  ('Almacenes Yesos del Sur', '914 567 800', 'Ctra. de Toledo km 12')
ON CONFLICT DO NOTHING;

INSERT INTO materials (name, category, unit_type, coverage_per_unit, unit_cost, default_waste_percentage, notes)
VALUES
  ('Placa 13mm Blanca Estándar (2.50 x 1.20m)', 'Placas y Paneles', 'm2', 3.00, 8.50, 5.0, 'Tabiques y trasdosados'),
  ('Placa 13mm Verde Hidrófuga (2.50 x 1.20m)', 'Placas y Paneles', 'm2', 3.00, 12.90, 5.0, 'Baños y cocinas antihumedad'),
  ('Montante 48mm galvanizado (3.00 metros)', 'Perfilería', 'ml', 3.00, 4.80, 5.0, 'Estructura vertical'),
  ('Canal 48mm galvanizado (3.00 metros)', 'Perfilería', 'ml', 3.00, 3.95, 5.0, 'Guías suelo y techo'),
  ('Pasta para juntas secado rápido (Saco 25kg)', 'Pastas y Adhesivos', 'saco', 25.00, 18.50, 5.0, 'Tratamiento de juntas'),
  ('Rollo cinta de papel microporosa (150m)', 'Pastas y Adhesivos', 'rollo', 150.00, 7.20, 5.0, 'Refuerzo de juntas'),
  ('Caja tornillos PM 25mm (1000 uds)', 'Tornillería', 'caja', 50.00, 9.90, 5.0, 'Fijación placa a perfil')
ON CONFLICT DO NOTHING;


# ObraControl Pro 🏗️
### Sistema Web de Gestión de Obras, Materiales, Jornadas y Finanzas

Aplicación web profesional diseñada para pequeñas empresas de reformas, albañilería y construcción con enfoque **Mobile-First** (PWA) y soporte para escritorio.

---

## 🚀 Características Principales

1. **Gestión Multi-Obra en Paralelo**:
   - Pestañas rápidas: **Activas**, **En Presupuesto**, **Finalizadas** y **Todas**.
   - Botón directo de **"Dar por Finalizada"** para congelar costes y archivar en el histórico.
2. **Dashboard 360° Individual por Obra**:
   - Presupuesto pactado (Bruto y Neto) vs Total Cobrado vs Pendiente de cobro.
   - Costes reales acumulados: **Materiales** + **Mano de obra (horas y metros)** + **Otros gastos**.
   - Beneficio limpio (€) y margen porcentual de rentabilidad en tiempo real.
3. **Catálogo Maestro Externo de Materiales**:
   - Registro independiente de materiales (placas, perfilería, pastas de juntas, tornillería, sacos, herramientas...).
   - Precios por metro, unidad o saco según proveedor (Bricomart, Saltoki, almacenes locales).
4. **Calculadora con Merma del +5% y Redondeo Superior Estricto**:
   - Introduce los metros medidos en la obra y calcula:
     $$\text{Metros con desperdicio} = \text{Metros} \times 1.05$$
     $$\text{Unidades a comprar} = \left\lceil \frac{\text{Metros con desperdicio}}{\text{Rendimiento por unidad}} \right\rceil$$
5. **Partes de Trabajo Duales (Móvil / 1 Clic)**:
   - **Por Horas**: Cómputo por tiempo invertido (ej. 8h x 15€/h = 120€).
   - **Por Metros / Destajo**: Cómputo por avance físico (ej. 20m de tabique x 8€/m = 160€).
   - Selector para el jefe (Mohsin) o para el empleado (Karim), con liquidación salarial automática.
6. **Finanzas, Brutos, Netos e IVA**:
   - Facturación con IVA (21%, 10%, 0%).
   - Balance trimestral estimado de IVA (IVA Repercutido - IVA Soportado).
7. **Dashboard General Inteligente**:
   - Métricas globales de facturación, beneficio neto y alertas de consumo de presupuesto.

---

## 🛠️ Cómo ejecutar en local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador (o emula un dispositivo móvil con F12).

---

## 🗄️ Configuración con Supabase (Opcional)

La aplicación funciona inmediatamente lista para usar gracias a su almacenamiento reactivo con datos de ejemplo precargados.

Para conectarla con tu proyecto en la nube de Supabase:
1. Copia el archivo `schema.sql` y pégalo en el **SQL Editor** de tu panel de Supabase.
2. Crea un archivo `.env.local` en la raíz con tus claves:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
   ```

---

## 🌐 Despliegue en Vercel

1. Sube este repositorio a tu cuenta de GitHub o GitLab.
2. Entra en [Vercel](https://vercel.com) y haz clic en **"Add New Project"**.
3. Selecciona este repositorio y pulsa **Deploy**.
4. ¡Listo! Vercel te dará un enlace HTTPS público accesible desde cualquier teléfono móvil o PC.

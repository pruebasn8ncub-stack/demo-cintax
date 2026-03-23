// Mock data for "Restaurante Don Pedro SpA" demo

export interface BusinessProfile {
  name: string;
  rut: string;
  regime: string;
  address: string;
  owner: string;
  industry: string;
  startDate: string;
}

export interface MonthlyFinancial {
  month: string;
  year: number;
  revenue: number;
  expenses: number;
}

export interface FinancialData {
  months: MonthlyFinancial[];
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  area: "cocina" | "servicio" | "admin" | "owner";
  salary: number;
  startDate: string;
}

export interface PendingObligation {
  id: string;
  name: string;
  dueDate: string;
  frequency: "mensual" | "anual";
  description: string;
}

export interface ActiveProcedure {
  id: string;
  name: string;
  status: "en_tramite" | "completado" | "pendiente_respuesta";
  progress: number;
  lastUpdate: string;
  nextStep: string;
}

export interface CalendarSlot {
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface CalendarAvailability {
  consultant: string;
  slots: CalendarSlot[];
}

export const businessProfile: BusinessProfile = {
  name: "Restaurante Don Pedro SpA",
  rut: "76.543.210-K",
  regime: "Pro-PYME (14D N°3)",
  address: "Av. Providencia 1234, Santiago",
  owner: "Pedro Muñoz",
  industry: "Servicios de alimentación",
  startDate: "2019-03-15",
};

export const financialData: FinancialData = {
  months: [
    { month: "Octubre", year: 2025, revenue: 11_200_000, expenses: 8_100_000 },
    {
      month: "Noviembre",
      year: 2025,
      revenue: 12_500_000,
      expenses: 8_700_000,
    },
    {
      month: "Diciembre",
      year: 2025,
      revenue: 14_300_000,
      expenses: 9_200_000,
    },
    { month: "Enero", year: 2026, revenue: 13_100_000, expenses: 8_800_000 },
    { month: "Febrero", year: 2026, revenue: 11_800_000, expenses: 8_400_000 },
    { month: "Marzo", year: 2026, revenue: 12_600_000, expenses: 8_600_000 },
  ],
};

export const employees: Employee[] = [
  {
    id: "EMP-001",
    name: "Pedro Muñoz",
    role: "Dueño / Gerente General",
    area: "owner",
    salary: 2_000_000,
    startDate: "2019-03-15",
  },
  {
    id: "EMP-002",
    name: "Carolina Soto",
    role: "Administradora",
    area: "admin",
    salary: 950_000,
    startDate: "2020-01-10",
  },
  {
    id: "EMP-003",
    name: "Roberto Henríquez",
    role: "Chef Principal",
    area: "cocina",
    salary: 1_100_000,
    startDate: "2019-04-01",
  },
  {
    id: "EMP-004",
    name: "Valentina Araya",
    role: "Cocinera",
    area: "cocina",
    salary: 700_000,
    startDate: "2021-06-15",
  },
  {
    id: "EMP-005",
    name: "Francisco Díaz",
    role: "Ayudante de Cocina",
    area: "cocina",
    salary: 500_000,
    startDate: "2023-02-20",
  },
  {
    id: "EMP-006",
    name: "Camila Reyes",
    role: "Jefa de Salón",
    area: "servicio",
    salary: 800_000,
    startDate: "2020-08-01",
  },
  {
    id: "EMP-007",
    name: "Tomás Fuentes",
    role: "Garzón",
    area: "servicio",
    salary: 550_000,
    startDate: "2022-11-10",
  },
  {
    id: "EMP-008",
    name: "Javiera Morales",
    role: "Garzona",
    area: "servicio",
    salary: 550_000,
    startDate: "2024-01-08",
  },
];

export const pendingObligations: PendingObligation[] = [
  {
    id: "OBL-001",
    name: "Declaración mensual F29 (IVA + PPM)",
    dueDate: "2026-04-12",
    frequency: "mensual",
    description:
      "Formulario 29 para declaración y pago mensual de IVA (débito - crédito fiscal) y Pagos Provisionales Mensuales (PPM). Vence el día 12 de cada mes.",
  },
  {
    id: "OBL-002",
    name: "Declaración anual de renta (F22)",
    dueDate: "2026-04-30",
    frequency: "anual",
    description:
      "Formulario 22 para la declaración anual de impuesto a la renta. Incluye base imponible, créditos, PPM acumulados y cálculo de devolución o pago.",
  },
  {
    id: "OBL-003",
    name: "Cotizaciones previsionales",
    dueDate: "2026-04-13",
    frequency: "mensual",
    description:
      "Pago de cotizaciones de AFP, salud (Fonasa/Isapre), seguro de cesantía (AFC) y seguro de accidentes del trabajo. Vence el día 13 de cada mes.",
  },
  {
    id: "OBL-004",
    name: "Libro de remuneraciones electrónico",
    dueDate: "2026-04-15",
    frequency: "mensual",
    description:
      "Envío del libro de remuneraciones electrónico a la Dirección del Trabajo (DT). Obligatorio para empleadores con 5 o más trabajadores.",
  },
];

export const activeProcedures: ActiveProcedure[] = [
  {
    id: "PROC-001",
    name: "Solicitud de devolución IVA exportador",
    status: "en_tramite",
    progress: 60,
    lastUpdate: "2026-03-10",
    nextStep:
      "Esperar resolución del SII. Plazo estimado: 15 días hábiles desde la última actualización.",
  },
  {
    id: "PROC-002",
    name: "Actualización de actividad económica en SII",
    status: "completado",
    progress: 100,
    lastUpdate: "2026-03-05",
    nextStep:
      "Trámite finalizado. Código de actividad actualizado a 561000 (Restaurantes y servicio móvil de comidas).",
  },
  {
    id: "PROC-003",
    name: "Fiscalización preventiva de nómina",
    status: "pendiente_respuesta",
    progress: 40,
    lastUpdate: "2026-03-18",
    nextStep:
      "Responder requerimiento de la Dirección del Trabajo con contratos actualizados y comprobantes de pago de cotizaciones. Plazo: 10 días hábiles.",
  },
];

function generateCalendarSlots(): CalendarSlot[] {
  const slots: CalendarSlot[] = [];
  const baseDate = new Date("2026-03-23");
  const bookedSlots = new Set([
    "2026-03-23-09:00",
    "2026-03-23-11:00",
    "2026-03-24-10:00",
    "2026-03-24-14:00",
    "2026-03-24-16:00",
    "2026-03-25-09:00",
    "2026-03-25-15:00",
    "2026-03-26-11:00",
    "2026-03-26-12:00",
    "2026-03-27-10:00",
    "2026-03-27-14:00",
    "2026-03-27-15:00",
    "2026-03-30-09:00",
    "2026-03-30-10:00",
    "2026-03-31-11:00",
    "2026-03-31-16:00",
    "2026-04-01-09:00",
    "2026-04-01-14:00",
    "2026-04-02-10:00",
    "2026-04-02-15:00",
    "2026-04-03-11:00",
    "2026-04-03-16:00",
    "2026-04-03-17:00",
  ]);

  for (let day = 0; day < 14; day++) {
    const current = new Date(baseDate);
    current.setDate(baseDate.getDate() + day);

    const dayOfWeek = current.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue; // skip weekends

    const dateStr = current.toISOString().split("T")[0];

    for (let hour = 9; hour < 18; hour++) {
      const startTime = `${String(hour).padStart(2, "0")}:00`;
      const endTime = `${String(hour + 1).padStart(2, "0")}:00`;
      const key = `${dateStr}-${startTime}`;

      slots.push({
        date: dateStr,
        startTime,
        endTime,
        available: !bookedSlots.has(key),
      });
    }
  }

  return slots;
}

export const calendarAvailability: CalendarAvailability = {
  consultant: "María González",
  slots: generateCalendarSlots(),
};

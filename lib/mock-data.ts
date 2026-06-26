// Mock data for Health Grid Patient Portal

import type { Recipe } from './types/recipes'
import type { UpcomingAppointment } from './api/appointments'
import type { LabResult } from './api/labResults'

export const currentPatient = {
  id: 101,
  name: "María Elena",
  surname: "González",
  password: "123456",
  dni: "28.345.671",
  dateOfBirth: "1985-07-14",
  bloodType: "A+",
  phone: "+54 11 4567-8901",
  email: "test@email.com",
  obraSocial: "OSDE 310",
  affiliateNumber: "4-4231-0987654/01",
  avatar: null,
}

export const upcomingAppointments: UpcomingAppointment[] = [
  {
    id: 'TUR-8821',
    doctor: 'Dr. Carlos Peralta',
    specialty: 'Cardiología',
    date: '2026-03-24',
    time: '09:30',
    location: 'Consultorio 4B',
    modality: 'presencial',
    status: 'confirmado',
  },
  {
    id: 'TUR-8952',
    doctor: 'Dra. Laura Vásquez',
    specialty: 'Clínica Médica',
    date: '2026-04-02',
    time: '11:00',
    location: 'Sala Virtual',
    modality: 'virtual',
    status: 'confirmado',
  },
  {
    id: 'TUR-9014',
    doctor: 'Dr. Martín Rodríguez',
    specialty: 'Traumatología',
    date: '2026-04-10',
    time: '14:45',
    location: 'Consultorio 7A',
    modality: 'presencial',
    status: 'pendiente',
  },
]

export const labResults: LabResult[] = [
  {
    _id: 'LAB-2241',
    id: 2241,
    pacienteId: 101,
    pacienteNombre: 'María Elena González',
    pacienteDni: '28.345.671',
    pacienteEdad: 41,
    pacienteSexo: 'F',
    medicoId: 5,
    fechaSolicitud: '2026-03-10T08:30:00.000Z',
    estado: '3',
    prioridad: 'normal',
    origen: 'consultorio',
    estudiosSolicitados: [
      {
        id: 1,
        nombre: 'Hemograma completo',
        descripcion: 'Análisis completo de sangre',
      },
    ],
    resultados: [
      {
        id: 1,
        analitoId: 101,
        nombreAnalito: 'Glóbulos rojos',
        codigoAnalito: 'RBC',
        valor: 4.8,
        unidadMedida: 'mill/μL',
        fueraDeRango: false,
        esCritico: false,
        fechaCarga: '2026-03-10T10:00:00.000Z',
        rangosReferencia: [{ valorMinimo: 4.2, valorMaximo: 5.4, sexo: 'F' }],
      },
      {
        id: 2,
        analitoId: 102,
        nombreAnalito: 'Hemoglobina',
        codigoAnalito: 'HGB',
        valor: 14.2,
        unidadMedida: 'g/dL',
        fueraDeRango: false,
        esCritico: false,
        fechaCarga: '2026-03-10T10:00:00.000Z',
        rangosReferencia: [{ valorMinimo: 12, valorMaximo: 16, sexo: 'F' }],
      },
    ],
  },
  {
    _id: 'LAB-2198',
    id: 2198,
    pacienteId: 101,
    pacienteNombre: 'María Elena González',
    pacienteDni: '28.345.671',
    pacienteEdad: 41,
    pacienteSexo: 'F',
    medicoId: 4,
    fechaSolicitud: '2026-03-10T09:00:00.000Z',
    estado: '3',
    prioridad: 'urgente',
    origen: 'consultorio',
    estudiosSolicitados: [
      {
        id: 2,
        nombre: 'Perfil lipídico',
        descripcion: 'Análisis de lípidos en sangre',
      },
    ],
    resultados: [
      {
        id: 3,
        analitoId: 201,
        nombreAnalito: 'Colesterol total',
        codigoAnalito: 'CHOL',
        valor: 238,
        unidadMedida: 'mg/dL',
        fueraDeRango: true,
        esCritico: true,
        fechaCarga: '2026-03-10T11:30:00.000Z',
        observacionTecnica: 'Valor elevado, requiere control',
        rangosReferencia: [{ valorMinimo: 0, valorMaximo: 200, sexo: 'F' }],
      },
      {
        id: 4,
        analitoId: 202,
        nombreAnalito: 'LDL',
        codigoAnalito: 'LDL',
        valor: 158,
        unidadMedida: 'mg/dL',
        fueraDeRango: true,
        esCritico: false,
        fechaCarga: '2026-03-10T11:30:00.000Z',
        rangosReferencia: [{ valorMinimo: 0, valorMaximo: 130, sexo: 'F' }],
      },
    ],
  },
]

export const prescriptionHistory: Recipe[] = [
  {
    _id: 'REC-551',
    id_receta: 551,
    id_paciente: 101,
    medicamento: 'Enalapril 10mg',
    indicaciones: 'Tomar 1 comprimido cada 12 hs durante 30 días',
    estado: 'VIGENTE',
    medicoId: 'Dra. Laura Vásquez',
    dosis: '10 mg',
    fechaEmision: '2026-02-28T10:00:00.000Z',
    alertas_farmacologicas: [
      { tipo: 'Interacción', descripcion: 'No combinar con AINEs sin consultar.' },
    ],
    createdAt: '2026-02-28T10:00:00.000Z',
    updatedAt: '2026-02-28T10:00:00.000Z',
  },
  {
    _id: 'REC-489',
    id_receta: 489,
    id_paciente: 101,
    medicamento: 'Aspirina 100mg',
    indicaciones: 'Tomar 1 comprimido diario con el desayuno',
    estado: 'VIGENTE',
    medicoId: 'Dr. Carlos Peralta',
    dosis: '100 mg',
    fechaEmision: '2026-01-15T09:30:00.000Z',
    createdAt: '2026-01-15T09:30:00.000Z',
    updatedAt: '2026-01-15T09:30:00.000Z',
  },
  {
    _id: 'REC-412',
    id_receta: 412,
    id_paciente: 101,
    medicamento: 'Amoxicilina 500mg',
    indicaciones: 'Tomar 1 comprimido cada 8 hs por 7 días',
    estado: 'VENCIDA',
    medicoId: 'Dra. Ana Morales',
    dosis: '500 mg',
    fechaEmision: '2025-11-20T11:15:00.000Z',
    createdAt: '2025-11-20T11:15:00.000Z',
    updatedAt: '2025-11-20T11:15:00.000Z',
  },
]

export const notifications = [
  {
    id: "NOT-001",
    type: "resultado",
    title: "Resultado de laboratorio disponible",
    message: "Su perfil lipídico del 10/03 ya está disponible para consultar.",
    time: "Hace 2 horas",
    read: false,
    urgent: true,
  },
  {
    id: "NOT-002",
    type: "turno",
    title: "Recordatorio de turno",
    message: "Mañana tiene turno con Dr. Carlos Peralta a las 09:30 hs.",
    time: "Hace 5 horas",
    read: false,
    urgent: false,
  },
  {
    id: "NOT-003",
    type: "receta",
    title: "Receta lista para retirar",
    message: "Su receta REC-551 fue enviada a la farmacia de guardia.",
    time: "Ayer",
    read: true,
    urgent: false,
  },
  {
    id: "NOT-004",
    type: "pago",
    title: "Pago confirmado",
    message: "Se procesó el pago del coseguro de $4.500 para el turno TUR-8821.",
    time: "Hace 2 días",
    read: true,
    urgent: false,
  },
]

export const paymentHistory = [
  {
    id: "PAG-9921",
    concept: "Coseguro — Cardiología",
    turno: "TUR-8821",
    amount: 4500,
    date: "2026-03-16",
    method: "Visa •••• 4521",
    status: "aprobado",
  },
  {
    id: "PAG-9870",
    concept: "Turno — Clínica Médica",
    turno: "TUR-8952",
    amount: 0,
    date: "2026-03-12",
    method: "OSDE — cubierto",
    status: "cubierto",
  },
  {
    id: "PAG-9744",
    concept: "Coseguro — Laboratorio",
    turno: "LAB-2241",
    amount: 2800,
    date: "2026-03-08",
    method: "Mercado Pago",
    status: "aprobado",
  },
]

export const pendingPayments = [
  {
    id: "PEN-001",
    concept: "Coseguro — Traumatología",
    turno: "TUR-9014",
    amount: 5200,
    dueDate: "2026-04-10",
    doctor: "Dr. Martín Rodríguez",
  },
]

export const mockPayments = [
  {
    _id: "PAG-9921",
    pacienteId: "101",
    concepto: "Coseguro — Cardiología",
    monto: 4500,
    numeroFactura: "FAC-00018821",
    metodoPago: "TARJETA" as const,
    estado: "APROBADO" as const,
    fechaPago: "2026-03-16T10:30:00.000Z",
    createdAt: "2026-03-16T10:30:00.000Z",
    turnoId: {
      _id: "TUR-8821",
      medicoId: "Dr. Carlos Peralta",
      especialidad: "Cardiología",
      fechaHora: "2026-03-24T09:30:00.000Z",
      sede: "Consultorio 4B",
      tipo: "Presencial"
    }
  },
  {
    _id: "PAG-9870",
    pacienteId: "101",
    concepto: "Turno — Clínica Médica",
    monto: 0,
    numeroFactura: "FAC-00018952",
    metodoPago: undefined,
    estado: "CUBIERTO" as const,
    fechaPago: "2026-03-12T11:00:00.000Z",
    createdAt: "2026-03-12T11:00:00.000Z",
    turnoId: {
      _id: "TUR-8952",
      medicoId: "Dra. Laura Vásquez",
      especialidad: "Clínica Médica",
      fechaHora: "2026-04-02T11:00:00.000Z",
      sede: "Sala Virtual",
      tipo: "Virtual"
    }
  },
  {
    _id: "PAG-9744",
    pacienteId: "101",
    concepto: "Coseguro — Laboratorio",
    monto: 2800,
    numeroFactura: "FAC-00012241",
    metodoPago: "BILLETERA_VIRTUAL" as const,
    estado: "APROBADO" as const,
    fechaPago: "2026-03-08T09:00:00.000Z",
    createdAt: "2026-03-08T09:00:00.000Z",
    turnoId: {
      _id: "LAB-2241",
      medicoId: "Dra. Laura Vásquez",
      especialidad: "Análisis Clínicos",
      fechaHora: "2026-03-10T08:30:00.000Z",
      sede: "Laboratorio Central",
      tipo: "Presencial"
    }
  },
  {
    _id: "PEN-001",
    pacienteId: "101",
    concepto: "Coseguro — Traumatología",
    monto: 5200,
    metodoPago: undefined,
    estado: "PENDIENTE" as const,
    createdAt: "2026-03-20T14:45:00.000Z",
    turnoId: {
      _id: "TUR-9014",
      medicoId: "Dr. Martín Rodríguez",
      especialidad: "Traumatología",
      fechaHora: "2026-04-10T14:45:00.000Z",
      sede: "Consultorio 7A",
      tipo: "Presencial"
    }
  },
  {
    _id: "PEN-002",
    pacienteId: "101",
    concepto: "Coseguro — Pediatría",
    monto: 3500,
    metodoPago: undefined,
    estado: "PENDIENTE" as const,
    createdAt: "2026-03-22T16:00:00.000Z",
    turnoId: {
      _id: "TUR-9102",
      medicoId: "Dra. Ana Morales",
      especialidad: "Pediatría",
      fechaHora: "2026-04-15T16:00:00.000Z",
      sede: "Consultorio 2C",
      tipo: "Presencial"
    }
  }
]

export type Recipe = {
  _id: string
  pacienteId: string
  medicoId: string
  medicamento: string
  dosis: string
  indicaciones: string
  fechaEmision: string
  estado: 'VIGENTE' | 'VENCIDA'
  createdAt: string
  updatedAt: string
}

export type Medication = {
  name: string
  dose: string
  instructions: string
  quantity: string
}
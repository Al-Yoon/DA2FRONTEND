import { useMemo, useState } from 'react'
import { CalendarDays, Clock3, ShieldAlert, ShieldCheck, Stethoscope, Trash2, UserRoundPlus } from 'lucide-react'
import { currentPatient } from '@/lib/mock-data'
import { getInitialVirtualMeetings, saveVirtualMeetings, type VirtualMeeting } from '@/lib/virtual-meetings'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type AvailabilitySlot = {
  date: string
  time: string
}

type Professional = {
  id: string
  name: string
  specialty: string
  acceptedInsurances: string[]
  availability: AvailabilitySlot[]
}

const professionals: Professional[] = [
  {
    id: 'PRO-101',
    name: 'Dra. Laura Vasquez',
    specialty: 'Clinica Medica',
    acceptedInsurances: ['OSDE 310', 'Swiss Medical SMG20', 'Galeno Oro'],
    availability: [
      { date: '2026-04-03', time: '10:00' },
      { date: '2026-04-03', time: '11:30' },
      { date: '2026-04-04', time: '09:00' },
    ],
  },
  {
    id: 'PRO-102',
    name: 'Dr. Martin Rodriguez',
    specialty: 'Traumatologia',
    acceptedInsurances: ['IOMA', 'PAMI'],
    availability: [
      { date: '2026-04-05', time: '15:00' },
      { date: '2026-04-06', time: '16:30' },
    ],
  },
  {
    id: 'PRO-103',
    name: 'Dra. Florencia Mendez',
    specialty: 'Dermatologia',
    acceptedInsurances: ['OSDE 310', 'Medife Plata'],
    availability: [
      { date: '2026-04-04', time: '14:00' },
      { date: '2026-04-04', time: '15:00' },
      { date: '2026-04-07', time: '10:30' },
    ],
  },
]

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: 'short' })
}

export function SalaVirtualPage() {
  const [selectedProfessionalId, setSelectedProfessionalId] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [reason, setReason] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [meetings, setMeetings] = useState<VirtualMeeting[]>(() => getInitialVirtualMeetings())

  const selectedProfessional = useMemo(
    () => professionals.find((professional) => professional.id === selectedProfessionalId),
    [selectedProfessionalId]
  )

  const availableDates = useMemo(() => {
    if (!selectedProfessional) return []
    return [...new Set(selectedProfessional.availability.map((slot) => slot.date))]
  }, [selectedProfessional])

  const availableTimes = useMemo(() => {
    if (!selectedProfessional || !selectedDate) return []

    const bookedTimesForProfessional = meetings
      .filter(
        (meeting) => meeting.professional === selectedProfessional.name && meeting.date === selectedDate
      )
      .map((meeting) => meeting.time)

    return selectedProfessional.availability
      .filter((slot) => slot.date === selectedDate)
      .filter((slot) => !bookedTimesForProfessional.includes(slot.time))
      .map((slot) => slot.time)
  }, [meetings, selectedDate, selectedProfessional])

  const insuranceMatch =
    !!selectedProfessional && selectedProfessional.acceptedInsurances.includes(currentPatient.obraSocial)

  const availabilityMatch =
    !!selectedProfessional &&
    selectedProfessional.availability.some((slot) => slot.date === selectedDate && slot.time === selectedTime)

  const alreadyBookedMatch =
    !!selectedProfessional &&
    meetings.some(
      (meeting) =>
        meeting.professional === selectedProfessional.name &&
        meeting.date === selectedDate &&
        meeting.time === selectedTime
    )

  const canSchedule =
    !!selectedProfessional &&
    !!selectedDate &&
    !!selectedTime &&
    insuranceMatch &&
    availabilityMatch &&
    !alreadyBookedMatch

  const resetDateAndTime = () => {
    setSelectedDate('')
    setSelectedTime('')
  }

  const handleSchedule = () => {
    if (!selectedProfessional) {
      setStatusMessage('Primero elegi un profesional.')
      return
    }

    if (!insuranceMatch) {
      setStatusMessage('No se puede agendar: la obra social del cliente no esta cubierta por este profesional.')
      return
    }

    if (!availabilityMatch) {
      setStatusMessage('No se puede agendar: el horario elegido no esta disponible.')
      return
    }

    if (alreadyBookedMatch) {
      setStatusMessage('No se puede agendar: ese profesional ya tiene una reunion en ese horario.')
      return
    }

    const newMeeting: VirtualMeeting = {
      id: `TUR-${Date.now()}`,
      professional: selectedProfessional.name,
      specialty: selectedProfessional.specialty,
      date: selectedDate,
      time: selectedTime,
      status: 'confirmada',
    }

    setMeetings((current) => {
      const updatedMeetings = [newMeeting, ...current]
      saveVirtualMeetings(updatedMeetings)
      return updatedMeetings
    })
    setReason('')
    setStatusMessage('Reunion agendada con exito. Coinciden disponibilidad y cobertura de obra social.')

    setSelectedProfessionalId('')
    resetDateAndTime()
  }

  const handleDeleteMeeting = (meetingId: string) => {
    setMeetings((current) => {
      const updatedMeetings = current.filter((meeting) => meeting.id !== meetingId)
      saveVirtualMeetings(updatedMeetings)
      return updatedMeetings
    })
    setStatusMessage('Reunion eliminada de la agenda.')
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <p className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Portal del Paciente</p>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground text-balance">Agenda de Sala Virtual</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Programa una reunion con un profesional segun su disponibilidad y la cobertura de tu obra social.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <Card className="border-border shadow-none xl:col-span-2">
          <CardHeader>
            <CardTitle className="font-serif text-lg font-bold">Nueva reunion virtual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Profesional</label>
                <div className="relative">
                  <Stethoscope className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    className="w-full h-9 appearance-none rounded-md border border-input bg-transparent pl-10 pr-10 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    value={selectedProfessionalId}
                    onChange={(event) => {
                      setSelectedProfessionalId(event.target.value)
                      resetDateAndTime()
                      setStatusMessage('')
                    }}
                  >
                    <option value="">Seleccionar profesional</option>
                    {professionals.map((professional) => (
                      <option key={professional.id} value={professional.id}>
                        {professional.name} - {professional.specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Fecha</label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    className="w-full h-9 appearance-none rounded-md border border-input bg-transparent pl-10 pr-10 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"
                    value={selectedDate}
                    disabled={!selectedProfessional}
                    onChange={(event) => {
                      setSelectedDate(event.target.value)
                      setSelectedTime('')
                      setStatusMessage('')
                    }}
                  >
                    <option value="">Seleccionar fecha</option>
                    {availableDates.map((date) => (
                      <option key={date} value={date}>
                        {formatDate(date)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Horario</label>
                <div className="relative">
                  <Clock3 className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    className="w-full h-9 appearance-none rounded-md border border-input bg-transparent pl-10 pr-10 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"
                    value={selectedTime}
                    disabled={!selectedDate}
                    onChange={(event) => {
                      setSelectedTime(event.target.value)
                      setStatusMessage('')
                    }}
                  >
                    <option value="">Seleccionar horario</option>
                    {availableTimes.map((time) => (
                      <option key={time} value={time}>
                        {time} hs
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Obra social del cliente</label>
                <Input value={currentPatient.obraSocial} readOnly className="bg-muted" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Motivo de la consulta (opcional)</label>
              <Textarea
                placeholder="Ej: control de sintomas, renovacion de receta, seguimiento de estudio..."
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
            </div>

            <div
              className={cn(
                'rounded-lg border p-3 flex items-start gap-3',
                insuranceMatch ? 'border-primary/30 bg-primary/5' : 'border-destructive/30 bg-destructive/5'
              )}
            >
              {insuranceMatch ? (
                <ShieldCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="text-sm font-medium text-foreground">Validacion de cobertura</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedProfessional
                    ? insuranceMatch
                      ? 'La obra social es compatible con el profesional seleccionado.'
                      : 'La obra social no coincide con la cartilla de este profesional.'
                    : 'Selecciona un profesional para validar si tu obra social es compatible.'}
                </p>
              </div>
            </div>

            {statusMessage && (
              <p
                className={cn(
                  'text-sm rounded-md px-3 py-2',
                  statusMessage.includes('exito')
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'bg-destructive/10 text-destructive border border-destructive/30'
                )}
              >
                {statusMessage}
              </p>
            )}

            <Button className="w-full sm:w-auto" onClick={handleSchedule} disabled={!canSchedule}>
              <UserRoundPlus className="w-4 h-4 mr-2" />
              Agendar reunion
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-base font-bold">Criterios de agendado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>1. El profesional debe tener disponibilidad en la fecha y hora elegidas.</p>
              <p>2. La obra social del cliente debe estar dentro de las coberturas aceptadas por el profesional.</p>

            </CardContent>
          </Card>

          <Card className="border-border shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-base font-bold">Reuniones programadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {meetings.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay reuniones agendadas todavia.</p>
              ) : (
                meetings.map((meeting) => (
                  <div key={meeting.id} className="rounded-lg border border-border p-3 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm text-foreground truncate">{meeting.professional}</p>
                      <Badge variant="outline" className="text-xs">
                        {meeting.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{meeting.specialty}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(meeting.date)} - {meeting.time} hs
                    </p>
                    <div className="pt-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteMeeting(meeting.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Cancelar reunion
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
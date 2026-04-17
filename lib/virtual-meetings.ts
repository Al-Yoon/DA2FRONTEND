import { upcomingAppointments } from '@/lib/mock-data'

export type VirtualMeeting = {
  id: string
  professional: string
  specialty: string
  date: string
  time: string
  status: 'confirmada'
}

const STORAGE_KEY = 'virtualMeetings'

const baseVirtualMeetings: VirtualMeeting[] = upcomingAppointments
  .filter((appointment) => appointment.modality === 'virtual')
  .map((appointment) => ({
    id: appointment.id,
    professional: appointment.doctor,
    specialty: appointment.specialty,
    date: appointment.date,
    time: appointment.time,
    status: 'confirmada' as const,
  }))

export function getInitialVirtualMeetings(): VirtualMeeting[] {
  if (typeof window === 'undefined') {
    return baseVirtualMeetings
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)

    if (!stored) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(baseVirtualMeetings))
      return baseVirtualMeetings
    }

    const parsed = JSON.parse(stored)

    if (!Array.isArray(parsed)) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(baseVirtualMeetings))
      return baseVirtualMeetings
    }

    return parsed as VirtualMeeting[]
  } catch {
    return baseVirtualMeetings
  }
}

export function saveVirtualMeetings(meetings: VirtualMeeting[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings))
}

export function toUpcomingAppointment(meeting: VirtualMeeting) {
  return {
    id: meeting.id,
    doctor: meeting.professional,
    specialty: meeting.specialty,
    date: meeting.date,
    time: meeting.time,
    location: 'Sala Virtual',
    modality: 'virtual' as const,
    status: 'confirmado' as const,
  }
}
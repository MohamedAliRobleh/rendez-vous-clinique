import { useMemo } from 'react'
import { useApp } from '../context/AppContext'

export function useAppointments({ search = '', statut = 'Tous' } = {}) {
  const { appointments, addAppointment, updateAppointmentStatus } = useApp()

  const filtered = useMemo(() => {
    return appointments.filter(a => {
      const matchSearch =
        !search ||
        a.patient.toLowerCase().includes(search.toLowerCase()) ||
        a.docteur.toLowerCase().includes(search.toLowerCase()) ||
        a.ref.toLowerCase().includes(search.toLowerCase())
      const matchStatut = statut === 'Tous' || a.statut === statut
      return matchSearch && matchStatut
    })
  }, [appointments, search, statut])

  const kpis = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return {
      total:      appointments.length,
      today:      appointments.filter(a => a.date === today).length,
      enAttente:  appointments.filter(a => a.statut === 'en attente').length,
      confirmes:  appointments.filter(a => a.statut === 'confirmé').length,
    }
  }, [appointments])

  const upcoming = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return [...appointments]
      .filter(a => a.date >= today && a.statut !== 'annulé')
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5)
  }, [appointments])

  return { appointments: filtered, allAppointments: appointments, kpis, upcoming, addAppointment, updateAppointmentStatus }
}

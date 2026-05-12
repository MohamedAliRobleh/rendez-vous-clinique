import { createContext, useContext, useState, useEffect } from 'react'
import { DOCTORS, APPOINTMENTS_INITIAL, ADMIN_CREDENTIALS } from '../data/mockData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem('rdv_data')
      return saved ? JSON.parse(saved) : APPOINTMENTS_INITIAL
    } catch {
      return APPOINTMENTS_INITIAL
    }
  })

  const [doctors, setDoctors] = useState(() => {
    try {
      const saved = localStorage.getItem('doctors_data')
      return saved ? JSON.parse(saved) : DOCTORS
    } catch {
      return DOCTORS
    }
  })

  useEffect(() => {
    localStorage.setItem('rdv_data', JSON.stringify(appointments))
  }, [appointments])

  useEffect(() => {
    localStorage.setItem('doctors_data', JSON.stringify(doctors))
  }, [doctors])

  const addAppointment = (rdv) => {
    // TODO PRODUCTION: await supabase.from('appointments').insert({ ...rdv })
    setAppointments(prev => [rdv, ...prev])
  }

  const updateAppointmentStatus = (id, statut) => {
    // TODO PRODUCTION: await supabase.from('appointments').update({ statut }).eq('id', id)
    setAppointments(prev =>
      prev.map(a => (a.id === id ? { ...a, statut } : a))
    )
  }

  const addDoctor = (doctor) => {
    setDoctors(prev => [...prev, { ...doctor, id: Date.now(), actif: true, rating: 5.0, consultations: 0 }])
  }

  const updateDoctor = (id, updates) => {
    setDoctors(prev => prev.map(d => (d.id === id ? { ...d, ...updates } : d)))
  }

  const toggleDoctorActive = (id) => {
    setDoctors(prev => prev.map(d => (d.id === id ? { ...d, actif: !d.actif } : d)))
  }

  const login = (email, password) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('isAdmin', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('isAdmin')
  }

  return (
    <AppContext.Provider value={{
      appointments,
      doctors,
      addAppointment,
      updateAppointmentStatus,
      addDoctor,
      updateDoctor,
      toggleDoctorActive,
      login,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}

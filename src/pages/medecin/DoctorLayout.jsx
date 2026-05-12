import { Outlet } from 'react-router-dom'
import DoctorSidebar from '../../components/layout/DoctorSidebar'
import { useApp } from '../../context/AppContext'

export default function DoctorLayout() {
  const { doctors, medecinId } = useApp()
  const doctor = doctors.find(d => d.id === medecinId)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <DoctorSidebar />
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Topbar */}
        <div style={{
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--border)', padding: '0 28px',
          height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Clinique Al-Baraka · Médecin
          </span>
          {doctor && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)' }}>{doctor.nom}</span>
              <span style={{ background: 'rgba(10,110,116,0.1)', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{doctor.specialite}</span>
            </div>
          )}
        </div>

        {/* Page content */}
        <main style={{ padding: '28px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'
import DoctorSidebar from '../../components/layout/DoctorSidebar'
import useWindowWidth from '../../hooks/useWindowWidth'
import { useApp } from '../../context/AppContext'

export default function DoctorLayout() {
  const { doctors, medecinId } = useApp()
  const doctor   = doctors.find(d => d.id === medecinId)
  const width    = useWindowWidth()
  const isMobile = width < 768
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 999,
          }}
        />
      )}

      <DoctorSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      <div style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        <div style={{
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--border)', padding: '0 20px',
          height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--primary)', display: 'flex', alignItems: 'center' }}
              >
                <FaBars size={20} />
              </button>
            )}
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Clinique Al-Baraka · Médecin
            </span>
          </div>
          {doctor && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)' }}>{doctor.nom}</span>
              {!isMobile && (
                <span style={{ background: 'rgba(10,110,116,0.1)', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                  {doctor.specialite}
                </span>
              )}
            </div>
          )}
        </div>

        <main style={{ padding: isMobile ? '16px' : '28px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'
import AdminSidebar from '../../components/layout/AdminSidebar'
import useWindowWidth from '../../hooks/useWindowWidth'

export default function AdminLayout() {
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

      <AdminSidebar
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
              Clinique Al-Baraka · Admin
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),var(--primary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '0.85rem' }}>
              A
            </div>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)' }}>Admin</span>
          </div>
        </div>

        <main style={{ padding: isMobile ? '16px' : '28px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

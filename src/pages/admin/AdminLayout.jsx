import { Outlet } from 'react-router-dom'
import AdminSidebar from '../../components/layout/AdminSidebar'

export default function AdminLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <AdminSidebar />
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Topbar */}
        <div style={{
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--border)', padding: '0 28px',
          height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Clinique Al-Baraka · Admin
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),var(--primary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '0.85rem' }}>
              A
            </div>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)' }}>Admin</span>
          </div>
        </div>

        {/* Page content */}
        <main style={{ padding: '28px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

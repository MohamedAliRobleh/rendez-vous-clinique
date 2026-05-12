import { NavLink, useNavigate } from 'react-router-dom'
import { FaTachometerAlt, FaCalendarAlt, FaUserMd, FaSignOutAlt, FaHospital, FaTimes } from 'react-icons/fa'
import { useApp } from '../../context/AppContext'

const NAV_LINKS = [
  { to: '/admin',             icon: FaTachometerAlt, label: 'Tableau de bord', end: true },
  { to: '/admin/rendez-vous', icon: FaCalendarAlt,  label: 'Rendez-vous' },
  { to: '/admin/medecins',    icon: FaUserMd,       label: 'Médecins' },
]

export default function AdminSidebar({ open, onClose, isMobile }) {
  const { logout } = useApp()
  const navigate   = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  const asideStyle = isMobile ? {
    width: 260, height: '100vh', flexShrink: 0,
    background: 'linear-gradient(180deg, #0A6E74 0%, #074E53 100%)',
    display: 'flex', flexDirection: 'column',
    boxShadow: '4px 0 24px rgba(10,110,116,0.22)',
    position: 'fixed', top: 0, left: 0, zIndex: 1000,
    transform: open ? 'translateX(0)' : 'translateX(-260px)',
    transition: 'transform 0.28s ease',
    overflowY: 'auto',
  } : {
    width: 260, minHeight: '100vh', flexShrink: 0,
    background: 'linear-gradient(180deg, #0A6E74 0%, #074E53 100%)',
    display: 'flex', flexDirection: 'column',
    boxShadow: '4px 0 24px rgba(10,110,116,0.22)',
    position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
  }

  return (
    <aside style={asideStyle}>
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaHospital size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, color: '#fff', fontSize: '0.98rem', lineHeight: 1.2 }}>Al-Baraka</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)' }}>Administration</div>
            </div>
          </div>
          {isMobile && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: 4, display: 'flex', alignItems: 'center' }}>
              <FaTimes size={18} />
            </button>
          )}
        </div>
      </div>

      <nav style={{ flex: 1, padding: '14px 10px' }}>
        <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase', padding: '6px 10px 10px' }}>
          Menu principal
        </div>
        {NAV_LINKS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to} to={to} end={end}
            onClick={isMobile ? onClose : undefined}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 14px', borderRadius: 10, marginBottom: 3,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.62)',
              background: isActive ? 'rgba(255,255,255,0.18)' : 'transparent',
              fontWeight: isActive ? 700 : 500, fontSize: '0.88rem',
              textDecoration: 'none', transition: 'var(--transition)',
            })}
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '12px 10px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
            background: 'rgba(224,92,92,0.18)', border: '1px solid rgba(224,92,92,0.28)',
            color: '#ffaaaa', fontWeight: 600, fontSize: '0.88rem',
            transition: 'var(--transition)',
          }}
        >
          <FaSignOutAlt size={14} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}

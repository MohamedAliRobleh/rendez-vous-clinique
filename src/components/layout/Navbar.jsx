import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FaCalendarAlt, FaBars, FaTimes, FaHospital } from 'react-icons/fa'

export default function Navbar({ noSpacer = false }) {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [['/', 'Accueil'], ['/medecins', 'Médecins'], ['/rendez-vous', 'Rendez-vous']]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        boxShadow: scrolled ? 'var(--shadow)' : 'none',
        transition: 'var(--transition)',
        padding: '0 5%',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,var(--primary),var(--primary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: scrolled ? 'var(--glow-primary)' : 'none' }}>
              <FaHospital size={17} color="#fff" />
            </div>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '1.1rem', color: scrolled ? 'var(--primary)' : '#fff' }}>
              Al-Baraka
            </span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }} className="d-none d-md-flex">
            {navLinks.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
                color: isActive ? 'var(--accent)' : scrolled ? 'var(--text)' : 'rgba(255,255,255,0.92)',
                fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
                transition: 'var(--transition)',
              })}>
                {label}
              </NavLink>
            ))}
            <button className="btn-accent-custom" style={{ padding: '8px 22px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => navigate('/rendez-vous')}>
              <FaCalendarAlt size={12} />
              Prendre RDV
            </button>
          </div>

          {/* Mobile burger */}
          <button
            className="d-md-none"
            aria-label="Menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: scrolled ? 'var(--text)' : '#fff', padding: 4 }}
            onClick={() => setMenuOpen(o => !o)}
          >
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', padding: '12px 5% 20px', borderTop: '1px solid var(--border)' }}>
            {navLinks.map(([to, label]) => (
              <Link key={to} to={to} style={{ display: 'block', padding: '11px 0', color: 'var(--text)', fontWeight: 600, borderBottom: '1px solid var(--border)', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            ))}
            <button className="btn-accent-custom" style={{ width: '100%', marginTop: 14 }} onClick={() => { navigate('/rendez-vous'); setMenuOpen(false) }}>
              Prendre RDV
            </button>
          </div>
        )}
      </nav>
      {/* Spacer pour les pages non-hero (sauf Home qui gère son propre padding) */}
      {!noSpacer && <div style={{ height: 68 }} />}
    </>
  )
}

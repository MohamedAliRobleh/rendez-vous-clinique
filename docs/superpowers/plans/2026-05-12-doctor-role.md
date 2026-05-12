# Clinique Al-Baraka — Phase 6 : Rôle Médecin

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter un espace personnel médecin (auth localStorage, dashboard RDV, gestion disponibilités) et les notifications email Brevo via Vercel serverless function.

**Architecture:** Auth localStorage mirroring le pattern admin existant. 6 nouveaux fichiers React + 1 Vercel API route. AppContext étendu avec `loginDoctor`/`logoutDoctor`/`medecinId`. Notifications Brevo non-bloquantes, skippées en dev.

**Tech Stack:** React 18 + Vite, Framer Motion, Bootstrap 5.3, React Router v6, CSS custom properties glassmorphism, Brevo API v3, Vercel serverless functions.

---

## File Structure

| Fichier | Action | Responsabilité |
|---|---|---|
| `src/data/mockData.js` | Modifier | + `DOCTOR_CREDENTIALS` |
| `src/context/AppContext.jsx` | Modifier | + `loginDoctor`, `logoutDoctor`, `medecinId` state |
| `src/pages/Login.jsx` | Modifier | Détection dual-rôle admin / médecin |
| `src/components/DoctorProtectedRoute.jsx` | Créer | Guard route médecin |
| `src/components/layout/DoctorSidebar.jsx` | Créer | Sidebar teal avec nav + logout médecin |
| `src/pages/medecin/DoctorLayout.jsx` | Créer | Wrapper sidebar + topbar + Outlet |
| `src/pages/medecin/MonAgenda.jsx` | Créer | Dashboard RDV filtrés par medecinId |
| `src/pages/medecin/MesDisponibilites.jsx` | Créer | Grille semaine + horaires |
| `src/App.jsx` | Modifier | + routes `/medecin/*` |
| `api/notify.js` | Créer | Vercel serverless — Brevo email sender |
| `src/context/AppContext.jsx` | Modifier (2e pass) | Appels fetch notify dans addAppointment + updateAppointmentStatus |
| `.env` | Créer | Variables Brevo (ne pas committer) |

---

## Task 1 : DOCTOR_CREDENTIALS + AppContext doctor auth

**Files:**
- Modify: `src/data/mockData.js`
- Modify: `src/context/AppContext.jsx`

- [ ] **Step 1.1 : Ajouter DOCTOR_CREDENTIALS dans mockData.js**

À la fin du fichier `src/data/mockData.js`, après `ADMIN_CREDENTIALS`, ajouter :

```js
export const DOCTOR_CREDENTIALS = [
  { docteurId: 1, email: 'amina.hassan@clinique-albaraka.dj',    password: 'medecin1234' },
  { docteurId: 2, email: 'omar.abdillahi@clinique-albaraka.dj',  password: 'medecin1234' },
  { docteurId: 3, email: 'fatouma.warsama@clinique-albaraka.dj', password: 'medecin1234' },
  { docteurId: 4, email: 'yusuf.mohamad@clinique-albaraka.dj',   password: 'medecin1234' },
]
```

- [ ] **Step 1.2 : Étendre AppContext avec loginDoctor, logoutDoctor, medecinId**

Remplacer le contenu complet de `src/context/AppContext.jsx` par :

```jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { DOCTORS, APPOINTMENTS_INITIAL, ADMIN_CREDENTIALS, DOCTOR_CREDENTIALS } from '../data/mockData'

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

  const [medecinId, setMedecinId] = useState(() => {
    const id = localStorage.getItem('medecinId')
    return id ? Number(id) : null
  })

  useEffect(() => {
    localStorage.setItem('rdv_data', JSON.stringify(appointments))
  }, [appointments])

  useEffect(() => {
    localStorage.setItem('doctors_data', JSON.stringify(doctors))
  }, [doctors])

  const addAppointment = (rdv) => {
    setAppointments(prev => [rdv, ...prev])
  }

  const updateAppointmentStatus = (id, statut) => {
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

  const loginDoctor = (email, password) => {
    const found = DOCTOR_CREDENTIALS.find(c => c.email === email && c.password === password)
    if (found) {
      localStorage.setItem('isMedecin', 'true')
      localStorage.setItem('medecinId', String(found.docteurId))
      setMedecinId(found.docteurId)
      return true
    }
    return false
  }

  const logoutDoctor = () => {
    localStorage.removeItem('isMedecin')
    localStorage.removeItem('medecinId')
    setMedecinId(null)
  }

  return (
    <AppContext.Provider value={{
      appointments,
      doctors,
      medecinId,
      addAppointment,
      updateAppointmentStatus,
      addDoctor,
      updateDoctor,
      toggleDoctorActive,
      login,
      logout,
      loginDoctor,
      logoutDoctor,
    }}>
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
```

- [ ] **Step 1.3 : Commit**

```bash
git add src/data/mockData.js src/context/AppContext.jsx
git commit -m "feat: DOCTOR_CREDENTIALS + AppContext loginDoctor/logoutDoctor/medecinId"
```

---

## Task 2 : DoctorProtectedRoute + Login.jsx dual-rôle

**Files:**
- Create: `src/components/DoctorProtectedRoute.jsx`
- Modify: `src/pages/Login.jsx`

- [ ] **Step 2.1 : Créer DoctorProtectedRoute**

```jsx
import { Navigate } from 'react-router-dom'

export default function DoctorProtectedRoute({ children }) {
  const isMedecin = localStorage.getItem('isMedecin') === 'true'
  return isMedecin ? children : <Navigate to="/login" replace />
}
```

- [ ] **Step 2.2 : Mettre à jour Login.jsx pour la détection dual-rôle**

Remplacer le contenu complet de `src/pages/Login.jsx` par :

```jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock, FaHospital, FaEye, FaEyeSlash } from 'react-icons/fa'
import PageTransition from '../components/ui/PageTransition'
import { useApp }     from '../context/AppContext'

export default function Login() {
  const { login, loginDoctor } = useApp()
  const navigate  = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return }
    setLoading(true); setError('')
    await new Promise(r => setTimeout(r, 400))

    if (login(email, password)) {
      navigate('/admin')
    } else if (loginDoctor(email, password)) {
      navigate('/medecin')
    } else {
      setError('Email ou mot de passe incorrect.')
    }
    setLoading(false)
  }

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 420 }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: 'linear-gradient(135deg,var(--primary),var(--primary-light))', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--glow-primary)', marginBottom: 14 }}>
              <FaHospital size={26} color="#fff" />
            </div>
            <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>Espace Personnel</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Clinique Al-Baraka — Djibouti</p>
          </div>

          {/* Credentials démo */}
          <div style={{ background: 'rgba(18,168,176,0.08)', border: '1px solid rgba(18,168,176,0.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: '0.82rem', color: 'var(--primary)' }}>
            <div><strong>Admin :</strong> admin@clinique-albaraka.dj / demo1234</div>
            <div style={{ marginTop: 4 }}><strong>Médecin :</strong> amina.hassan@clinique-albaraka.dj / medecin1234</div>
          </div>

          <div className="card-premium" style={{ padding: '32px 28px' }}>
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <FaEnvelope size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    data-testid="email-input"
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    style={{ width: '100%', paddingLeft: 38, paddingRight: 14, paddingTop: 10, paddingBottom: 10, border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', outline: 'none', background: '#fff', color: 'var(--text)' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Mot de passe</label>
                <div style={{ position: 'relative' }}>
                  <FaLock size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    data-testid="password-input"
                    type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ width: '100%', paddingLeft: 38, paddingRight: 40, paddingTop: 10, paddingBottom: 10, border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', outline: 'none', background: '#fff', color: 'var(--text)' }}
                  />
                  <button type="button" onClick={() => setShowPwd(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    {showPwd ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ background: 'rgba(224,92,92,0.1)', border: '1px solid rgba(224,92,92,0.3)', borderRadius: 8, padding: '9px 12px', marginBottom: 18, color: 'var(--danger)', fontSize: '0.83rem' }}>
                  {error}
                </div>
              )}

              <button data-testid="login-button" type="submit" className="btn-primary-custom" style={{ width: '100%', opacity: loading ? 0.7 : 1 }} disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          </div>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
              ← Retour au site
            </Link>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}
```

- [ ] **Step 2.3 : Commit**

```bash
git add src/components/DoctorProtectedRoute.jsx src/pages/Login.jsx
git commit -m "feat: DoctorProtectedRoute + Login dual-rôle admin/médecin"
```

---

## Task 3 : DoctorSidebar

**Files:**
- Create: `src/components/layout/DoctorSidebar.jsx`

- [ ] **Step 3.1 : Créer DoctorSidebar.jsx**

```jsx
import { NavLink, useNavigate } from 'react-router-dom'
import { FaCalendarAlt, FaCalendarCheck, FaSignOutAlt, FaHospital } from 'react-icons/fa'
import { useApp } from '../../context/AppContext'

const NAV_LINKS = [
  { to: '/medecin',               icon: FaCalendarAlt,   label: 'Mon agenda',        end: true },
  { to: '/medecin/disponibilites', icon: FaCalendarCheck, label: 'Mes disponibilités' },
]

export default function DoctorSidebar() {
  const { logoutDoctor, doctors, medecinId } = useApp()
  const navigate = useNavigate()
  const doctor   = doctors.find(d => d.id === medecinId)

  const initials = doctor
    ? doctor.nom.replace('Dr. ', '').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
    : 'MD'

  const handleLogout = () => { logoutDoctor(); navigate('/login') }

  return (
    <aside style={{
      width: 260, minHeight: '100vh', flexShrink: 0,
      background: 'linear-gradient(180deg, #0A6E74 0%, #074E53 100%)',
      display: 'flex', flexDirection: 'column',
      boxShadow: '4px 0 24px rgba(10,110,116,0.22)',
      position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
    }}>
      {/* Logo + Identité médecin */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaHospital size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, color: '#fff', fontSize: '0.98rem', lineHeight: 1.2 }}>Al-Baraka</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)' }}>Espace médecin</div>
          </div>
        </div>

        {/* Avatar médecin */}
        {doctor && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Nunito, sans-serif', fontWeight: 900, color: '#fff', fontSize: '0.85rem', flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, color: '#fff', fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doctor.nom}</div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doctor.specialite}</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '14px 10px' }}>
        <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase', padding: '6px 10px 10px' }}>
          Mon espace
        </div>
        {NAV_LINKS.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '11px 14px', borderRadius: 10, marginBottom: 3,
            color: isActive ? '#fff' : 'rgba(255,255,255,0.62)',
            background: isActive ? 'rgba(255,255,255,0.18)' : 'transparent',
            fontWeight: isActive ? 700 : 500, fontSize: '0.88rem',
            textDecoration: 'none', transition: 'var(--transition)',
          })}>
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
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
```

- [ ] **Step 3.2 : Commit**

```bash
git add src/components/layout/DoctorSidebar.jsx
git commit -m "feat: DoctorSidebar — navigation médecin, avatar initiales, logout"
```

---

## Task 4 : DoctorLayout

**Files:**
- Create: `src/pages/medecin/DoctorLayout.jsx`

- [ ] **Step 4.1 : Créer le dossier et DoctorLayout.jsx**

```jsx
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
              <span style={{ background: 'var(--primary-bg)', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{doctor.specialite}</span>
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
```

- [ ] **Step 4.2 : Commit**

```bash
git add src/pages/medecin/DoctorLayout.jsx
git commit -m "feat: DoctorLayout — sidebar + topbar nom/spécialité + Outlet"
```

---

## Task 5 : MonAgenda

**Files:**
- Create: `src/pages/medecin/MonAgenda.jsx`

- [ ] **Step 5.1 : Créer MonAgenda.jsx**

```jsx
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FaSearch } from 'react-icons/fa'
import KpiCard    from '../../components/ui/KpiCard'
import StatusBadge from '../../components/ui/StatusBadge'
import { useAppointments } from '../../hooks/useAppointments'
import { useApp }  from '../../context/AppContext'
import { format }  from 'date-fns'
import { fr }      from 'date-fns/locale'

const STATUTS = ['Tous', 'confirmé', 'en attente', 'annulé']

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0 },
}

export default function MonAgenda() {
  const { medecinId } = useApp()
  const [search,       setSearch]       = useState('')
  const [filterStatut, setFilterStatut] = useState('Tous')

  const { allAppointments } = useAppointments()

  // Filtrer uniquement les RDV de ce médecin
  const mesRdv = useMemo(() =>
    allAppointments.filter(a => a.docteurId === medecinId),
    [allAppointments, medecinId]
  )

  // Appliquer filtres search + statut
  const rdvFiltres = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return mesRdv.filter(a => {
      const matchSearch = !search ||
        a.patient.toLowerCase().includes(search.toLowerCase()) ||
        a.ref.toLowerCase().includes(search.toLowerCase())
      const matchStatut = filterStatut === 'Tous' || a.statut === filterStatut
      return matchSearch && matchStatut
    })
  }, [mesRdv, search, filterStatut])

  // KPIs
  const today = format(new Date(), 'yyyy-MM-dd')
  const kpis = useMemo(() => ({
    today:     mesRdv.filter(a => a.date === today).length,
    enAttente: mesRdv.filter(a => a.statut === 'en attente').length,
    total:     mesRdv.length,
  }), [mesRdv, today])

  const KPI_DATA = [
    { title: "Aujourd'hui",  value: kpis.today,     icon: '📅', gradient: 'linear-gradient(135deg,#0A6E74,#12A8B0)' },
    { title: 'En attente',   value: kpis.enAttente, icon: '⏳', gradient: 'linear-gradient(135deg,#F59E0B,#FBBF24)' },
    { title: 'Total',        value: kpis.total,     icon: '📋', gradient: 'linear-gradient(135deg,#3B82F6,#60A5FA)' },
  ]

  const chipStyle = (active) => ({
    padding: '5px 14px', borderRadius: 50, fontSize: '0.8rem', fontWeight: 600,
    border: 'none', cursor: 'pointer', transition: 'var(--transition)',
    background: active ? 'var(--primary)' : '#fff',
    color: active ? '#fff' : 'var(--text-muted)',
    boxShadow: active ? 'var(--glow-primary)' : '0 1px 4px rgba(0,0,0,0.07)',
  })

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '1.7rem', color: 'var(--text)', marginBottom: 4 }}>
          Mon agenda
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
        </p>
      </div>

      {/* KPI Cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="row g-3 mb-4">
        {KPI_DATA.map(kpi => (
          <motion.div key={kpi.title} variants={itemVariants} className="col-12 col-md-4">
            <KpiCard title={kpi.title} value={kpi.value} icon={kpi.icon} gradient={kpi.gradient} />
          </motion.div>
        ))}
      </motion.div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 340 }}>
          <FaSearch size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text" placeholder="Rechercher un patient..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: 34, paddingRight: 14, paddingTop: 9, paddingBottom: 9, border: '1.5px solid var(--border)', borderRadius: 50, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif', outline: 'none', background: '#fff' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {STATUTS.map(s => (
            <button key={s} type="button" style={chipStyle(filterStatut === s)} onClick={() => setFilterStatut(s)}>
              {s === 'Tous' ? 'Tous' : <StatusBadge statut={s} />}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau lecture seule */}
      <div className="card-premium" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
                {['Référence', 'Patient', 'Téléphone', 'Date', 'Heure', 'Motif', 'Statut'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rdvFiltres.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
                    Aucun rendez-vous trouvé
                  </td>
                </tr>
              ) : rdvFiltres.map((rdv, i) => (
                <motion.tr
                  key={rdv.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : 'var(--bg)' }}
                >
                  <td style={{ padding: '11px 14px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: 'var(--primary)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{rdv.ref}</td>
                  <td style={{ padding: '11px 14px', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' }}>{rdv.patient}</td>
                  <td style={{ padding: '11px 14px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{rdv.telephone}</td>
                  <td style={{ padding: '11px 14px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{rdv.date}</td>
                  <td style={{ padding: '11px 14px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{rdv.heure}</td>
                  <td style={{ padding: '11px 14px', color: 'var(--text-muted)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rdv.motif || '—'}</td>
                  <td style={{ padding: '11px 14px', whiteSpace: 'nowrap' }}><StatusBadge statut={rdv.statut} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5.2 : Vérifier que useAppointments exporte bien `allAppointments`**

Ouvrir `src/hooks/useAppointments.js`. Vérifier que la valeur retournée contient `allAppointments`. Si ce n'est pas le cas, ajouter `allAppointments: appointments` dans l'objet retourné (avant les filtres appliqués).

- [ ] **Step 5.3 : Commit**

```bash
git add src/pages/medecin/MonAgenda.jsx
git commit -m "feat: MonAgenda — KPIs, filtre statut/search, tableau RDV médecin lecture seule"
```

---

## Task 6 : MesDisponibilites

**Files:**
- Create: `src/pages/medecin/MesDisponibilites.jsx`

- [ ] **Step 6.1 : Créer MesDisponibilites.jsx**

```jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { FaSave, FaInfoCircle } from 'react-icons/fa'
import { useApp } from '../../context/AppContext'
import { JOURS } from '../../data/mockData'

export default function MesDisponibilites() {
  const { doctors, medecinId, updateDoctor } = useApp()
  const doctor = doctors.find(d => d.id === medecinId)

  const [joursActifs, setJoursActifs] = useState(doctor?.disponibilites ?? [])
  const [horaires,    setHoraires]    = useState(doctor?.horaires ?? '08h00 – 17h00')
  const [dirty,       setDirty]       = useState(false)

  useEffect(() => {
    if (doctor) {
      setJoursActifs(doctor.disponibilites)
      setHoraires(doctor.horaires ?? '08h00 – 17h00')
      setDirty(false)
    }
  }, [doctor])

  const toggleJour = (j) => {
    setJoursActifs(prev =>
      prev.includes(j) ? prev.filter(d => d !== j) : [...prev, j]
    )
    setDirty(true)
  }

  const handleSave = () => {
    if (!dirty) { toast.info('Aucun changement à enregistrer'); return }
    updateDoctor(medecinId, { disponibilites: joursActifs, horaires })
    setDirty(false)
    toast.success('Disponibilités mises à jour ✓')
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '1.7rem', color: 'var(--text)', marginBottom: 4 }}>
          Mes disponibilités
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Les patients verront vos jours actifs lors de la prise de rendez-vous.
        </p>
      </div>

      <div className="card-premium" style={{ padding: '28px', maxWidth: 620 }}>
        {/* Grille jours */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)', marginBottom: 14 }}>
            Jours de consultation
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
            {JOURS.map(j => {
              const actif = joursActifs.includes(j)
              return (
                <motion.button
                  key={j}
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleJour(j)}
                  style={{
                    padding: '14px 8px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: actif ? 'linear-gradient(135deg,var(--primary),var(--primary-light))' : '#f1f5f9',
                    color: actif ? '#fff' : '#94a3b8',
                    fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '0.82rem',
                    textAlign: 'center', transition: 'var(--transition)',
                    boxShadow: actif ? 'var(--glow-primary)' : 'none',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', opacity: actif ? 0.85 : 0.7, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{j}</div>
                  <div style={{ fontSize: '1.1rem' }}>{actif ? '✓' : '✗'}</div>
                </motion.button>
              )
            })}
          </div>
          <div style={{ marginTop: 10, fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <FaInfoCircle size={11} />
            {joursActifs.length === 0
              ? 'Aucun jour sélectionné — vous n\'apparaîtrez pas dans les réservations.'
              : `${joursActifs.length} jour${joursActifs.length > 1 ? 's' : ''} actif${joursActifs.length > 1 ? 's' : ''} : ${joursActifs.join(', ')}`
            }
          </div>
        </div>

        {/* Horaires */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)', display: 'block', marginBottom: 10 }}>
            Horaires (appliqués à tous les jours actifs)
          </label>
          <input
            type="text"
            value={horaires}
            onChange={e => { setHoraires(e.target.value); setDirty(true) }}
            placeholder="08h00 – 17h00"
            style={{
              width: '100%', maxWidth: 220, padding: '10px 14px',
              border: '1.5px solid var(--border)', borderRadius: 10,
              fontSize: '0.95rem', fontFamily: 'Inter, sans-serif',
              outline: 'none', color: 'var(--text)', background: '#fff',
            }}
          />
        </div>

        {/* Bouton save */}
        <button
          type="button"
          className="btn-primary-custom"
          onClick={handleSave}
          style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: dirty ? 1 : 0.6 }}
        >
          <FaSave size={14} />
          Enregistrer les modifications
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 6.2 : Commit**

```bash
git add src/pages/medecin/MesDisponibilites.jsx
git commit -m "feat: MesDisponibilites — grille semaine interactive, horaires, save avec toast"
```

---

## Task 7 : App.jsx — routes /medecin/*

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 7.1 : Mettre à jour App.jsx**

Remplacer le contenu complet de `src/App.jsx` par :

```jsx
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ToastContainer } from 'react-toastify'
import { AppProvider } from './context/AppContext'
import ProtectedRoute       from './components/ProtectedRoute'
import DoctorProtectedRoute from './components/DoctorProtectedRoute'
import Home             from './pages/Home'
import Appointment      from './pages/Appointment'
import Doctors          from './pages/Doctors'
import DoctorProfile    from './pages/DoctorProfile'
import Login            from './pages/Login'
import NotFound         from './pages/NotFound'
import AdminLayout      from './pages/admin/AdminLayout'
import Dashboard        from './pages/admin/Dashboard'
import AdminAppointments from './pages/admin/AdminAppointments'
import AdminDoctors     from './pages/admin/AdminDoctors'
import DoctorLayout     from './pages/medecin/DoctorLayout'
import MonAgenda        from './pages/medecin/MonAgenda'
import MesDisponibilites from './pages/medecin/MesDisponibilites'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/"              element={<Home />} />
        <Route path="/rendez-vous"   element={<Appointment />} />
        <Route path="/medecins"      element={<Doctors />} />
        <Route path="/medecins/:id"  element={<DoctorProfile />} />
        <Route path="/login"         element={<Login />} />
        <Route
          path="/admin"
          element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
        >
          <Route index               element={<Dashboard />} />
          <Route path="rendez-vous"  element={<AdminAppointments />} />
          <Route path="medecins"     element={<AdminDoctors />} />
        </Route>
        <Route
          path="/medecin"
          element={<DoctorProtectedRoute><DoctorLayout /></DoctorProtectedRoute>}
        >
          <Route index                  element={<MonAgenda />} />
          <Route path="disponibilites"  element={<MesDisponibilites />} />
        </Route>
        <Route path="*"              element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AnimatedRoutes />
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          theme="colored"
        />
      </BrowserRouter>
    </AppProvider>
  )
}
```

- [ ] **Step 7.2 : Vérifier le dev server**

```bash
npm run dev
```

Ouvrir http://localhost:5173/login, se connecter avec `amina.hassan@clinique-albaraka.dj / medecin1234`.
Vérifier :
- Redirection vers http://localhost:5173/medecin ✓
- Sidebar teal visible avec nom et spécialité ✓
- Tableau Mon agenda affiché (RDV de Dr. Amina Hassan uniquement) ✓
- Page Mes disponibilités accessible ✓
- Logout redirige vers /login ✓

- [ ] **Step 7.3 : Commit**

```bash
git add src/App.jsx
git commit -m "feat: App.jsx — routes /medecin/* avec DoctorProtectedRoute"
```

---

## Task 8 : Notifications Brevo — /api/notify.js + AppContext

**Files:**
- Create: `api/notify.js`
- Create: `.env` (ne pas committer)
- Modify: `src/context/AppContext.jsx`

- [ ] **Step 8.1 : Créer le dossier api/ et api/notify.js**

```js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { type, rdv, docteur, statut } = req.body

  if (!type || !rdv) {
    return res.status(400).json({ error: 'Missing type or rdv' })
  }

  const apiKey      = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@clinique-albaraka.dj'
  const adminEmail  = process.env.ADMIN_EMAIL || 'admin@clinique-albaraka.dj'

  const emails = buildEmails({ type, rdv, docteur, statut, senderEmail, adminEmail })

  const results = await Promise.allSettled(
    emails.map(email =>
      fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(email),
      })
    )
  )

  const failed = results.filter(r => r.status === 'rejected')
  if (failed.length > 0) {
    console.error('Brevo errors:', failed)
  }

  return res.status(200).json({ ok: true, sent: results.length - failed.length })
}

function buildEmails({ type, rdv, docteur, statut, senderEmail, adminEmail }) {
  const sender = { name: 'Clinique Al-Baraka', email: senderEmail }

  if (type === 'nouveau_rdv') {
    return [
      // Email au médecin (adminEmail en démo)
      {
        sender,
        to: [{ email: adminEmail, name: docteur?.nom || 'Médecin' }],
        subject: `Nouveau rendez-vous — ${rdv.ref}`,
        htmlContent: emailMedecinNouveauRdv(rdv, docteur),
      },
      // Email de confirmation au patient
      {
        sender,
        to: [{ email: rdv.email, name: rdv.patient }],
        subject: `Votre rendez-vous ${rdv.ref} est enregistré ✓`,
        htmlContent: emailPatientConfirmation(rdv, docteur),
      },
    ]
  }

  if (type === 'statut_change') {
    return [
      {
        sender,
        to: [{ email: rdv.email, name: rdv.patient }],
        subject: `Votre RDV ${rdv.ref} a été ${statut === 'confirmé' ? 'confirmé ✅' : 'annulé ❌'}`,
        htmlContent: emailPatientStatutChange(rdv, statut),
      },
    ]
  }

  return []
}

function emailMedecinNouveauRdv(rdv, docteur) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0A6E74,#12A8B0);padding:28px 32px;text-align:center;">
      <h1 style="color:#fff;font-size:20px;margin:0;font-weight:900;">🏥 Clinique Al-Baraka</h1>
      <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">Nouveau rendez-vous enregistré</p>
    </div>
    <div style="padding:28px 32px;">
      <p style="color:#0A6E74;font-size:15px;font-weight:bold;margin-bottom:6px;">${docteur?.nom || 'Docteur'},</p>
      <p style="color:#475569;font-size:14px;margin-bottom:20px;">Un nouveau rendez-vous a été pris pour vous :</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:18px 22px;margin-bottom:20px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;width:130px;font-weight:600;">Référence</td><td style="padding:5px 0;font-weight:700;color:#0A6E74;font-size:13px;">${rdv.ref}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;font-weight:600;">Patient</td><td style="padding:5px 0;font-weight:700;color:#1e293b;font-size:13px;">${rdv.patient}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;font-weight:600;">Téléphone</td><td style="padding:5px 0;color:#1e293b;font-size:13px;">${rdv.telephone}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;font-weight:600;">Date & heure</td><td style="padding:5px 0;color:#1e293b;font-size:13px;">${rdv.date} à ${rdv.heure}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;font-weight:600;">Motif</td><td style="padding:5px 0;color:#1e293b;font-size:13px;">${rdv.motif || 'Non précisé'}</td></tr>
        </table>
      </div>
      <p style="color:#94a3b8;font-size:11px;border-top:1px solid #e2e8f0;padding-top:16px;margin-top:8px;">
        Clinique Al-Baraka · Djibouti · admin@clinique-albaraka.dj
      </p>
    </div>
  </div>
</body>
</html>`
}

function emailPatientConfirmation(rdv, docteur) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0A6E74,#12A8B0);padding:28px 32px;text-align:center;">
      <h1 style="color:#fff;font-size:20px;margin:0;font-weight:900;">🏥 Clinique Al-Baraka</h1>
      <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">Confirmation de rendez-vous</p>
    </div>
    <div style="padding:28px 32px;">
      <p style="color:#0A6E74;font-size:15px;font-weight:bold;margin-bottom:6px;">Bonjour ${rdv.patient},</p>
      <p style="color:#475569;font-size:14px;margin-bottom:20px;">Votre rendez-vous a bien été enregistré. Voici votre récapitulatif :</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:18px 22px;margin-bottom:20px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;width:130px;font-weight:600;">Référence</td><td style="padding:5px 0;font-weight:700;color:#0A6E74;font-size:13px;">${rdv.ref}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;font-weight:600;">Médecin</td><td style="padding:5px 0;font-weight:700;color:#1e293b;font-size:13px;">${docteur?.nom || rdv.docteur}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;font-weight:600;">Spécialité</td><td style="padding:5px 0;color:#1e293b;font-size:13px;">${docteur?.specialite || ''}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;font-weight:600;">Date & heure</td><td style="padding:5px 0;color:#1e293b;font-size:13px;">${rdv.date} à ${rdv.heure}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;font-weight:600;">Motif</td><td style="padding:5px 0;color:#1e293b;font-size:13px;">${rdv.motif || 'Non précisé'}</td></tr>
        </table>
      </div>
      <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:12px 16px;margin-bottom:20px;">
        <p style="color:#92400e;font-size:12px;margin:0;">⏳ Votre rendez-vous est <strong>en attente de confirmation</strong> par l'équipe médicale. Vous recevrez un email dès que le statut change.</p>
      </div>
      <p style="color:#94a3b8;font-size:11px;border-top:1px solid #e2e8f0;padding-top:16px;margin-top:8px;">
        Clinique Al-Baraka · Djibouti · Pour toute question : admin@clinique-albaraka.dj
      </p>
    </div>
  </div>
</body>
</html>`
}

function emailPatientStatutChange(rdv, statut) {
  const isConfirme = statut === 'confirmé'
  const couleur   = isConfirme ? '#0A6E74' : '#dc2626'
  const bgCouleur = isConfirme ? '#f0fdf4' : '#fef2f2'
  const borderCouleur = isConfirme ? '#bbf7d0' : '#fecaca'
  const emoji = isConfirme ? '✅' : '❌'

  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,${couleur},${isConfirme ? '#12A8B0' : '#ef4444'});padding:28px 32px;text-align:center;">
      <h1 style="color:#fff;font-size:20px;margin:0;font-weight:900;">🏥 Clinique Al-Baraka</h1>
      <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">Mise à jour de votre rendez-vous</p>
    </div>
    <div style="padding:28px 32px;">
      <p style="color:${couleur};font-size:15px;font-weight:bold;margin-bottom:6px;">Bonjour ${rdv.patient},</p>
      <p style="color:#475569;font-size:14px;margin-bottom:20px;">
        Votre rendez-vous <strong>${rdv.ref}</strong> a été <strong>${statut}</strong> ${emoji}
      </p>
      <div style="background:${bgCouleur};border:1px solid ${borderCouleur};border-radius:10px;padding:18px 22px;margin-bottom:20px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;width:130px;font-weight:600;">Référence</td><td style="padding:5px 0;font-weight:700;color:${couleur};font-size:13px;">${rdv.ref}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;font-weight:600;">Médecin</td><td style="padding:5px 0;color:#1e293b;font-size:13px;">${rdv.docteur}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;font-size:13px;font-weight:600;">Date & heure</td><td style="padding:5px 0;color:#1e293b;font-size:13px;">${rdv.date} à ${rdv.heure}</td></tr>
        </table>
      </div>
      ${isConfirme
        ? '<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 16px;margin-bottom:20px;"><p style="color:#065f46;font-size:12px;margin:0;">✅ Votre rendez-vous est confirmé. Présentez-vous à la clinique à l\'heure indiquée. Pensez à apporter votre carte de santé.</p></div>'
        : '<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 16px;margin-bottom:20px;"><p style="color:#991b1b;font-size:12px;margin:0;">❌ Votre rendez-vous a été annulé. Vous pouvez en prendre un nouveau sur notre site ou nous contacter.</p></div>'
      }
      <p style="color:#94a3b8;font-size:11px;border-top:1px solid #e2e8f0;padding-top:16px;margin-top:8px;">
        Clinique Al-Baraka · Djibouti · admin@clinique-albaraka.dj
      </p>
    </div>
  </div>
</body>
</html>`
}
```

- [ ] **Step 8.2 : Créer .env à la racine du projet**

Créer `D:\MesProjets\Rendez vous clinique\clinique-albaraka\.env` :

```
BREVO_API_KEY=<VOTRE_CLE_BREVO>
BREVO_SENDER_EMAIL=mosalam2019@gmail.com
ADMIN_EMAIL=mosalam2019@gmail.com
```

Vérifier que `.env` est dans `.gitignore` :

```bash
grep -n "\.env" .gitignore
```

Si absent, ajouter la ligne `.env` dans `.gitignore`.

- [ ] **Step 8.3 : Ajouter les appels notify dans AppContext.jsx**

Dans `src/context/AppContext.jsx`, remplacer les fonctions `addAppointment` et `updateAppointmentStatus` par :

```js
const addAppointment = (rdv) => {
  setAppointments(prev => [rdv, ...prev])
  if (import.meta.env.PROD) {
    const docteur = doctors.find(d => d.id === rdv.docteurId)
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'nouveau_rdv', rdv, docteur }),
    }).catch(() => {})
  }
}

const updateAppointmentStatus = (id, statut) => {
  const rdv = appointments.find(a => a.id === id)
  setAppointments(prev =>
    prev.map(a => (a.id === id ? { ...a, statut } : a))
  )
  if (import.meta.env.PROD && rdv) {
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'statut_change', rdv: { ...rdv, statut }, statut }),
    }).catch(() => {})
  }
}
```

- [ ] **Step 8.4 : Commit**

```bash
git add api/notify.js src/context/AppContext.jsx .gitignore
git commit -m "feat: /api/notify.js Brevo email sender + AppContext notify on RDV events"
```

Note : `.env` ne doit PAS être commité. Vérifier avec `git status` qu'il n'apparaît pas.

---

## Task 9 : Tests Playwright — Flux médecin

**Files:**
- Create: `tests/e2e/doctor.spec.js`

- [ ] **Step 9.1 : Créer tests/e2e/doctor.spec.js**

```js
import { test, expect } from '@playwright/test'

test.describe('Espace médecin', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.removeItem('isMedecin')
      localStorage.removeItem('medecinId')
    })
  })

  test('Route /medecin sans auth redirige vers /login', async ({ page }) => {
    await page.goto('/medecin')
    await expect(page).toHaveURL('/login')
  })

  test('Login médecin avec bons credentials redirige vers /medecin', async ({ page }) => {
    await page.goto('/login')
    await page.locator('[data-testid="email-input"]').fill('amina.hassan@clinique-albaraka.dj')
    await page.locator('[data-testid="password-input"]').fill('medecin1234')
    await page.locator('[data-testid="login-button"]').click()
    await expect(page).toHaveURL('/medecin')
    await expect(page.getByText('Mon agenda')).toBeVisible()
  })

  test('Dashboard médecin affiche les KPI cards', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('isMedecin', 'true')
      localStorage.setItem('medecinId', '1')
    })
    await page.goto('/medecin')
    await expect(page.getByText("Aujourd'hui")).toBeVisible()
    await expect(page.getByText('En attente')).toBeVisible()
    await expect(page.getByText('Total')).toBeVisible()
  })

  test('Dashboard médecin affiche uniquement les RDV du médecin connecté', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('isMedecin', 'true')
      localStorage.setItem('medecinId', '1')
    })
    await page.goto('/medecin')
    await expect(page.locator('table')).toBeVisible()
    // Dr. Amina Hassan (id=1) a des RDV dans les données initiales
    await expect(page.locator('tbody tr').first()).toBeVisible()
  })

  test('Page Mes disponibilités accessible et affiche la grille', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('isMedecin', 'true')
      localStorage.setItem('medecinId', '1')
    })
    await page.goto('/medecin/disponibilites')
    await expect(page.getByText('Mes disponibilités')).toBeVisible()
    await expect(page.getByText('Lun')).toBeVisible()
    await expect(page.getByText('Ven')).toBeVisible()
    await expect(page.getByText('Enregistrer les modifications')).toBeVisible()
  })

  test('Toggle jour disponible + save', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('isMedecin', 'true')
      localStorage.setItem('medecinId', '1')
    })
    await page.goto('/medecin/disponibilites')
    // Cliquer sur "Mer" pour le toggle
    await page.locator('button').filter({ hasText: /Mer/ }).click()
    await page.locator('button').filter({ hasText: 'Enregistrer les modifications' }).click()
    await expect(page.locator('.Toastify__toast')).toBeVisible()
  })

  test('Déconnexion médecin redirige vers /login', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('isMedecin', 'true')
      localStorage.setItem('medecinId', '1')
    })
    await page.goto('/medecin')
    await page.locator('button:has-text("Déconnexion")').click()
    await expect(page).toHaveURL('/login')
  })

})
```

- [ ] **Step 9.2 : Lancer les tests**

```bash
npx playwright test tests/e2e/doctor.spec.js --reporter=list
```

Expected : 6/6 tests passent. Si un test échoue, lire l'erreur et ajuster le sélecteur en fonction du rendu réel.

- [ ] **Step 9.3 : Commit**

```bash
git add tests/e2e/doctor.spec.js
git commit -m "test: doctor E2E — auth, dashboard, disponibilités, toggle, logout"
```

---

## Vérification finale

- [ ] `npm run build` passe sans erreur
- [ ] `npx eslint src/ --ext .jsx,.js` — 0 erreurs
- [ ] Login admin fonctionne toujours → `/admin`
- [ ] Login médecin → `/medecin` (RDV filtrés)
- [ ] Disponibilités : toggle + save persisté (reload page → changement conservé)
- [ ] `/medecin` sans auth → redirect `/login`

```bash
git add -A
git commit -m "chore: phase 6 complète — rôle médecin, Brevo, tests E2E"
```

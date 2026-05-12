import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FaSearch, FaTimes } from 'react-icons/fa'
import Navbar        from '../components/layout/Navbar'
import Footer        from '../components/layout/Footer'
import DoctorCard    from '../components/ui/DoctorCard'
import SkeletonCard  from '../components/ui/SkeletonCard'
import PageTransition from '../components/ui/PageTransition'
import { useApp }    from '../context/AppContext'
import { SPECIALITES } from '../data/mockData'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export default function Doctors() {
  const { doctors } = useApp()
  const [search,     setSearch]     = useState('')
  const [specialite, setSpecialite] = useState('Toutes')
  const [jour,       setJour]       = useState('')
  const [loading]                   = useState(false)

  const filtered = useMemo(() => {
    return doctors.filter(d => {
      if (d.actif === false) return false
      const matchSearch     = !search || d.nom.toLowerCase().includes(search.toLowerCase())
      const matchSpecialite = specialite === 'Toutes' || d.specialite === specialite
      const matchJour       = !jour || d.disponibilites.includes(jour)
      return matchSearch && matchSpecialite && matchJour
    })
  }, [doctors, search, specialite, jour])

  const chipStyle = (active) => ({
    padding: '6px 16px', borderRadius: 50, fontSize: '0.82rem', fontWeight: 600,
    cursor: 'pointer', border: 'none', transition: 'var(--transition)',
    background: active ? 'var(--primary)' : '#fff',
    color: active ? '#fff' : 'var(--text-muted)',
    boxShadow: active ? 'var(--glow-primary)' : '0 1px 4px rgba(0,0,0,0.08)',
  })

  return (
    <PageTransition>
      <Navbar />

      <main style={{ minHeight: '100vh', background: 'var(--bg)', padding: '40px 5% 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '2rem', color: 'var(--text)', marginBottom: 4 }}>
              Nos médecins
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              <strong style={{ color: 'var(--primary)' }}>{filtered.length}</strong> médecin{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Barre de recherche */}
          <div style={{ position: 'relative', maxWidth: 420, marginBottom: 20 }}>
            <FaSearch size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              data-testid="search-input"
              type="text"
              placeholder="Rechercher un médecin..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', paddingLeft: 38, paddingRight: search ? 36 : 14, paddingTop: 10, paddingBottom: 10,
                border: '1.5px solid var(--border)', borderRadius: 50, fontSize: '0.88rem',
                background: '#fff', outline: 'none', transition: 'var(--transition)',
                fontFamily: 'Inter, sans-serif', color: 'var(--text)',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <FaTimes size={13} />
              </button>
            )}
          </div>

          {/* Filtres spécialité */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {SPECIALITES.map(s => (
              <button key={s} style={chipStyle(specialite === s)} onClick={() => setSpecialite(s)}>
                {s}
              </button>
            ))}
          </div>

          {/* Filtres jour */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: 4 }}>Disponible :</span>
            {['', ...['Lun','Mar','Mer','Jeu','Ven']].map(j => (
              <button key={j || 'tous'} style={chipStyle(jour === j)} onClick={() => setJour(j)}>
                {j || 'Tous les jours'}
              </button>
            ))}
          </div>

          {/* Grille */}
          {loading ? (
            <div className="row g-3">
              {[1,2,3,4].map(i => <div key={i} className="col-12 col-sm-6 col-lg-3"><SkeletonCard /></div>)}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
              <h4 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>Aucun médecin trouvé</h4>
              <p style={{ color: 'var(--text-muted)' }}>Essayez de modifier vos filtres de recherche.</p>
              <button className="btn-primary-custom" style={{ marginTop: 16 }} onClick={() => { setSearch(''); setSpecialite('Toutes'); setJour('') }}>
                Réinitialiser les filtres
              </button>
            </motion.div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="row g-3">
              {filtered.map(doctor => (
                <motion.div key={doctor.id} variants={itemVariants} className="col-12 col-sm-6 col-lg-3">
                  <DoctorCard doctor={doctor} data-testid={`doctor-card-${doctor.id}`} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </PageTransition>
  )
}

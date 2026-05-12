import { useParams, useNavigate, Link } from 'react-router-dom'
import { Tab, Tabs } from 'react-bootstrap'
import { FaCalendarAlt, FaArrowLeft, FaClock, FaLanguage, FaBriefcase } from 'react-icons/fa'
import Navbar        from '../components/layout/Navbar'
import Footer        from '../components/layout/Footer'
import StarRating    from '../components/ui/StarRating'
import PageTransition from '../components/ui/PageTransition'
import { useApp }    from '../context/AppContext'
import { AVIS_MOCK } from '../data/mockData'

const JOURS_LABEL = { Lun: 'Lundi', Mar: 'Mardi', Mer: 'Mercredi', Jeu: 'Jeudi', Ven: 'Vendredi' }
const SPECIALITE_COLORS = { 'Médecine générale': '#0A6E74', 'Pédiatrie': '#3B82F6', 'Gynécologie': '#EC4899', 'Cardiologie': '#EF4444' }

export default function DoctorProfile() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const { doctors } = useApp()

  const doctor = doctors.find(d => d.id === Number(id))

  if (!doctor) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ fontSize: 56 }}>🏥</div>
        <h3 style={{ fontFamily: 'Nunito, sans-serif' }}>Médecin introuvable</h3>
        <button className="btn-primary-custom" onClick={() => navigate('/medecins')}>Retour à la liste</button>
      </div>
    )
  }

  const color = SPECIALITE_COLORS[doctor.specialite] || 'var(--primary)'

  return (
    <PageTransition>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 80 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 5% 0' }}>

          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Accueil</Link>
            <span>›</span>
            <Link to="/medecins" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Médecins</Link>
            <span>›</span>
            <span style={{ color: 'var(--text)', fontWeight: 600 }}>{doctor.nom}</span>
          </nav>

          {/* Hero profil */}
          <div className="card-premium" style={{ padding: '28px', marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img src={doctor.photo} alt={doctor.nom} style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${color}`, boxShadow: `0 0 0 6px ${color}18` }} />
                {doctor.actif && <span style={{ position: 'absolute', bottom: 4, right: 4, width: 16, height: 16, background: 'var(--success)', borderRadius: '50%', border: '2.5px solid #fff', animation: 'pulse 2s infinite' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h1 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '1.6rem', color: 'var(--text)', marginBottom: 8 }}>{doctor.nom}</h1>
                <span style={{ display: 'inline-block', background: `${color}18`, color, fontSize: '0.8rem', fontWeight: 700, padding: '3px 12px', borderRadius: 20, marginBottom: 12 }}>{doctor.specialite}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <StarRating rating={doctor.rating} size={16} />
                  <span style={{ fontWeight: 700, color: 'var(--text)' }}>{doctor.rating}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({doctor.consultations} consultations)</span>
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><FaBriefcase size={12} />{doctor.experience} d'expérience</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><FaLanguage size={12} />{doctor.langues.join(', ')}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><FaClock size={12} />{doctor.horaires}</span>
                </div>
              </div>
              <button className="btn-primary-custom d-none d-md-flex" style={{ flexShrink: 0, alignItems: 'center', gap: 8 }} onClick={() => navigate(`/rendez-vous?docteur=${doctor.id}`)}>
                <FaCalendarAlt size={13} />
                Prendre RDV
              </button>
            </div>
          </div>

          {/* Onglets Bootstrap */}
          <div className="card-premium" style={{ padding: '24px' }}>
            <Tabs defaultActiveKey="bio" className="mb-3">
              <Tab eventKey="bio" title="Biographie">
                <p style={{ color: 'var(--text)', lineHeight: 1.75, fontSize: '0.95rem', padding: '8px 0' }}>
                  {doctor.bio}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
                  {doctor.langues.map(l => (
                    <span key={l} style={{ background: 'var(--primary-bg)', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>
                      {l}
                    </span>
                  ))}
                </div>
              </Tab>

              <Tab eventKey="dispo" title="Disponibilités">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, padding: '8px 0' }}>
                  {['Lun','Mar','Mer','Jeu','Ven'].map(j => {
                    const available = doctor.disponibilites.includes(j)
                    return (
                      <div key={j} style={{
                        background: available ? 'var(--primary-bg)' : '#f8f9fa',
                        border: `1.5px solid ${available ? 'var(--primary)' : 'var(--border)'}`,
                        borderRadius: 10, padding: '12px 16px', textAlign: 'center',
                        opacity: available ? 1 : 0.5,
                      }}>
                        <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, color: available ? 'var(--primary)' : 'var(--text-muted)', marginBottom: 4 }}>{JOURS_LABEL[j]}</div>
                        <div style={{ fontSize: '0.75rem', color: available ? 'var(--primary)' : 'var(--text-muted)' }}>
                          {available ? doctor.horaires : 'Fermé'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Tab>

              <Tab eventKey="avis" title="Avis patients">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '8px 0' }}>
                  {AVIS_MOCK.map((avis, i) => (
                    <div key={i} style={{ background: 'var(--bg)', borderRadius: 10, padding: '14px 16px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Nunito, sans-serif', fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>
                          {avis.nom[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)' }}>{avis.nom}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <StarRating rating={avis.note} size={11} />
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{avis.date}</span>
                          </div>
                        </div>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text)', fontStyle: 'italic', lineHeight: 1.6 }}>"{avis.commentaire}"</p>
                    </div>
                  ))}
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Bouton sticky mobile */}
      <div className="d-md-none" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 16px', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(10px)', borderTop: '1px solid var(--border)', zIndex: 900 }}>
        <button className="btn-primary-custom" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} onClick={() => navigate(`/rendez-vous?docteur=${doctor.id}`)}>
          <FaCalendarAlt size={14} />
          Prendre RDV avec {doctor.nom.split(' ')[1]}
        </button>
      </div>

      <Footer />
    </PageTransition>
  )
}

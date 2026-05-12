import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaCalendarAlt, FaHeartbeat, FaBaby, FaFemale, FaStethoscope,
  FaArrowRight, FaCheckCircle,
} from 'react-icons/fa'
import Navbar           from '../components/layout/Navbar'
import Footer           from '../components/layout/Footer'
import DoctorCard       from '../components/ui/DoctorCard'
import AnimatedCounter  from '../components/ui/AnimatedCounter'
import PageTransition   from '../components/ui/PageTransition'
import { useApp }       from '../context/AppContext'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const SPECIALITES_LIST = [
  { icon: FaStethoscope, label: 'Médecine générale', color: '#0A6E74', desc: 'Suivi et prévention' },
  { icon: FaBaby,        label: 'Pédiatrie',          color: '#3B82F6', desc: 'Santé de l\'enfant' },
  { icon: FaFemale,      label: 'Gynécologie',        color: '#EC4899', desc: 'Santé féminine' },
  { icon: FaHeartbeat,   label: 'Cardiologie',        color: '#EF4444', desc: 'Cœur et vaisseaux' },
]

const HOW_STEPS = [
  { num: '01', title: 'Choisissez un médecin', desc: 'Parcourez nos spécialistes et consultez leurs profils, disponibilités et avis patients.' },
  { num: '02', title: 'Réservez votre créneau', desc: 'Sélectionnez la date et l\'heure qui vous conviennent parmi les créneaux disponibles.' },
  { num: '03', title: 'Recevez la confirmation', desc: 'Notre équipe valide votre rendez-vous et vous contacte par téléphone ou email.' },
]

export default function Home() {
  const navigate = useNavigate()
  const { doctors } = useApp()

  return (
    <PageTransition>
      {/* Navbar sans spacer — le hero a padding-top:100px pour compenser */}
      <Navbar noSpacer />

      {/* ═══ HERO ═══ */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A6E74 0%, #0d8a92 40%, #12A8B0 70%, #0A6E74 100%)',
        backgroundSize: '300% 300%',
        animation: 'gradientShift 10s ease infinite',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '100px 5% 60px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Overlay image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=30)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.07,
        }} />
        {/* Cercles décoratifs */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 340, height: 340, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720 }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'var(--glass-bg)', backdropFilter: 'blur(10px)',
              border: '1px solid var(--glass-border)', color: '#fff',
              fontSize: '0.75rem', fontWeight: 700, padding: '5px 14px',
              borderRadius: 50, marginBottom: 24, letterSpacing: '0.8px',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#27AE60', boxShadow: '0 0 8px #27AE60', animation: 'pulse 2s infinite', flexShrink: 0 }} />
              CLINIQUE AL-BARAKA · DJIBOUTI
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
            style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.4rem)', color: '#fff', lineHeight: 1.2, marginBottom: 18, letterSpacing: '-0.5px' }}
          >
            Votre santé,<br />
            <span style={{ color: 'var(--accent)', textShadow: '0 2px 20px rgba(244,168,35,0.4)' }}>notre priorité</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', marginBottom: 32, lineHeight: 1.7, maxWidth: 540, margin: '0 auto 32px' }}
          >
            Prenez rendez-vous en ligne en 3 minutes — disponible 6j/7, sans attente.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 44 }}
          >
            <button className="btn-accent-custom" style={{ padding: '12px 32px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => navigate('/rendez-vous')}>
              <FaCalendarAlt size={15} />
              Prendre rendez-vous
            </button>
            <button
              style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)', color: '#fff', padding: '12px 28px', borderRadius: 50, fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'var(--transition)' }}
              onClick={() => navigate('/medecins')}
            >
              Nos médecins <FaArrowRight size={12} style={{ marginLeft: 4 }} />
            </button>
          </motion.div>

          {/* Stats glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            {[
              { target: 4,   suffix: '',   label: 'Médecins spécialisés' },
              { target: 500, suffix: '+',  label: 'Patients satisfaits' },
              { target: 6,   suffix: 'j/7',label: 'Jours d\'ouverture' },
            ].map(({ target, suffix, label }) => (
              <div key={label} style={{
                background: 'var(--glass-bg)', backdropFilter: 'blur(10px)',
                border: '1px solid var(--glass-border)', borderRadius: 12,
                padding: '12px 20px', minWidth: 120,
              }}>
                <AnimatedCounter target={target} suffix={suffix} label={label} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ SPÉCIALITÉS ═══ */}
      <section style={{ padding: '80px 5%', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ background: 'var(--primary-bg)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, padding: '4px 14px', borderRadius: 20, letterSpacing: '0.8px' }}>
              NOS SPÉCIALITÉS
            </span>
            <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '2rem', color: 'var(--text)', marginTop: 12, marginBottom: 8 }}>
              Des soins spécialisés pour chaque besoin
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>
              Nos médecins expérimentés couvrent toutes les spécialités essentielles pour votre famille.
            </p>
          </div>

          <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="row g-3">
            {SPECIALITES_LIST.map(({ icon: Icon, label, color, desc }) => (
              <motion.div key={label} variants={itemVariants} className="col-6 col-md-3">
                <div
                  style={{
                    background: '#fff', borderRadius: 'var(--radius)', padding: '28px 20px',
                    textAlign: 'center', border: '1px solid var(--border)',
                    transition: 'var(--transition)', cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/medecins?specialite=${encodeURIComponent(label)}`)}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--glow-primary)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
                >
                  <div style={{ width: 58, height: 58, borderRadius: 16, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <Icon size={24} color={color} />
                  </div>
                  <h6 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>{label}</h6>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ MÉDECINS ═══ */}
      <section style={{ padding: '80px 5%', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span style={{ background: 'var(--primary-bg)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, padding: '4px 14px', borderRadius: 20, letterSpacing: '0.8px' }}>
                NOTRE ÉQUIPE
              </span>
              <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '2rem', color: 'var(--text)', marginTop: 10, marginBottom: 0 }}>
                Médecins disponibles
              </h2>
            </div>
            <button style={{ background: 'none', border: '1.5px solid var(--primary)', color: 'var(--primary)', padding: '8px 20px', borderRadius: 50, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'var(--transition)' }} onClick={() => navigate('/medecins')}>
              Voir tous les médecins →
            </button>
          </div>

          <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="row g-3">
            {doctors.filter(d => d.actif !== false).slice(0, 4).map(doctor => (
              <motion.div key={doctor.id} variants={itemVariants} className="col-12 col-sm-6 col-lg-3">
                <DoctorCard doctor={doctor} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ COMMENT ÇA MARCHE ═══ */}
      <section style={{ padding: '80px 5%', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ background: 'var(--primary-bg)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, padding: '4px 14px', borderRadius: 20, letterSpacing: '0.8px' }}>
            PROCESSUS
          </span>
          <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '2rem', color: 'var(--text)', marginTop: 12, marginBottom: 48 }}>
            Comment ça marche ?
          </h2>
          <div style={{ display: 'flex', gap: 0, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
            {HOW_STEPS.map(({ num, title, desc }, index) => (
              <div key={num} style={{ flex: '1 1 220px', maxWidth: 260, padding: '0 16px', position: 'relative' }}>
                {index < HOW_STEPS.length - 1 && (
                  <div style={{ position: 'absolute', top: 28, right: -20, color: 'var(--primary-light)', fontSize: '1.5rem', fontWeight: 300 }} className="d-none d-md-block">
                    →
                  </div>
                )}
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),var(--primary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: 'var(--glow-primary)' }}>
                  <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, color: '#fff', fontSize: '1rem' }}>{num}</span>
                </div>
                <h5 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>{title}</h5>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section style={{ padding: '64px 5%', background: 'linear-gradient(135deg,var(--primary) 0%,var(--primary-light) 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '1.9rem', color: '#fff', marginBottom: 12 }}>
            Prenez soin de vous dès aujourd'hui
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 28 }}>
            Rejoignez les 500+ patients qui nous font confiance. Réservation en ligne, simple et rapide.
          </p>
          <button className="btn-accent-custom" style={{ padding: '14px 40px', fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: 10 }} onClick={() => navigate('/rendez-vous')}>
            <FaCalendarAlt size={16} />
            Prendre un rendez-vous maintenant
          </button>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
            {['Sans inscription', 'Confirmation immédiate', 'Gratuit'].map(t => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem' }}>
                <FaCheckCircle size={13} color="#27AE60" />{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </PageTransition>
  )
}

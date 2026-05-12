import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import StarRating from './StarRating'
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'

const SPECIALITE_COLORS = {
  'Médecine générale': '#0A6E74',
  'Pédiatrie':         '#3B82F6',
  'Gynécologie':       '#EC4899',
  'Cardiologie':       '#EF4444',
}

export default function DoctorCard({ doctor, 'data-testid': testId }) {
  const navigate = useNavigate()
  const color = SPECIALITE_COLORS[doctor.specialite] || 'var(--primary)'

  return (
    <motion.div
      data-testid={testId}
      className="card-premium"
      whileHover={{ y: -4 }}
      style={{ cursor: 'pointer', height: '100%' }}
      onClick={() => navigate(`/medecins/${doctor.id}`)}
    >
      <div style={{ padding: '20px 20px 18px' }}>
        {/* Photo + info */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={doctor.photo}
              alt={doctor.nom}
              style={{
                width: 62, height: 62, borderRadius: '50%', objectFit: 'cover',
                border: `2.5px solid ${color}`,
                boxShadow: `0 0 0 4px ${color}22`,
              }}
            />
            {doctor.actif !== false && (
              <span style={{
                position: 'absolute', bottom: 1, right: 1,
                width: 13, height: 13, background: 'var(--success)',
                borderRadius: '50%', border: '2.5px solid #fff',
                animation: 'pulse 2.2s ease-in-out infinite',
              }} />
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h6 style={{ margin: 0, fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)', marginBottom: 4 }}>
              {doctor.nom}
            </h6>
            <span style={{
              display: 'inline-block',
              background: `${color}18`, color,
              fontSize: '0.71rem', fontWeight: 700,
              padding: '2px 9px', borderRadius: 20,
            }}>
              {doctor.specialite}
            </span>
          </div>
        </div>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
          <StarRating rating={doctor.rating} size={12} />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)' }}>{doctor.rating}</span>
          <span style={{ fontSize: '0.71rem', color: 'var(--text-muted)' }}>· {doctor.consultations} consultations</span>
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
          <FaMapMarkerAlt size={10} color="var(--text-muted)" />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Clinique Al-Baraka, Djibouti</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 16 }}>
          <FaCalendarAlt size={10} color="var(--text-muted)" />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doctor.disponibilites.join(' · ')}</span>
        </div>

        {/* CTA */}
        <button
          className="btn-primary-custom"
          style={{ width: '100%', fontSize: '0.85rem', padding: '9px 0' }}
          onClick={e => { e.stopPropagation(); navigate(`/rendez-vous?docteur=${doctor.id}`) }}
        >
          Prendre RDV
        </button>
      </div>
    </motion.div>
  )
}

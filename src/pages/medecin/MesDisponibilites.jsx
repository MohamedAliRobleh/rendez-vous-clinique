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

  /* eslint-disable react-hooks/set-state-in-effect -- reset form when medecinId changes */
  useEffect(() => {
    if (doctor) {
      setJoursActifs(doctor.disponibilites)
      setHoraires(doctor.horaires ?? '08h00 – 17h00')
      setDirty(false)
    }
  }, [doctor])
  /* eslint-enable react-hooks/set-state-in-effect */

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

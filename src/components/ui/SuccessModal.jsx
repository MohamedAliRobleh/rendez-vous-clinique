import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheckCircle, FaTimes, FaCalendarAlt, FaClock, FaUserMd } from 'react-icons/fa'

const CONFETTI_COLORS = ['#0A6E74','#12A8B0','#F4A823','#27AE60','#fff','#E8F7F8']

const CONFETTI_SIZES = Array.from({ length: 28 }, () => ({
  width: Math.random() * 7 + 4,
  height: Math.random() * 7 + 4,
}))

export default function SuccessModal({ rdv, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(26,35,50,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}
        onClick={onClose}
      >
        {/* Confetti CSS */}
        {CONFETTI_SIZES.map((item, i) => (
          <div key={i} style={{
            position: 'fixed',
            left: `${5 + (i * 3.3) % 90}%`,
            top: 0,
            width: item.width,
            height: item.height,
            background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            borderRadius: i % 3 === 0 ? '50%' : 2,
            animation: `confettiFall ${1.4 + (i % 5) * 0.3}s ease-in ${(i % 8) * 0.1}s forwards`,
            pointerEvents: 'none',
          }} />
        ))}

        <motion.div
          initial={{ scale: 0.82, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          style={{
            background: '#fff', borderRadius: 20, padding: '36px 28px 28px',
            maxWidth: 420, width: '100%', textAlign: 'center',
            position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
          }}
          onClick={e => e.stopPropagation()}
        >
          <button onClick={onClose} style={{
            position: 'absolute', top: 14, right: 14,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', padding: 4,
          }}>
            <FaTimes size={18} />
          </button>

          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}>
            <FaCheckCircle size={60} color="var(--success)" style={{ marginBottom: 16 }} />
          </motion.div>

          <h4 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, color: 'var(--text)', marginBottom: 6 }}>
            Rendez-vous confirmé !
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 20 }}>
            Votre demande a bien été enregistrée. Notre équipe vous contactera pour confirmation.
          </p>

          {/* Ref card */}
          <div style={{ background: 'var(--primary-bg)', borderRadius: 12, padding: '16px 20px', marginBottom: 22, textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Numéro de référence
            </div>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '1.3rem', color: 'var(--primary)', letterSpacing: '0.5px' }}>
              {rdv?.ref}
            </div>
            <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'center', fontSize: '0.82rem', color: 'var(--text)' }}>
                <FaUserMd size={12} color="var(--primary)" />
                <strong>{rdv?.docteur}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <FaCalendarAlt size={11} color="var(--text-muted)" />
                {rdv?.date}
                <FaClock size={11} color="var(--text-muted)" style={{ marginLeft: 6 }} />
                {rdv?.heure}
              </div>
            </div>
          </div>

          <button className="btn-primary-custom" style={{ width: '100%' }} onClick={onClose}>
            Fermer
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

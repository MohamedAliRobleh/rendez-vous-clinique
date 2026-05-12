import { motion, AnimatePresence } from 'framer-motion'
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa'

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(26,35,50,0.68)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          style={{
            background: '#fff', borderRadius: 16, padding: '28px 24px',
            maxWidth: 360, width: '100%', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)', position: 'relative',
          }}
          onClick={e => e.stopPropagation()}
        >
          <button onClick={onCancel} style={{ position: 'absolute', top: 12, right: 13, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <FaTimes size={16} />
          </button>
          <FaExclamationTriangle size={40} color="var(--warning)" style={{ marginBottom: 14 }} />
          <h5 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, marginBottom: 8 }}>
            Confirmer l'action
          </h5>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 22 }}>{message}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              style={{
                flex: 1, padding: '9px 0', border: '1.5px solid var(--border)',
                borderRadius: 50, background: '#fff', color: 'var(--text)',
                fontWeight: 600, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', fontSize: '0.88rem',
              }}
              onClick={onCancel}
            >
              Annuler
            </button>
            <button
              style={{
                flex: 1, padding: '9px 0', border: 'none', borderRadius: 50,
                background: 'var(--danger)', color: '#fff',
                fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', fontSize: '0.88rem',
                boxShadow: '0 4px 12px rgba(224,92,92,0.35)',
              }}
              onClick={onConfirm}
            >
              Confirmer
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

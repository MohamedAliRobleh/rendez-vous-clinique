import { motion } from 'framer-motion'

export default function KpiCard({ title, value, icon, gradient, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: '0 8px 32px rgba(10,110,116,0.25)' }}
      style={{
        background: gradient || 'linear-gradient(135deg,var(--primary),var(--primary-light))',
        borderRadius: 'var(--radius)', padding: '22px 24px', color: '#fff',
        boxShadow: 'var(--glow-primary)', position: 'relative', overflow: 'hidden',
        height: '100%', transition: 'var(--transition)',
      }}
    >
      <div style={{ position: 'absolute', right: -8, top: -8, fontSize: 68, opacity: 0.13 }}>{icon}</div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, opacity: 0.85, marginBottom: 6, letterSpacing: '0.3px' }}>{title}</div>
        <div style={{ fontSize: '2.2rem', fontFamily: 'Nunito, sans-serif', fontWeight: 900, lineHeight: 1 }}>{value}</div>
        {subtitle && <div style={{ fontSize: '0.72rem', opacity: 0.72, marginTop: 5 }}>{subtitle}</div>}
      </div>
    </motion.div>
  )
}

import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/ui/PageTransition'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <PageTransition>
      <Navbar />
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
          <div style={{ fontSize: '6rem', marginBottom: 8, lineHeight: 1 }}>🏥</div>
          <h1 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '5rem', color: 'var(--primary)', lineHeight: 1, marginBottom: 8 }}>404</h1>
          <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>Page introuvable</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 340, margin: '0 auto 28px' }}>
            La page que vous cherchez n'existe pas ou a été déplacée.
          </p>
          <button className="btn-primary-custom" onClick={() => navigate('/')}>
            ← Retour à l'accueil
          </button>
        </motion.div>
      </div>
      <Footer />
    </PageTransition>
  )
}

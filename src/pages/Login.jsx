import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock, FaHospital, FaEye, FaEyeSlash } from 'react-icons/fa'
import PageTransition from '../components/ui/PageTransition'
import { useApp }     from '../context/AppContext'

export default function Login() {
  const { login } = useApp()
  const navigate  = useNavigate()
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [showPwd,   setShowPwd]   = useState(false)
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return }
    setLoading(true); setError('')
    await new Promise(r => setTimeout(r, 400))
    const ok = login(email, password)
    setLoading(false)
    if (ok) navigate('/admin')
    else setError('Email ou mot de passe incorrect.')
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
            <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>Espace Administration</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Clinique Al-Baraka — Djibouti</p>
          </div>

          {/* Credentials démo */}
          <div style={{ background: 'rgba(18,168,176,0.08)', border: '1px solid rgba(18,168,176,0.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: '0.82rem', color: 'var(--primary)' }}>
            <strong>Accès démo :</strong> admin@clinique-albaraka.dj / demo1234
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
                    placeholder="admin@clinique-albaraka.dj"
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

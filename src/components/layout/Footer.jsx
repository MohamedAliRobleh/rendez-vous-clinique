import { Link } from 'react-router-dom'
import { FaHospital, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--text)', color: 'rgba(255,255,255,0.8)', padding: '52px 5% 24px', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="row g-4" style={{ marginBottom: 36 }}>

          {/* Brand */}
          <div className="col-12 col-md-4">
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,var(--primary),var(--primary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaHospital size={18} color="#fff" />
              </div>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '1.1rem', color: '#fff' }}>Clinique Al-Baraka</span>
            </div>
            <p style={{ fontSize: '0.83rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.55)', marginBottom: 16 }}>
              Votre santé, notre engagement. Une équipe médicale dévouée au service des patients de Djibouti depuis 2010.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[FaFacebook, FaInstagram, FaWhatsapp].map((Icon, i) => (
                <a key={i} href="#" style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', transition: 'var(--transition)' }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="col-6 col-md-2">
            <h6 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, color: '#fff', marginBottom: 16, fontSize: '0.9rem' }}>Navigation</h6>
            {[['/', 'Accueil'], ['/medecins', 'Nos médecins'], ['/rendez-vous', 'Prendre RDV'], ['/login', 'Admin']].map(([to, label]) => (
              <Link key={to} to={to} style={{ display: 'block', color: 'rgba(255,255,255,0.55)', fontSize: '0.83rem', marginBottom: 9, transition: 'var(--transition)', textDecoration: 'none' }}>{label}</Link>
            ))}
          </div>

          {/* Spécialités */}
          <div className="col-6 col-md-2">
            <h6 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, color: '#fff', marginBottom: 16, fontSize: '0.9rem' }}>Spécialités</h6>
            {['Médecine générale', 'Pédiatrie', 'Gynécologie', 'Cardiologie'].map(s => (
              <div key={s} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.83rem', marginBottom: 9 }}>{s}</div>
            ))}
          </div>

          {/* Contact */}
          <div className="col-12 col-md-4">
            <h6 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, color: '#fff', marginBottom: 16, fontSize: '0.9rem' }}>Contact</h6>
            {[
              [FaMapMarkerAlt, 'Plateau, Avenue de la République, Djibouti-Ville'],
              [FaPhone,        '+253 77 00 11 22'],
              [FaEnvelope,     'contact@clinique-albaraka.dj'],
            ].map(([Icon, text]) => (
              <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                <Icon size={13} color="var(--accent)" style={{ marginTop: 3, flexShrink: 0 }} />
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.58)', lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
            <div style={{ marginTop: 8, display: 'inline-block', background: 'rgba(39,174,96,0.15)', border: '1px solid rgba(39,174,96,0.3)', borderRadius: 20, padding: '3px 12px', fontSize: '0.76rem', color: '#27AE60' }}>
              ● Ouvert 6j/7 · 08h00 – 18h00
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>© 2026 Clinique Al-Baraka · Djibouti. Tous droits réservés.</span>
          <span style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.25)' }}>Prise de rendez-vous en ligne</span>
        </div>
      </div>
    </footer>
  )
}

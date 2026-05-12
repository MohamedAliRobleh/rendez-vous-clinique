import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import KpiCard    from '../../components/ui/KpiCard'
import StatusBadge from '../../components/ui/StatusBadge'
import { useAppointments } from '../../hooks/useAppointments'
import { useApp }  from '../../context/AppContext'
import { format }  from 'date-fns'
import { fr }      from 'date-fns/locale'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0 },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { kpis, upcoming } = useAppointments()
  const { doctors } = useApp()

  const rdvParMedecin = doctors.map(d => ({
    ...d,
    count: upcoming.filter(a => a.docteurId === d.id).length,
  }))

  const KPI_DATA = [
    { title: 'Total rendez-vous',  value: kpis.total,     icon: '📅', gradient: 'linear-gradient(135deg,#0A6E74,#12A8B0)' },
    { title: "Aujourd'hui",        value: kpis.today,     icon: '📆', gradient: 'linear-gradient(135deg,#3B82F6,#60A5FA)' },
    { title: 'En attente',         value: kpis.enAttente, icon: '⏳', gradient: 'linear-gradient(135deg,#F59E0B,#FBBF24)' },
    { title: 'Confirmés',          value: kpis.confirmes, icon: '✅', gradient: 'linear-gradient(135deg,#10B981,#34D399)' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '1.7rem', color: 'var(--text)', marginBottom: 4 }}>
          Tableau de bord
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
        </p>
      </div>

      {/* KPI Cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="row g-3 mb-4">
        {KPI_DATA.map(kpi => (
          <motion.div key={kpi.title} variants={itemVariants} className="col-6 col-xl-3">
            <KpiCard title={kpi.title} value={kpi.value} icon={kpi.icon} gradient={kpi.gradient} />
          </motion.div>
        ))}
      </motion.div>

      <div className="row g-3">
        {/* Prochains RDV */}
        <div className="col-12 col-lg-8">
          <div className="card-premium" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h5 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, margin: 0 }}>Prochains rendez-vous</h5>
              <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }} onClick={() => navigate('/admin/rendez-vous')}>
                Voir tout →
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    {['Référence', 'Patient', 'Médecin', 'Date', 'Statut'].map(h => (
                      <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {upcoming.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Aucun rendez-vous à venir</td></tr>
                  ) : upcoming.map((rdv, i) => (
                    <tr key={rdv.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : 'var(--bg)' }}>
                      <td style={{ padding: '10px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: 'var(--primary)', fontSize: '0.8rem' }}>{rdv.ref}</td>
                      <td style={{ padding: '10px', color: 'var(--text)', fontWeight: 500 }}>{rdv.patient}</td>
                      <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{rdv.docteur}</td>
                      <td style={{ padding: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{rdv.date} · {rdv.heure}</td>
                      <td style={{ padding: '10px' }}><StatusBadge statut={rdv.statut} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RDV par médecin */}
        <div className="col-12 col-lg-4">
          <div className="card-premium" style={{ padding: '22px' }}>
            <h5 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, marginBottom: 18 }}>RDV par médecin</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {rdvParMedecin.map(d => (
                <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={d.photo} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-bg)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.83rem', fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.nom}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{d.specialite}</div>
                  </div>
                  <span style={{ background: 'var(--primary-bg)', color: 'var(--primary)', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '0.9rem', padding: '2px 10px', borderRadius: 20, flexShrink: 0 }}>
                    {d.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaTimes, FaUser, FaPhone, FaEnvelope, FaCalendarAlt, FaClock, FaNotesMedical } from 'react-icons/fa'
import KpiCard    from '../../components/ui/KpiCard'
import StatusBadge from '../../components/ui/StatusBadge'
import { useAppointments } from '../../hooks/useAppointments'
import { useApp }  from '../../context/AppContext'
import { format }  from 'date-fns'
import { fr }      from 'date-fns/locale'

const STATUTS = ['Tous', 'confirmé', 'en attente', 'annulé']

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0 },
}

function DetailRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(10,110,116,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
        <Icon size={13} color="var(--primary)" />
      </div>
      <div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: '0.88rem', color: 'var(--text)', fontWeight: 600 }}>{value}</div>
      </div>
    </div>
  )
}

function PatientModal({ rdv, onClose }) {
  return (
    <AnimatePresence>
      {rdv && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.22 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 16, width: '100%', maxWidth: 460,
              boxShadow: '0 20px 60px rgba(0,0,0,0.18)', overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, color: '#fff', fontSize: '1.1rem' }}>{rdv.patient}</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.78rem', marginTop: 2 }}>Réf. {rdv.ref}</div>
              </div>
              <button
                onClick={onClose}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, cursor: 'pointer', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
              >
                <FaTimes size={15} />
              </button>
            </div>

            {/* Statut */}
            <div style={{ padding: '14px 24px', background: 'var(--bg)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Statut :</span>
              <StatusBadge statut={rdv.statut} />
            </div>

            {/* Détails */}
            <div style={{ padding: '4px 24px 20px' }}>
              <DetailRow icon={FaPhone}       label="Téléphone"   value={rdv.telephone} />
              <DetailRow icon={FaEnvelope}    label="Email"       value={rdv.email} />
              <DetailRow icon={FaCalendarAlt} label="Date"        value={rdv.date ? format(new Date(rdv.date), 'EEEE d MMMM yyyy', { locale: fr }) : null} />
              <DetailRow icon={FaClock}       label="Heure"       value={rdv.heure} />
              <DetailRow icon={FaNotesMedical} label="Motif"      value={rdv.motif} />
              <DetailRow icon={FaUser}        label="Médecin"     value={rdv.docteur} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function MonAgenda() {
  const { medecinId } = useApp()
  const [search,       setSearch]       = useState('')
  const [filterStatut, setFilterStatut] = useState('Tous')
  const [selectedRdv,  setSelectedRdv]  = useState(null)

  const { allAppointments } = useAppointments()

  const mesRdv = useMemo(() =>
    allAppointments.filter(a => a.docteurId === medecinId),
    [allAppointments, medecinId]
  )

  const rdvFiltres = useMemo(() => {
    return mesRdv.filter(a => {
      const matchSearch = !search ||
        a.patient.toLowerCase().includes(search.toLowerCase()) ||
        a.ref.toLowerCase().includes(search.toLowerCase())
      const matchStatut = filterStatut === 'Tous' || a.statut === filterStatut
      return matchSearch && matchStatut
    })
  }, [mesRdv, search, filterStatut])

  const today = format(new Date(), 'yyyy-MM-dd')
  const kpis = useMemo(() => ({
    today:     mesRdv.filter(a => a.date === today).length,
    enAttente: mesRdv.filter(a => a.statut === 'en attente').length,
    total:     mesRdv.length,
  }), [mesRdv, today])

  const KPI_DATA = [
    { title: "Aujourd'hui",  value: kpis.today,     icon: '📅', gradient: 'linear-gradient(135deg,#0A6E74,#12A8B0)' },
    { title: 'En attente',   value: kpis.enAttente, icon: '⏳', gradient: 'linear-gradient(135deg,#F59E0B,#FBBF24)' },
    { title: 'Total',        value: kpis.total,     icon: '📋', gradient: 'linear-gradient(135deg,#3B82F6,#60A5FA)' },
  ]

  const chipStyle = (active) => ({
    padding: '5px 14px', borderRadius: 50, fontSize: '0.8rem', fontWeight: 600,
    border: 'none', cursor: 'pointer', transition: 'var(--transition)',
    background: active ? 'var(--primary)' : '#fff',
    color: active ? '#fff' : 'var(--text-muted)',
    boxShadow: active ? 'var(--glow-primary)' : '0 1px 4px rgba(0,0,0,0.07)',
  })

  return (
    <div>
      <PatientModal rdv={selectedRdv} onClose={() => setSelectedRdv(null)} />

      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '1.7rem', color: 'var(--text)', marginBottom: 4 }}>
          Mon agenda
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
        </p>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="row g-3 mb-4">
        {KPI_DATA.map(kpi => (
          <motion.div key={kpi.title} variants={itemVariants} className="col-12 col-md-4">
            <KpiCard title={kpi.title} value={kpi.value} icon={kpi.icon} gradient={kpi.gradient} />
          </motion.div>
        ))}
      </motion.div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 340 }}>
          <FaSearch size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text" placeholder="Rechercher un patient..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: 34, paddingRight: 14, paddingTop: 9, paddingBottom: 9, border: '1.5px solid var(--border)', borderRadius: 50, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif', outline: 'none', background: '#fff' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {STATUTS.map(s => (
            <button key={s} type="button" style={chipStyle(filterStatut === s)} onClick={() => setFilterStatut(s)}>
              {s === 'Tous' ? 'Tous' : <StatusBadge statut={s} />}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        Cliquez sur une ligne pour voir les détails du patient
      </div>

      <div className="card-premium" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
                {['Référence', 'Patient', 'Téléphone', 'Date', 'Heure', 'Motif', 'Statut'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rdvFiltres.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
                    Aucun rendez-vous trouvé
                  </td>
                </tr>
              ) : rdvFiltres.map((rdv, i) => (
                <motion.tr
                  key={rdv.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedRdv(rdv)}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    background: i % 2 === 0 ? '#fff' : 'var(--bg)',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  whileHover={{ backgroundColor: 'rgba(10,110,116,0.05)' }}
                >
                  <td style={{ padding: '11px 14px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: 'var(--primary)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{rdv.ref}</td>
                  <td style={{ padding: '11px 14px', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' }}>{rdv.patient}</td>
                  <td style={{ padding: '11px 14px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{rdv.telephone}</td>
                  <td style={{ padding: '11px 14px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{rdv.date}</td>
                  <td style={{ padding: '11px 14px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{rdv.heure}</td>
                  <td style={{ padding: '11px 14px', color: 'var(--text-muted)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rdv.motif || '—'}</td>
                  <td style={{ padding: '11px 14px', whiteSpace: 'nowrap' }}><StatusBadge statut={rdv.statut} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { FaSearch, FaCheck, FaTimes, FaDownload } from 'react-icons/fa'
import StatusBadge   from '../../components/ui/StatusBadge'
import ConfirmModal  from '../../components/ui/ConfirmModal'
import { useAppointments } from '../../hooks/useAppointments'

const STATUTS = ['Tous', 'confirmé', 'en attente', 'annulé']

export default function AdminAppointments() {
  const [search,       setSearch]       = useState('')
  const [filterStatut, setFilterStatut] = useState('Tous')
  const [confirmAction, setConfirmAction] = useState(null)

  const { appointments, updateAppointmentStatus } = useAppointments({
    search,
    statut: filterStatut,
  })

  const handleConfirm = (rdv) => {
    updateAppointmentStatus(rdv.id, 'confirmé')
    toast.success(`${rdv.ref} confirmé`)
  }

  const handleCancel = (rdv) => {
    setConfirmAction({
      message: `Annuler le rendez-vous ${rdv.ref} de ${rdv.patient} ?`,
      onConfirm: () => {
        updateAppointmentStatus(rdv.id, 'annulé')
        toast.info(`${rdv.ref} annulé`)
        setConfirmAction(null)
      },
    })
  }

  const chipStyle = (active) => ({
    padding: '5px 14px', borderRadius: 50, fontSize: '0.8rem', fontWeight: 600,
    border: 'none', cursor: 'pointer', transition: 'var(--transition)',
    background: active ? 'var(--primary)' : '#fff',
    color: active ? '#fff' : 'var(--text-muted)',
    boxShadow: active ? 'var(--glow-primary)' : '0 1px 4px rgba(0,0,0,0.07)',
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '1.6rem', color: 'var(--text)', marginBottom: 2 }}>Rendez-vous</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{appointments.length} résultat{appointments.length > 1 ? 's' : ''}</p>
        </div>
        <button type="button" disabled title="Fonctionnalité bientôt disponible" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 50, border: '1.5px solid var(--border)', background: '#fff', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, cursor: 'not-allowed', opacity: 0.5 }}>
          <FaDownload size={12} /> Exporter CSV
        </button>
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 340 }}>
          <FaSearch size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text" placeholder="Rechercher patient ou médecin..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: 34, paddingRight: 14, paddingTop: 9, paddingBottom: 9, border: '1.5px solid var(--border)', borderRadius: 50, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif', outline: 'none', background: '#fff' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {STATUTS.map(s => (
            <button key={s} style={chipStyle(filterStatut === s)} onClick={() => setFilterStatut(s)}>
              {s === 'Tous' ? 'Tous' : <StatusBadge statut={s} />}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div className="card-premium" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
                {['Référence', 'Patient', 'Téléphone', 'Médecin', 'Date', 'Heure', 'Motif', 'Statut', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                    Aucun rendez-vous trouvé
                  </td>
                </tr>
              ) : appointments.map((rdv, i) => (
                <motion.tr
                  key={rdv.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : 'var(--bg)' }}
                >
                  <td style={{ padding: '11px 14px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: 'var(--primary)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{rdv.ref}</td>
                  <td style={{ padding: '11px 14px', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' }}>{rdv.patient}</td>
                  <td style={{ padding: '11px 14px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{rdv.telephone}</td>
                  <td style={{ padding: '11px 14px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{rdv.docteur}</td>
                  <td style={{ padding: '11px 14px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{rdv.date}</td>
                  <td style={{ padding: '11px 14px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{rdv.heure}</td>
                  <td style={{ padding: '11px 14px', color: 'var(--text-muted)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rdv.motif || '—'}</td>
                  <td style={{ padding: '11px 14px', whiteSpace: 'nowrap' }}><StatusBadge statut={rdv.statut} /></td>
                  <td style={{ padding: '11px 14px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {rdv.statut === 'en attente' && (
                        <button
                          type="button"
                          title="Confirmer"
                          onClick={() => handleConfirm(rdv)}
                          style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(39,174,96,0.12)', border: '1px solid rgba(39,174,96,0.3)', color: '#27AE60', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <FaCheck size={11} />
                        </button>
                      )}
                      {rdv.statut !== 'annulé' && (
                        <button
                          type="button"
                          title="Annuler"
                          onClick={() => handleCancel(rdv)}
                          style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(224,92,92,0.1)', border: '1px solid rgba(224,92,92,0.25)', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <FaTimes size={11} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {confirmAction && (
        <ConfirmModal
          message={confirmAction.message}
          onConfirm={confirmAction.onConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  )
}

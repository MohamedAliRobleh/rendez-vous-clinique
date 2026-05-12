export default function StatusBadge({ statut }) {
  const config = {
    'confirmé':   { bg: 'rgba(39,174,96,0.12)',  color: '#27AE60', dot: '#27AE60', label: 'Confirmé'   },
    'en attente': { bg: 'rgba(244,168,35,0.15)', color: '#C47D00', dot: '#F4A823', label: 'En attente' },
    'annulé':     { bg: 'rgba(224,92,92,0.12)',  color: '#E05C5C', dot: '#E05C5C', label: 'Annulé'     },
  }
  const { bg, color, dot, label } = config[statut] || config['en attente']

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: bg, color, fontWeight: 700, fontSize: '0.75rem',
      padding: '3px 10px', borderRadius: 50,
      fontFamily: 'Nunito, sans-serif', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, display: 'inline-block', flexShrink: 0 }} />
      {label}
    </span>
  )
}

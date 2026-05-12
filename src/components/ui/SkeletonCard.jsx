export default function SkeletonCard() {
  return (
    <div className="card-premium" style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
        <div className="skeleton" style={{ width: 60, height: 60, borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 13, width: '65%', marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 10, width: '40%' }} />
        </div>
      </div>
      <div className="skeleton" style={{ height: 9, width: '90%', marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 9, width: '75%', marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 9, width: '55%', marginBottom: 18 }} />
      <div className="skeleton" style={{ height: 38, borderRadius: 50 }} />
    </div>
  )
}

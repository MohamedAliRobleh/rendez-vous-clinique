import React from 'react'

export default function StepIndicator({ currentStep }) {
  const steps = [
    { num: 1, label: 'Médecin' },
    { num: 2, label: 'Date & heure' },
    { num: 3, label: 'Vos infos' },
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 36 }}>
      {steps.map(({ num, label }, index) => {
        const isCompleted = num < currentStep
        const isActive    = num === currentStep

        return (
          <React.Fragment key={num}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 72 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: '0.95rem',
                background: isCompleted
                  ? 'var(--success)'
                  : isActive
                  ? 'linear-gradient(135deg,var(--primary),var(--primary-light))'
                  : 'var(--border)',
                color: (isCompleted || isActive) ? '#fff' : 'var(--text-muted)',
                boxShadow: isActive ? 'var(--glow-primary)' : 'none',
                transition: 'var(--transition)',
              }}>
                {isCompleted ? '✓' : num}
              </div>
              <span style={{
                fontSize: '0.73rem', fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                whiteSpace: 'nowrap',
              }}>
                {label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div style={{
                height: 2, flex: 1, maxWidth: 60,
                background: num < currentStep ? 'var(--primary)' : 'var(--border)',
                marginTop: 18, transition: 'var(--transition)',
              }} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

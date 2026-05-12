import { useAnimatedCounter } from '../../hooks/useAnimatedCounter'

export default function AnimatedCounter({ target, suffix = '', label, style: extStyle }) {
  const { count, ref } = useAnimatedCounter(target)

  return (
    <div ref={ref} style={{ textAlign: 'center', ...extStyle }}>
      <div style={{
        fontSize: '2.4rem', fontFamily: 'Nunito, sans-serif', fontWeight: 900,
        color: '#fff', lineHeight: 1,
      }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.78)', fontWeight: 500, marginTop: 4 }}>
        {label}
      </div>
    </div>
  )
}
